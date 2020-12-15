const fs = require('fs');
const { default: docx4js } = require('docx4js');
const path = require('path');
const translate = require('./translate');

module.exports = async ({ source: sourceFilePath, target: targetFilePath, overwrite = false }) => {
    try {
        if (overwrite && !targetFilePath) {
            targetFilePath = sourceFilePath;
        }

        if (path.extname(sourceFilePath) === '.docx') {
            const docx = await docx4js.load(sourceFilePath);
            const texts = docx.officeDocument.content('w\\:tr w\\:t');
            const words = [];
            texts.map((index, text) => {
                if (text && text.children) {
                    words.push(text.children[0].data.trim());
                }
            });

            const translations = await translate(words);

            texts.map((index, text) => {
                if (text) {
                    const content = text.children[0].data;
                    docx.$(text).text(`${content}\n${translations[index]}`);
                }
            });
            docx.save(targetFilePath);
        } else {
            const source = fs.readFileSync(sourceFilePath, 'utf8');
            const words = source.split('\n').map(item => item.trim()).filter(item => item.length);
            const translations = await translate(words);
            const codes = [];

            for (let i = 0; i < words.length; i++) {
                codes.push(`${words[i]}${translations[i]}\n`);
            }

            fs.writeFileSync(targetFilePath, codes.join('\n'));
        }
    } catch (err) {
        throw err;
    }
};
