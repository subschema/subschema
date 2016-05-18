#!/usr/bin/env bash
VERSION=${1:-'patch'}
function clean {
    rm -rf ./node_modules
    return $?
}

function joinstr {
 local IFS="$1";
 shift;
 echo "$*";
}

PROJECTS=$(find . -maxdepth 1 -type d -name 'subschema*' -not -name '*-gh-pages' | sed 's,\./,,g')

function updateDepVersion(){
  PROJ=${1:-$PROJECTS}
  FPKG=$(joinstr "," $PROJ)
  GPKG=$(joinstr "|" $PROJ)
  echo "$GPKG - $FPKG"
  for pkg in $PROJ; do
      find "./$pkg" -type f -name 'package.json*' | egrep -v node_modules | xargs sed "s,\"\($GPKG\)\"\s*:\s*\"\^\(.*\)\", \"\1\":\ \"\^${VERSION}\","

  done
}

function inst {
  npm install
  return $?
}

function fail {
 if [ -n $1 ]; then
  echo "ERROR: $*" >/dev/stderr;
 fi
 exit 1;
}

function publish(){
  npm version ${1:-'patch'} --tag &&\
  npm publish &&\
  git push --tags
}

function cleanAll(){
 for pkg in ${1:-subschema subschema-project subschema-demo}; do
   echo "cleaning $pkg";
   cd $pkg && clean || fail "Could not clean $pkg"
   cd ..
 done
}

function installAll(){
 for pkg in ${1:-subschema subschema-project subschema-demo}; do
   echo "installing $pkg";
   cd $pkg && inst || fail "Could not install $pkg"
   cd ..
 done
}

function publishAll(){
 for pkg in ${1:-subschema subschema-project subschema-demo}; do
  echo "publishing $pkg";
  cd $pkg && publish $VERSION || fail "Could not publish $pkg"
  cd ..
 done
}

function ghAll(){
 for pkg in ${1:-subschema-project subschema-demo}; do
  if [ -f $pkg/gh-pages.sh ];then
     echo "github pages $pkg";
     cd $pkg && ./gh-pages.sh || fail "Could not github pages $pkg"
     cd ..
  fi
 done
}

function tag(){
  git commit -a -m "Tagging version $VERSION" && \
  git tag "v${VERSION}" &&\
  git push --tags || fail && \
  git push
}

function everything(){
 cleanAll $1
 installAll $1
 publishAll $1
 ghAll $1
 tag
}

function nexttag() {
    local TAG=$(git describe --abbrev=0 --tags);
    let nextnum=$(echo $TAG | sed 's/\(v[0-9]*\.[0-9]*\.\)\([0-9]*\)/\2/g')+1;
    echo "$(echo $TAG | sed 's/v\([0-9]*\.[0-9]*\.\)\([0-9]*\)/\1/g')${nextnum}"
}

function help(){
 echo "$0 <VERSION> -h help -a all -c clean -i install,publish,github -p publish github -g github [project...]"
 fail $*
}

echo "$1 $2";
if [[ -z $1 ]]; then
  help "The next tag is $(nexttag)";
fi

if [[ -z $2 ]]; then
  everything $3
else
 case $2 in
  --help|-h|help) help;;
  all|-a)    everything $3;;
  clean|-c)  cleanAll $3;;
  install|-i)installAll $3;publishAll $3;ghAll $3;;
  publish|-p)publishAll $3; ghAll $3;;
  github|-g) ghAll $3;;
  tag|-t) tag;;
  *) help "unknown option $2";;
 esac

fi

