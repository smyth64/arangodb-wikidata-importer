'use strict'

var fs = require("fs");
var StreamArray = require("stream-json/utils/StreamArray");
var stream = StreamArray.make();
var _ = require('lodash');

var args = process.argv.slice(2);
var input = args[0];
var output = args[1];

stream.output.on("data", function(object){
    fs.appendFileSync(output, JSON.stringify(object.value) + '\n')
});

stream.output.on("end", function(){
  console.log("done");
  process.exit();
});

if (args.length > 1)
  fs.createReadStream(input).pipe(stream.input);

else
  console.log('Please provide input AND output file!');