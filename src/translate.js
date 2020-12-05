const puppeteer = require('puppeteer');

function transformTexts(pro, con, extra) {
    let result = '';
    if (pro) {
        pro = pro.split('\n').map(s => s.trim()).filter(item => item.length);

        // if (pro.length > 3) {
        //     pro.shift();
        //     pro.shift();
        // }

        result = pro.join(' ');
    }

    if (con) {
        result = `${result}\n${con.split('\n').map(s => s.trim()).filter(item => item.length).join('\n')}`;
    }

    if (extra) {
        result = `${result}\n${extra.split('\n').map(s => s.trim()).filter(item => item.length).join(' ')}`
    }

    return result;
}

// function constructContent(translations) {
//     var docx = officegen ({
//         'type': 'docx',
//         'subject': 'test',
//     });
//     var table = [];

//     Object.keys(translations).forEach((key, i) => {
//         const index = Math.floor(i / 5);
//         if (!table[index]) {
//             table.push([]);
//         }

//         if (index === 0) {
//             table[index].push({
//                 val: `${key}\n${translations[key]}`,
//                 opts: {
//                     cellColWidth: 4261,
//                 }
//             })
//         } else {
//             table[index].push(`${key}\n${translations[key]}`);
//         }

//     });
    
//     var tableStyle = {
//         tableColWidth: 4261,
//         tableSize: 24,
//         tableColor: "ada",
//         tableAlign: "left",
//     }

//     docx.createTable (table);

//     var out = fs.createWriteStream( path.join(__dirname, 'out.docx') );
 
//     docx.generate ( out );
//     out.on ( 'close', function () {
//         console.log ( 'Finished to create the word file!' );
//     });
//     // const result = Object.keys(translations).reduce((acc, cur, i) => {
//     //     acc += `${cur}\n ${translations[cur]} \n\t`;
//     //     return acc;
//     // }, '');

//     // return fs.writeFileSync(path.join(__dirname, 'translate.txt'), result);
// }

async function translate(words) {
    const browser = await puppeteer.launch({headless: true,defaultViewport: {width: 2000, height: 2000}});
    const page = await browser.newPage();

    await page.goto('http://dict.youdao.com/search', {
        waitUntil: 'networkidle0',
    });

    const translations = [];

    while (words.length) {
        const word = words.shift();
        const $translateContent = await page.$('#translateContent');

        const closeBtn = await page.$('.close.js_close');

        if (closeBtn) {
            await page.click('a.close.js_close');
        }

        if ($translateContent === null) {
            await page.evaluate( () => document.getElementById("query").value = "");
            await page.type('#query', word);
            await page.click('.s-btn');
            await page.click('.s-btn');
        } else {
            await page.evaluate( () => document.getElementById("translateContent").value = "");
            await page.type('#translateContent', word);
            await page.click('#form button');
        }

        const translateBlock = await page.waitForXPath(`//*[@class="keyword"][contains(text(), "${word}")]`);

        if (translateBlock === null) {
            console.log(`not translate for this word: ${word}`);
            translations.push('');
            continue;
        }

        const pronounces = await page.$('#phrsListTab .baav');
        const content = await page.$('#phrsListTab .trans-container ul');
        const additional = await page.$('#phrsListTab .trans-container .additional');
        let pro = '';
        let con = '';
        let extra = '';
        if (pronounces) {
            pro = await page.evaluate(el => el.textContent, pronounces);
        }

        if (content) {
            con = await page.evaluate(el => el.textContent, content);
        }

        if (additional) {
            extra = await page.evaluate(el => el.textContent, additional);
        }


        translations.push(transformTexts(pro, con, extra));
    }
    await browser.close();
    console.log('finish');

    return translations;
}

module.exports = translate;
