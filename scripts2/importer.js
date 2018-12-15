'use strict'

require('shelljs/global');
const fs = require('fs');
const path = require('path')
const _ = require('lodash')
const async = require('async')
const chalk = require('chalk')

const config = require('../config')
const log = console.log

let url = `http://${config.username}${config.password ? ':' : ''}${config.password}${config.password ? '@' : ''}${config.host}:${config.port}`
var db = require('arangojs')({
  url: url
});

var args = process.argv.slice(2);
var filesPath = args[0];

if (filesPath) {
  try {
    fs.accessSync(filesPath, fs.F_OK);
  } catch (e) {
    console.log("Given File does not exist or is not readable!");
    process.exit();
  }

  checkDatabase()

  function checkDatabase() {
    db.listDatabases()
      .then(names => {
        console.log(names)
        if (names.includes(config.database)) {
          log('db already exists')
          checkCollection()
        } else {
          log('db doesnt exist. creating...')
          createDatabase()
        }
      });
  }

  // Ensure, the db exists
  function createDatabase() {
    db.createDatabase(config.database, [{username: 'root'}], function (err, info) {
      if (err) console.error(err.stack);
      else {
        console.log('created database')
        checkCollection()
      }
    });
  }

  function checkCollection() {
    db.useDatabase(config.database);
    db.listCollections()
    .then(collections => {
      console.log(collections)
      if (_.findIndex(collections, { "name": config.collection }) < 0) {
        log('collection doesnt exist. creating...')
        createCollection()
      } else {
        log('collection already exists')
        createIndices()
      }
    });
  }

  function createCollection() {
    let collection = db.collection(config.collection);
    collection.create()
    .then(() => {
      // Skip for Testing Purposes
      createIndices()
      //ximportDump()
    });
  }

  function createIndices() {
    log('creating indices')
    log(config.indices)
    let collection = db.collection(config.collection);

    async.each(config.indices, function(index, callback) {
      if (index.type === "fulltext") {
        collection.createFulltextIndex(index.fields, 3)
        .catch(function(e) {
          log(chalk.black.bgRed.bold('Error creating Fulltext index for ' + index.fields))
          console.log(e);
          process.exit()
        })        
        .then(index => {
          log(chalk.black.bgGreen.bold('Fulltext Index has been created for ' + index.fields))
          callback()
        });
      } else if (index.type === "skiplist") {
        log(index.fields)
        collection.createSkipList(index.fields)
        .catch(function(e) {
          log(chalk.black.bgRed.bold('Error creating Skiplist index for ' + index.fields))
          log(e);
          process.exit()
        })
        .then(index => {
          log(chalk.black.bgGreen.bold('Skiplist Index has been created for ' + index.fields))
          callback()
        });
      }
    }, function(err) {
        if( err ) {
          log('A index failed to create');
        } else {
          log(chalk.black.bgGreen.bold('All indices have been created successfully'));
          importDump()
        }
    });
  }

  function importDump() {
    var files = fs.readdirSync(filesPath);

    for (var file of files) {
      exec('docker-compose exec arangodb arangoimp --file /parsed/' + file + ' --server.database ' + config.database + ' --server.password ' + config.password + ' --collection ' + config.collection + ' --create-collection true');
      log(chalk.black.bgGreen.bold(`Import of ${file} finished! :-)`));
    }
  }
}

else {
 console.log('Please provide a filesPath, I dont know what to import else..');
}
