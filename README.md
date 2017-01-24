Rearrange
==============


### A node script for reorganizing your project files

This isn't on npm so to install...

````js
npm install amindunited/node_file_mover
````

#### Usage

1. Require this class
2. Create a config
3. Create a new instance of and pass the config to it
4. Revel in the glory of your copied files!

````js
"use strict";

// Step 1.
let Rearrange = require('rearrange');

// Step 2.
let config = {
  matches: [
    {
      src: './src',
      match: ['*.html'],
      dest: './dist'
    },
    {
      src: './src',
      match: ['*.js'],
      dest: './dist/scripts'
    },
    {
      src: './src/css',
      match: ['*.css'],
      dest: './dist/styles'
    }
  ]
};

// Step 3.
new Rearrange(config);

```` 

