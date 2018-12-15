# What we gonna do?

First get the wikidata json dump from here: https://dumps.wikimedia.org/wikidatawiki/entities/
The filename is latest_all.json

After that we are trying to import this huuuge dump into our ArangoDB <3

1. Fit the config to your needs!
```
cp config.json.sample config.json
```
Now enter all your data...

2. Convert Array JSON to Lines JSON:
```
node array-to-lines.js dump/minidump.json dump/minidump.lines.json
```
The "minidump" is just for testing. If you are brave enough, place here the dump from wikidata!

3. Split the converted dump to more files. Best case: For each CPU core one file. (Change the "4" to the amount of cores)
```
node split-file.js dump/minidump.lines.json 4 splitted
```

4. Now you can parse each file seperately using this script
```
node multi-files-parser.js splitted/*
```

Fit the script to your needs. In my case I filtered out a lot of data, so the data fits into my memory ;-)

