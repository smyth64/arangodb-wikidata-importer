Hey!

How to import wikidata dump to ArangoDB?

First of all we convert this huuuuuge Array of the dump to a format, where each object is in a new line.
```
node scripts/array-to-lines.js dump/latest-all.json dump/latest-all-lines.json
```

Then we split the file in 4 (recommended number is the amount of CPU cores you have) parts in order so that we can use one CPU for each file.

```
node scripts/split-file.js dump/latest-all-lines.json 4 splitted
```

So now we can import everything! 😋

```
docker-compose exec -it arangodb node /scripts/importer.js /testdata/*

