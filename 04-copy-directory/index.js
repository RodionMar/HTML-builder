const fs = require('fs');
const path = require('node:path');

const pathToFileCopy = path.join(__dirname, 'files-copy');
const pathToOriginalFile = path.join(__dirname, 'files');

fs.rmdir(pathToFileCopy, {recursive: true}, () => {
  fs.mkdir(pathToFileCopy, {recursive: true}, (err) => {
    if(err) throw err;
    fs.readdir(pathToOriginalFile, (err, files) => {
      for (let i = 0; i < files.length; i++) {
        const filePath = path.join(__dirname, 'files', files[i]);
        const copyFilePath = path.join(__dirname, 'files-copy', files[i]);
        fs.copyFile(filePath, copyFilePath,  (err) => {
          if(err) throw err;
        });
      }
    });
  });
});

















// files.forEach(file => {
         
//    const filePath = path.join(__dirname, 'files', file)
//    const copyFilePath = path.join(__dirname, 'files-copy', file)
//    const copyFileContent = fs.copyFile(filePath, copyFilePath, err => {
//       if(err) throw err
//    })
// })