Subschema Demo
===
The Demo app for Subschema

##Demo
See it in action [here](http://subschema.github.io/subschema)

Or run it 

```sh
  git clone https://github.com/subschema/subschema-demo.git
  git clone https://github.com/subschema/subschema.git
  cd subschema
  npm install 
  cd ../subschema-demo
  npm install
  npm run hot &
  open http://localhost:8082
```

*Note:
In order to make it easy to debug/test subschema subschema-demo does not use the subschema package. Webpack looks
directly in the directory.   Yes, a little of a PNA, may make it a switch in the future but for now...
