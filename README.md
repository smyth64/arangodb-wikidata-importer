Hey!

How to import wikidata dump to ArangoDB in 5 simple steps?

1. First of all we convert this huuuuuge Array of the dump to a format, where each object is in a new line.
```
node scripts/array-to-lines.js dump/latest-all.json dump/latest-all-lines.json
```

2. Now you can parse each file seperately using this script
```
node multi-files-parser.js splitted/*
```

3. Then we split the file in 4 (recommended number is the amount of CPU cores you have) parts in order so that we can use one CPU for each file.

```
node scripts/split-file.js dump/latest-all-lines.json 4
```

4. Out ArangoDB is already waiting hungry for the data 😄 Let's start it
```
docker-compose up -d
```

5. So now we can import everything! 😋

```
docker-compose exec -it arangodb node /scripts/importer.js /parsed

