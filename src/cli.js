import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import translateFile from './translateFile';

function parseArgsIntoOptions(args) {
    const options = arg(
        {
            '--source': String,
            '--target': String,
            '--overwrite': Boolean,
        },
        {
            argv: args.slice(2),
        }
    );

    return {
        source: options['--source'] || '',
        target: options['--target'] || '',
        overwrite: options['--overwrite'],
    };
}

const validatePath = (val) => {
    try {
        const supportTypes = ['.docx', '.txt'];
        const {ext} = path.parse(val);

        if (supportTypes.includes(ext)) {
            return true;
        }

        return  `The file type is not correct, we support ${supportTypes.join(', ')}`;
    } catch (err) {
        return 'Seems the input is not a correct file path';
    }
}


async function promptForMissingOptions(options) {
    const questions = [];

    if (!options.source || validatePath(options.source) !== true) {
        questions.push({
            type: 'input',
            name: 'source',
            message: 'Please enter the .docx/.json file path your want to translate:',
            validate: validatePath,
        })
    }

    if (!options.overwrite) {
        if (!options.target) {
            questions.push({
                type: 'confirm',
                name: 'overwrite',
                message: 'Overwrite the source file?',
                default: false,
            });

            questions.push({
                type: 'input',
                name: 'target',
                message: 'where do you want to save the changes?',
                validate: validatePath,
                when: (answers) => {
                    if (!answers.overwrite && validatePath(options.target) !== true) {
                        return true;
                    }

                    return false;
                }
            });
        } else if (validatePath(options.target) !== true) {
            questions.push({
                type: 'input',
                name: 'target',
                message: 'where do you want to save the changes?',
                validate: validatePath,
                when: (answers) => {
                    if (answers.overwrite) {
                        return false;
                    }

                    return true;
                }
            });
        }
    }

    const answers = await inquirer.prompt(questions);

    return {
        ...options,
        ...answers,
    }
}

export async function cli(args) {
    const options = await promptForMissingOptions(parseArgsIntoOptions(args));
    try {
        console.log('start');
        await translateFile(options);
    } catch (err) {
        // try one more time
        console.error('Seems some error occurs. Retry one more time');
        await translateFile(options);
    }
}
