#Shims
===
This directory is for shimming.  So we can run this in external React mode.  
It works by aliasing react and then using the externals where possible.
Webpack's externals do not behave like alias's that is dependencies do not
use with react et al depedencies will by default include them.

This is a hack to make dependencies that need react, react-dom, etc,
will use the externals.

The transition group stuff was requiring ./React which was importing the whole
world.