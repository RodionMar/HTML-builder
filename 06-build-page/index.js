const fsWithPromise = require('fs/promises');
const fs = require('fs');
const path = require('node:path');

const pathToTemplate = path.join(__dirname, 'template.html');

// Create folder project-dist
async function makeProjectDist() {
  try {
    const newDir = await fsWithPromise.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
    return newDir;
  } catch (err) {
    console.error(err);
  }
}
makeProjectDist();

// Generate file index.html in project-dist folder
async function readTemplate() {
  try {
    const data = await fsWithPromise.readFile(pathToTemplate, 'utf-8');
    const tempArray = [];
    for await (const temp of data) {
      tempArray.push(temp);
    }
    return tempArray.join('');
  } catch (err) {
    console.error(err);
  }
}

async function fnForWriteTemplate() {
  try{
    const originalTemplate = await readTemplate();
    const components = originalTemplate.match(/{{\w*}}/g).map((component) => component.replace(/{{|}}/g, ''));
    const generatedTemplate = await moveTemplates(originalTemplate, components);
    const pathToWrite = path.join(__dirname, 'project-dist', 'index.html');
    const writeComponentFile = fs.createWriteStream(pathToWrite);
    writeComponentFile.write(generatedTemplate);
  } catch (err) {
    console.error(err);
  }
}

async function moveTemplates(template, components){
  try {
    for await(const component of components){
      const readComponentFile = fs.createReadStream(path.join(__dirname, 'components', `${component}.html`), 'utf-8');
      const fullComponent = [];
      for await (const chunkComponent of readComponentFile) {
        fullComponent.push(chunkComponent);
      }
      template = template.replace(new RegExp(`{{${component}}}`), fullComponent);
    }
    return template;
  } catch (err) {
    console.error(err);
  }
}

fnForWriteTemplate();


// Generate file style.css in project-dist folder
const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');
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


// Copy assets to project-dist folder
const pathToFileCopy = path.join(__dirname, 'project-dist', 'assets');
const pathToOriginalFile = path.join(__dirname, 'assets');

async function createCopyAssetsFolder() {
  try{
    const makeNewAssets = await fsWithPromise.mkdir(pathToFileCopy, {recursive: true});
    return makeNewAssets;
  } catch (err) {
    console.error(err);
  }
}

async function moveAssets() {
  try {
    await createCopyAssetsFolder();
    const readOriginalAssets = await fsWithPromise.readdir(pathToOriginalFile);
    for await (const folder of readOriginalAssets) {
      // Создание путей к папкам в папках assets
      const pathToOriginalFoldersInAssets = path.join(pathToOriginalFile, folder);
      const pathToCopyFoldersInAssets = path.join(pathToFileCopy, folder);
      // Создание папок внутри скопированной папки assets
      await fsWithPromise.mkdir(pathToCopyFoldersInAssets, {recursive: true});
      const readOriginalFiles = await fsWithPromise.readdir(pathToOriginalFoldersInAssets);
      for await (const file of readOriginalFiles) {
        const copyFilePath = path.join(pathToCopyFoldersInAssets, file);
        const filePath = path.join(pathToOriginalFoldersInAssets, file);
        await fsWithPromise.copyFile(filePath, copyFilePath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

moveAssets();