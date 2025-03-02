import { randomBytes } from 'crypto';
import * as fs from 'fs';

/**
 * Generate a random secret key of specified length
 * @param length Length of the secret key (32, 64, 128 characters)
 * @returns Hex encoded secret key
 */
function generateSecretKey(length: number): string {
  const bytes = Math.ceil(length / 2); // Each byte is 2 hex characters
  return randomBytes(bytes).toString('hex').slice(0, length);
}

/**
 * Generate a random password with optional special characters
 * @param length Length of the password (8, 12, 16 characters)
 * @param useSymbols Whether to include special characters (default: true)
 * @returns A secure password
 */
function generatePassword(length: number, useSymbols: boolean = true): string {
  const lettersAndNumbers =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const symbols = '!@#$%^&*()_+';

  const charset = useSymbols ? lettersAndNumbers + symbols : lettersAndNumbers;
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomBytes(1)[0] % charset.length);
  }
  return password;
}

/**
 * Ensure a directory exists, and create it if necessary
 * @param dirPath - Path to the directory
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Ensure a file exists, and create it if necessary
 * @param filePath - Path to the file
 * @param defaultContent - Default content to write if the file does not exist
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ensureFileExists(filePath: string, defaultContent: string = '') {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, 'utf8');
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
}

// Command-line interface
const args = process.argv.slice(2);
const command = args[0];

function main() {
  try {
    if (command === 'secret') {
      const size = parseInt(args[1] || '32', 10);
      console.log(`Secret Key (${size} characters):`, generateSecretKey(size));
    } else if (command === 'password') {
      const size = parseInt(args[1] || '8', 10);
      const useSymbols = args[2] !== 'false'; // Default: true
      console.log(
        `Password (${size} characters, Symbols: ${useSymbols}):`,
        generatePassword(size, useSymbols),
      );
    } else {
      console.error('Invalid command! Use one of the following:');
      console.error('npm run generate:secret-key 64');
      console.error('npm run generate:password 16 false');
      console.error(
        'npm run generate:gpg-key "John Doe" "john@example.com" "secure-passphrase"',
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
