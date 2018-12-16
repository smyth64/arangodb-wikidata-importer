# Import your wikidata dump to ArangoDB

First get the wikidata json dump from here: https://dumps.wikimedia.org/wikidatawiki/entities

After that we are trying to import this huuuge dump into our ArangoDB 🥑

## Fit the config to your needs!
Or just copy and take it :)
```
cp config.json.sample config.json
```

## Convert Array JSON to Lines JSON
Let's convert this huuuuuge Array of the dump to a format, where each object is in a new line.
```
node scripts/array-to-lines.js data/dump/minidump.json data/dump/minidump-lines.json
```
*The "minidump" is just for testing. If you are brave enough, place here the dump from wikidata!*

## Split the converted dump to more files
Best practice: For each CPU core one file. (Change the "4" to the amount of cores)
```
node scripts/split-file.js data/dump/minidump-lines.json 4 data/splitted
```

## Parse it 
Now you can parse each file seperately using this script
```
node scripts/multi-files-parser.js data/splitted/*
```

## Let's start  🥑Arango DB 😄 
```
docker-compose up -d
```

## So now we can import everything! 😋

```
node scripts/importer.js parsed/
```

# Config
Look into the config.js

In the parser section, you can define:
```
parser: {
    // Which claims do I want to import?
    claims: [
        // 'P31', // instanceof
        // 'P10', // video
        // 'P18' // image
    ],
    // Which languages of my entities am I interested?
    languages: ['de', 'en'],
    // Which wiki sitelinks do I want?
    // sitelinks: ['dewiki', 'dewikiquote', 'enwiki', 'enwikiquote']
}
```

The main reason for the parser settings here is to reduce the size of the data.


# ToDo
[ ] Putting claims (the relations) into a graph instead of the collection.

