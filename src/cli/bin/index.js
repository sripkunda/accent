#! /usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { serve } = require('./server/server');

yargs(hideBin(process.argv))
    .command(`serve [path]`, 'Start a development server configured for single-page applications (accent.js router).', (yargs) => {
        return yargs
            .positional('path', {
                describe: 'Path to directory with index.html (or root file)',
            }).option("port", {
                alias: 'p',
                description: 'The port to bind the server on',
                default: 5000
            })
    }, (argv) => {
        const port = argv.port; 
        console.info(`Starting server on port: ${port} ...`);
        serve(argv.path, port);
    }).argv;
