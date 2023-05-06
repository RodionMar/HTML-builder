const fs = require('fs');
const path = require('node:path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStreamToBundleFile = fs.createWriteStream(pathToBundle);


fs.writeFile(pathToBundle, '', err => {
  if(err) throw err;
  fs.readdir(pathToStyles, {withFileTypes: true}, (err, files) => {
    if(err) throw err;
    files.forEach(file => {
      if(file.isFile()) {
        const pathToStyleFiles = path.join(pathToStyles, file.name);
        const extensionInFile = path.extname(pathToStyleFiles);
        if(extensionInFile === '.css') {
          const styleArray = [];
          const readStreamToStyleFiles = fs.createReadStream(pathToStyleFiles, 'utf-8');
          readStreamToStyleFiles.on('data', styleContent => {
            styleArray.push(styleContent);
            writeStreamToBundleFile.write(styleArray.toString());
          });
        }
      }
    });
  });
});