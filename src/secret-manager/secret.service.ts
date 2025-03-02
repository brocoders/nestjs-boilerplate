import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

// TODO: Improve output logs for paths
@Injectable()
export class SecretConfigService extends ConfigService implements OnModuleInit {
  private readonly logger = new Logger(SecretConfigService.name);
  private readonly globalSecretsPath: string;

  constructor(
    @Inject('GLOBAL_SECRET_PATH') private readonly globalPath: string,
    private readonly configService: ConfigService,
  ) {
    super();
    this.globalSecretsPath = globalPath;
  }

  onModuleInit() {
    this.logger.log(
      `Initializing SecretConfigService. Using global secrets path: "${this.globalSecretsPath}".`,
    );

    if (!fs.existsSync(this.globalSecretsPath)) {
      this.logger.warn(
        `Global secrets directory not found at "${this.globalSecretsPath}". Please create this directory if global secrets are required.`,
      );
    } else {
      this.logger.debug(
        `Global secrets directory is available at "${this.globalSecretsPath}".`,
      );
    }
  }

  /**
   * Resolves the full path of a secret file.
   * First checks the service-specific path, then falls back to the global path.
   * Logs provider-specific relative paths for clarity.
   * @param fileName - The name of the secret file.
   * @param servicePath - Optional service-specific path.
   */
  getSecretFilePath(fileName: string, servicePath?: string): string | null {
    const pathsToCheck = [
      ...(servicePath ? [servicePath] : []), // Service-specific path first
      this.globalSecretsPath, // Global path as fallback
    ];

    const providerRoot = 'providers';
    const truncatePath = (absolutePath: string) =>
      absolutePath.includes(providerRoot)
        ? absolutePath.split(providerRoot).pop() || absolutePath
        : path.relative(process.cwd(), absolutePath);

    this.logger.debug(
      `Looking for secret file "${fileName}" in the following paths:\n${pathsToCheck
        .map(truncatePath)
        .join('\n')}`,
    );

    for (const dir of pathsToCheck) {
      const filePath = path.join(dir, fileName);
      if (fs.existsSync(filePath)) {
        this.logger.debug(`Found secret file at "${truncatePath(filePath)}".`);
        return filePath;
      }
    }

    this.logger.error(
      `Secret file "${fileName}" not found in the specified paths:\n${pathsToCheck
        .map(truncatePath)
        .join('\n')}`,
    );
    return null;
  }

  /**
   * Reads and parses the content of a secret file.
   * Supports JSON and plaintext formats.
   * @param fileName - The name of the secret file.
   * @param servicePath - Optional service-specific path.
   */
  getSecretFileContent(
    fileName: string,
    servicePath?: string,
  ): string | Record<string, any> {
    const filePath = this.getSecretFilePath(fileName, servicePath);

    if (!filePath) {
      const errorMsg = `Secret file "${fileName}" not found.`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const ext = path.extname(fileName).toLowerCase();
    const relativeFilePath = path.relative(process.cwd(), filePath);

    this.logger.debug(
      `Reading secret file "${fileName}" of type "${ext}" from "${relativeFilePath}".`,
    );

    const content = fs.readFileSync(filePath, 'utf8');

    switch (ext) {
      case '.json':
        try {
          const parsedContent = JSON.parse(content);
          this.logger.debug(
            `Successfully parsed JSON content from "${relativeFilePath}".`,
          );
          return parsedContent;
        } catch (error) {
          const errorMsg = `Failed to parse JSON content in "${relativeFilePath}". Ensure the file contains valid JSON.`;
          this.logger.error(errorMsg, error.stack);
          throw new Error(errorMsg);
        }
      case '.pem':
      case '.key':
      case '.crt':
      case '.txt':
        this.logger.debug(
          `Successfully read plaintext content from "${relativeFilePath}".`,
        );
        return content;
      default:
        const errorMsg = `Unsupported file type "${ext}" for secret file "${fileName}".`;
        this.logger.error(errorMsg);
        throw new Error(errorMsg);
    }
  }
}
