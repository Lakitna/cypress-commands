import pkg from './package.json';
import del from 'rollup-plugin-delete';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import copy from 'rollup-plugin-copy';


const config = [
    {
        input: './src/index.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                globals: {
                    Cypress: 'cypress',
                },
            },
            { file: pkg.module, format: 'es' },
        ],
        plugins: [
            // Delete contents of target folder
            del({
                targets: pkg.files,
            }),

            // Resolve JSON files
            json(),

            // Compile to commonjs and bundle
            commonjs(),

            // Copy type definitions to target folder
            copy({
                targets: [
                    { src: './types/**/*.d.ts', dest: './dist/types' },
                ],
            }),
        ],

        /**
         * Mark all dependencies as external to prevent Rollup from
         * including them in the bundle. We'll let the package manager
         * take care of dependency resolution and stuff so we don't
         * have to download the exact same code multiple times, once
         * in this bundle and also as a dependency of another package.
         */
        external: [
            ...Object.keys(pkg.dependencies),
            'path',
        ],
    },
];

module.exports = config;
