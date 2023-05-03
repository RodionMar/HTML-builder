const fs = require('fs');
const path = require('node:path');
const { stdout } = process;
const pathToText = path.join('./', '01-read-file/', 'text.txt');

fs.readFile(pathToText, 'utf-8', function(error, textContent) {
  if (error) {throw error;} else {stdout.write(textContent);}
});

