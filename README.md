# word-translation

word-translation is a tool for translating words in a .json/.docx file.

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/) (`^10.12.0`, or `>=12.0.0`)

You can use it without Installation:
```
# This will translate all words in the fileName.docx's table and write back to it.
$ npx @alvinlai/word-translation --source ./directory/fileName.docx --overwrite
```
Or translate words in the txt file:
```
# This will translate all words in the fileName.txt and write back to it.
# Please separate words with new line
$ npx @alvinlai/word-translation --source ./directory/fileName.txt --overwrite
```
```
# This will translate all words in the sourceFileName.docx's table and write to the targetFileName file without changing the source file.
$ npx @alvinlai/word-translation --source ./directory/sourceFileName.docx --target ./directory/targetFileName.docx
```

Or you can install word-translation using npm:

```
$ npm install @alvinlai/word-translation
```

After that, you can run on the sourceFileName.docx file like this:

```
$ ./node_modules/.bin/translate --source ./directory/sourceFileName.docx --overwrite
```
Or

```
$ ./node_modules/.bin/translate --source ./directory/sourceFileName.txt --target ./anyDirectory/targetFileName.txt
```

