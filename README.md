Hey!

How to import wikidata dump to ArangoDB?

First of all we convert the Array format to a Lines format.
```
node scripts/array_to_lines.js dump/latest_all.json testdata/latest_all_lines.json
```

Then we split the file in order to have more control for importing.

```
node scripts/split_file.js testdata/latest_all_lines.json
```

After that we want to move the original dump file out of the directory.

```
mv testdata/latest_all_lines.json dump
```

So now we can import all!

```
dcex arangodb node /scripts/importer.js /testdata/*

