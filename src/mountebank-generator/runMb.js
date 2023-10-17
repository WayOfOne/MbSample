const { execSync } = require('child_process');
const path = require('path');

const configPath = path.resolve(__dirname, 'OpenApi.json');
const formatterPath = path.resolve(__dirname, 'node_modules', 'mountebank-openapi-formatter', 'src', 'formatter.js');

const command = `mb --configfile ${configPath} --formatter ${formatterPath}`;
console.log(`Executing: ${command}`);
execSync(command, { stdio: 'inherit' });
