'use strict'

var fs = require("fs");
var _ = require('lodash');
var path = require('path')
var cluster = require('cluster');
const rimraf = require('rimraf')
var log = console.log
// const chalk = require('chalk')
const readline = require('readline');
var files = process.argv.slice(2);
const outputPath = path.resolve('./data/parsed');
const config = require('../config')

if (files.length < 1) {
  log('please provide input file!')
  process.exit()
}

if (cluster.isMaster) {
  var numCPUs = require('os').cpus().length;

  rimraf(outputPath + '/*', function(error) {
    if (error) {
      log('Error: ', error)
      process.exit()
    }

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }

    for (let file of files) {
      cluster.fork({FILE: file});
    }

    cluster.on('fork', function(newWorker) {
      // log(chalk.black.bgGreen.bold('worker '+ newWorker.process.pid +' born.'));
      log('worker '+ newWorker.process.pid +' born.');
    })    
  });
}

else if (cluster.isWorker) {
  let file = process.env['FILE']
  let filename = path.basename(file)

  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file, {encoding: 'utf8'})
  })

  lineReader.on('line', function (obj) {
    let object = {}
    try {
      object = JSON.parse(obj)
    } catch (e) {
      console.log('Error in file ' + file)
      console.log(e)
      process.exit()
    }

    object._key = _.clone(object.id)
    object.wikidataId = _.clone(object.id)
    delete object.id;
    
    object.labels = _.pick(object.labels, config.parser.languages)
    if (object.labels.de) object.labels.de.valueLower = object.labels.de.value.toLowerCase()
    if (object.labels.en) object.labels.en.valueLower = object.labels.en.value.toLowerCase()

    object.descriptions = _.pick(object.descriptions, config.parser.languages)
    if (object.descriptions.de) object.descriptions.de.valueLower = object.descriptions.de.value.toLowerCase()
    if (object.descriptions.en) object.descriptions.en.valueLower = object.descriptions.en.value.toLowerCase()  

    if (_.isEmpty(object.aliases)) {
      delete object.aliases
    } else {
      object.aliases = _.pick(object.aliases, config.parser.languages)
      object.aliases = _.map(object.aliases, aliases => {
        return aliases.map(alias => {
          alias.valueLower = alias.value.toLowerCase()
          return alias
        })
      })
    }

    object.sitelinks = config.parser.sitelinks.length > 0 ? _.pick(object.sitelinks, config.parser.sitelinks) : undefined
    object.connections = object.claims ? Object.keys(object.claims).length : 0;
    object.claims = config.parser.claims.length > 0 ? _.pick(object.claims, config.parser.claims) : undefined;

    fs.appendFileSync(outputPath + '/' + filename, JSON.stringify(object) + '\n')
  });

  lineReader.on("close", function(){
    // log(chalk.black.bgGreen.bold('Worker ' + cluster.worker.id + " finished... proudly parsed file " + file + " into parsed/" + filename))
    log('Worker ' + cluster.worker.id + " finished... proudly parsed file " + file + " into parsed/" + filename)
    process.exit();
  });
}
