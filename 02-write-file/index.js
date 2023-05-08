const fs = require('fs');
const path = require('node:path');
const process = require('node:process');
const { stdin, stdout} = process;
const pathToText = path.join(__dirname, 'text.txt');

fs.writeFile(pathToText, '', function(error) {
  if(error) throw error;
  else{stdout.write('Приветствую! Вводите всё, что вздумается:D\n');}
});

process.on('exit', () => {
  stdout.write('Пока! Успехов в обучении!');
});

process.on('SIGINT', () => {
  process.exit();
});

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  fs.appendFile(pathToText, data, err => {
    if (err) throw err;
  });});