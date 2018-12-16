'use strict'

var fs = require('fs');
const rimraf = require('rimraf')
var splitFile = require('split-file');
const child_process = require('child_process');
const log = console.log

var args = process.argv.slice(2);
var path = args[0];
var parts = parseInt(args[1], 10);
var outputFolder = args[2]

if (args.length < 3) {
  log('please provide input file, amount of splitted files and output folder')
  log('e.G.: node split-file.js dump.json 6 splitted')
  process.exit()
}

try {
    fs.accessSync(path, fs.F_OK);
} catch (e) {
    log("Given File does not exist or is not readable!");
    process.exit();
}

let lines = child_process.execSync('wc -l <' + path)
let linesTotal = parseInt(lines.toString(), 10)
let linesPerFile = Math.floor(linesTotal / parts) || 1

log('total lines: ' + linesTotal)
log('total parts: ' + parts)
log('total lines per file: ' + linesPerFile)

rimraf(outputFolder + '/*', function(error) {
  if (error) {
    log('Error: ', error)
    process.exit()
  }

  if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder);
  }
  
  let split = child_process.execSync('split -l ' + linesPerFile + ' ' + path + ' ' + outputFolder + '/file.')
  
  log('split finished. saved files to folder: ' + outputFolder)
  if (split.toString()) log(split.toString())  
})


