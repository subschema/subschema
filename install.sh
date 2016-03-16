#!/usr/bin/env bash
for pkg in subschema-test-support subschema subschema-project subschema-demo; do
  echo "installing $pkg";
  (cd $pkg && npm install || echo "$pkg failed!">/dev/stderr);
done
