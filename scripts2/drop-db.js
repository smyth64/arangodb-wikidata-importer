const config = require('../config')

let url = `http://${config.username}${config.password ? ':' : ''}${config.password}${config.password ? '@' : ''}${config.host}:${config.port}`
var db = require('arangojs')({
  url: url
});

db.dropDatabase(config.database)
.then(() => {
  console.log('Sucessfully dropped database: ' + config.database)
})

