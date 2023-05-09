const fs = require('fs');
const path = require('node:path');
const { stdout } = process;

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  if(err) throw err;
  files.forEach(file => {
    if(!file.isDirectory()) {
      const newPathToFiles = path.join(pathToFolder, file.name);
      const extensionInFile = path.extname(newPathToFiles);
      const removePeriodFromExtension =  extensionInFile.replace('.', '');
      const removeExtensionFromFileName = file.name.replace(extensionInFile, '');
      fs.stat(newPathToFiles, function(err, stats) {
        const moveSizeToKb = stats.size / 1024;
        stdout.write(`${removeExtensionFromFileName} - ${removePeriodFromExtension} - ${moveSizeToKb}kb\n`);
      });
    }
  });
});


