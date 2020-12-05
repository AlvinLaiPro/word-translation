# word-translation

word-translation is a tool for translating words in a .json/.docx file.

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/) (`^10.12.0`, or `>=12.0.0`)

You can use it without Installation:
```
# This will translate all words in the fileName.docx's table and write back to it.
$ npx @alvinlai/word-translation --source ./directory/fileName.docx --overwrite
```

```
# This will translate all words in the sourceFileName.docx's table and write to the targetFileName file without changing the source file.
$ npx @alvinlai/word-translation --source ./directory/sourceFileName.docx --target ./directory/targetFileName.docx
```

Or you can install word-translation using npm:

```
$ npm install @alvinlai/word-translation
```

After that, you can run  on the sourceFileName.json file like this:

```
$ ./node_modules/.bin/translate --source ./directory/sourceFileName.json --target ./anyDirectory/targetFileName.json
```
