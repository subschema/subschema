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
 echo "$1" >/dev/stderr;
 exit 1;
}
function publish(){
  npm version ${1:-'patch'} --tag &&\
  npm publish &&\
  git push --tags
}

for pkg in subschema-test-support subschema subschema-project subschema-demo; do
  echo "cleaning $pkg";
  cd $pkg && clean || fail "Could not clean $pkg"
  cd ..
done

for pkg in subschema-test-support subschema subschema-project subschema-demo; do
  echo "installing $pkg";
  cd $pkg && install || fail "Could not install $pkg"
  cd ..
done

for pkg in subschema-test-support subschema subschema-project subschema-demo; do
  echo "publishing $pkg";
  cd $pkg && publish $VERSION || fail "Could not publish $pkg"
  cd ..
done

for pkg in subschema subschema-project subschema-demo; do
  echo "publishing $pkg";
  cd $pkg && ./gh-pages.sh || fail "Could not publish $pkg"
  cd ..
done

