'use strict';

const fs = require('fs-extra')
const FileHound = require('filehound');

class Rearrange {

  constructor(config) {
    this.tasks = config.matches;
    this.tasksToRun = this.tasks;
    this.run();
  }

  moveFiles(files, task) {
    //Keep an array of file that need to be processed
    let filesToMove = files;
    //Remove the current file from that array
    let oldPath = filesToMove.shift();

    //Remove the leading './' from the paths so that they match the real paths 
    let src_partial = task.src.replace(/^\.\//, '');
    let dest_partial = task.dest.replace(/^\.\//, '');
    let newPath = oldPath.replace(src_partial, dest_partial);

    //Make sure the dedstination directory exists
    if (!fs.existsSync(task.dest)){
      fs.mkdirSync(task.dest);
    }

    //Wrap the copy task in a promise for flow control
    return new Promise((resolve, reject) => {
      fs.copy(oldPath, newPath, (err) => {
        if (err) throw err;
        //If there are move files to move...call this method again, else resolve
        if (filesToMove.length) {
          this.moveFiles(filesToMove, task).then(()=>{
            resolve.apply();
          });
        } else {
          resolve.apply();
        }
      });
    });
  }

  search(task) {
    //Wrap the file search task in a promise for flow control
    return new Promise((resolve, reject)=>{
      FileHound.create()
      .paths(task.src)
      .match(task.match[0])
      .find((err, results) => {
        if (!err) {
          this.moveFiles(results, task)
          .then(() => {
            resolve.apply();
          },() => {
            reject.apply();
          });
        }
      });
    });
  }

  run() {
    //Remove this task from the tasks array
    this.search(this.tasksToRun.shift())
    .then(()=>{
      //If there are other tasks to call...call this method again
      if (this.tasksToRun.length) {
        this.run();
      }
    });
  }
}

/**
 * Example usage
 */
/*
new Rearrange({
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
});
*/