#! /usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { serve } = require('./server/server');
const { create } = require("./scaffolder/scaffold");
const boxen = require("boxen");

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
    }).command(`create [name]`, 'Create a basic filesystem for an Accent.js application.', (yargs) => {
        return yargs
            .positional('name', {
                describe: 'Name of Accent.js Project',
            })
    }, (argv) => {
        const name = argv.name; 
        console.info(`Creating project: ${name} ...`);
        const out = (() => {
            try {
                return create(name, process.cwd());
            } catch (e) {
                console.error(`\x1b[31m${e}`);
            }
        })();
        if (out) console.info(boxen(`\x1b[36mCreated Project "${name}" at ${out}`, { padding: 1, borderStyle: 'double' } ));
    }).argv;
