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
        overwrite: options['--overwrite'] || false,
    };
}

const validatePath = (val) => {
    try {
        const {ext} = path.parse(val);

        if (['.docx', '.json'].includes(ext)) {
            return true;
        }

        return 'The file type is not correct';
    } catch (err) {
        return 'The file type is not correct';
    }
}


async function promptForMissingOptions(options) {
    const questions = [];

    if (!options.source || validatePath(options.source) !== true) {
        questions.push({
            type: 'input',
            name: 'source',
            message: 'Please enter the .docx file path your want to translate',
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
                when: (answers)=> {
                    if (!answers.overwrite || !options.target) {
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

    await translateFile(options);
}
