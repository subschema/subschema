#!/usr/bin/env bash
#This script publishes the current p
DIR=${PWD##*/}
GH_DIR=${1:-"../${DIR}-gh-pages"}
GH_REPO=${GH_REPO:-origin}

OPWD=$PWD
HASH=

function check(){
    echo "Check"
    open $GH_DIR/index.html &
}


function push(){
    echo "Pushing"
    cd $GH_DIR && \
	git add -A && \
	git commit -a -m "Updated hash ${HASH}" && \
	git push origin gh-pages && \
	echo "gh-pages now running $HASH "
}

function build(){
   echo "Building"
   cd $OPWD && \
   rm -rf .build && \
   npm run demo && \
   HASH=$(ls ./.build/app.*.js | sed 's,.*app\.\(.*\)\.js,\1,g' )
   echo "Using Hash: ${HASH}"
   rm $GH_DIR/*
   cp ./.build/* $GH_DIR && \
   sed "s/\"app\(\.entry\)\{0,1\}\.js\"/\"app.${HASH}.js\"/" ./public/index.html > $GH_DIR/index.html
}

function init_git() {
   echo "Initing git"
   ORIGIN=$(git remote show -n $GH_REPO | grep Fetch | sed 's,.*Fetch URL:,,') && \
   mkdir $GH_DIR &&\
   cd $GH_DIR &&\
   git init && \
   git remote add origin $ORIGIN && \
   git checkout -b gh-pages
}


[ ! -d $GH_DIR ] && init_git

build && \
check
read -p "Do you want to push[y|Y]" dp;
case $dp in
	y|Y) push;;
	*) echo "Don't forget to publish"; exit 0;;
esac
