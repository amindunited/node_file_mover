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
    console.log('move files got ', files, task.dest);
    let filesToMove = files;
    let oldPath = filesToMove.shift();
    let newPath = oldPath.replace(/(.*\/)/, task.dest+'/');

    if (!fs.existsSync(task.dest)){
      fs.mkdirSync(task.dest);
    }

    console.log('shoudl rename ', oldPath, 'to', newPath);
    return new Promise((resolve, reject) => {

      fs.copy(oldPath, newPath, (err) => {
        if (err) throw err;
        if (filesToMove.length) {
          console.log('still have ', filesToMove.length, ' files to move');
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
    return new Promise((resolve, reject)=>{
      FileHound.create()
      .paths(task.src)
      .match(task.match[0])
      .find((err, results) => {
        console.log('err', err, 'results', results);
        if (!err) {
          this.moveFiles(results, task)
          .then(() => {
            console.log('in the then')
            resolve.apply();
          });
        }
      });
    });
  }

  run() {
    console.log('in run', this.tasksToRun[0]);
    this.search(this.tasksToRun.shift())
    .then(()=>{
      if (this.tasksToRun.length) {
        this.run();
      }
    });
  }
}

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
    }
  ]
});