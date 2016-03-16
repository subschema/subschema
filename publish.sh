#!/usr/bin/env bash
VERSION=${1:-'patch'}
function clean {
    rm -rf ./node_modules
    return $?
}

function inst {
  npm install
  return $?
}
function fail {
 echo "ERROR: $1" >/dev/stderr;
 exit 1;
}
function publish(){
  npm version ${1:-'patch'} --tag &&\
  npm publish &&\
  git push --tags
}

function cleanAll(){
 for pkg in ${1:-subschema-test-support subschema subschema-project subschema-demo}; do
   echo "cleaning $pkg";
   cd $pkg && clean || fail "Could not clean $pkg"
   cd ..
 done
}

function installAll(){
 for pkg in ${1:-subschema-test-support subschema subschema-project subschema-demo}; do
   echo "installing $pkg";
   cd $pkg && inst || fail "Could not install $pkg"
   cd ..
 done
}

function publishAll(){
 for pkg in ${1:-subschema-test-support subschema subschema-project subschema-demo}; do
  echo "publishing $pkg";
  cd $pkg && publish $VERSION || fail "Could not publish $pkg"
  cd ..
 done
}

function ghAll(){
 for pkg in ${1:-subschema-project subschema-demo}; do
  echo "github pages $pkg";
  cd $pkg && ./gh-pages.sh || fail "Could not github pages $pkg"
  cd ..
 done
}
function everything(){
 cleanAll
 installAll
 publishAll
 ghAll
}

function help(){
 echo "$0 <VERSION> -a all -c clean -i install,publish,github -p publish github -g github [project]"
 exit 1
}

echo "$1 $2";
if [[ -z $1 ]]; then
  help;
fi

if [[ -z $2 ]]; then
  everything
else
 case $2 in
  --help|-h|help) help;;
  all|-a)    everything;;
  clean|-c)  cleanAll $3;;
  install|-i)installAll $3;publishAll $3;ghAll $3;;
  publish|-p)publishAll $3;ghAll $3;;
  github|-g) ghAll $3;;
  *) fail "unknown option $2";;
 esac

fi

