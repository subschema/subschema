This directory is for shimming.  So we can run this in external React mode.  
It works by aliasing react and then using the externals where possible.


The transition group stuff was requiring ./React which was importing the whole
world.