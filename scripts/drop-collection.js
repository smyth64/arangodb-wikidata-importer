const config = require('./config.json')

let url = `http://${config.username}${config.password ? ':' : ''}${config.password}${config.password ? '@' : ''}${config.host}:${config.port}`
var db = require('arangojs')({
  url: url
});

db.useDatabase(config.database);

let collection = db.collection(config.collection);
collection.drop()
.then(() => {
  console.log('Collection "' + config.collection + '" dropped.')
});

