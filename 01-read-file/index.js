const fs = require('fs');
const path = require('node:path');
const { stdout } = process;

const pathToText = path.join('./', '01-read-file/', 'text.txt');
const readerText = fs.createReadStream(pathToText);

readerText.on('data', function (textContent) {
  stdout.write(textContent);
});