// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const child_process = require('child_process');

const args = process.argv.slice(2).join(' ');

let command;
// Create the command to run TypeORM CLI with the provided arguments
if (process.env.NODE_ENV === undefined) {
  command = `env-cmd ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js ${args}`;
} else {
  command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js ${args}`;
}

// Execute the command with the current environment variables
child_process.execSync(command, { stdio: 'inherit', env: process.env });
