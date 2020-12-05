import pkg from './package.json';

const extensions = ['js', 'ts'];

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            }
        ],
        plugins: [
            resolve({
                extensions,
            })
        ]
    }
]
