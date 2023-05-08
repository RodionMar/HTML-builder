const fs = require('fs');
const path = require('node:path');
const { stdout } = process;

const pathToText = path.join(__dirname, 'text.txt');
const readerText = fs.createReadStream(pathToText);

readerText.on('data', function (textContent) {
  stdout.write(textContent);
});