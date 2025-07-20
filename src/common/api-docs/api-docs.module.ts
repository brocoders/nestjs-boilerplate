import { INestApplication, Logger, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ScalarThemeEnum } from './api-docs.enum';

@Module({})
export class APIDocs {
  private static readonly logger = new Logger('APIDoc');

  static async setup(
    app: INestApplication,
    options: ReturnType<DocumentBuilder['build']>,
  ) {
    const document = SwaggerModule.createDocument(app, options);

    // Apply Swagger Theme
    const theme = new SwaggerTheme();
    const swaggerThemeCSS = theme.getBuffer(SwaggerThemeNameEnum.CLASSIC); // Use a dark theme base
    const customCss = `
    ${swaggerThemeCSS}

    /* API Button Colors */
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background-color: #007BFF !important; /* Blue for GET */
    }

    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background-color:rgb(42, 169, 42) !important; /* Dark Green for POST */
    }

    .swagger-ui .opblock.opblock-patch .opblock-summary-method {
      background-color: #FFA500 !important; /* Orange for PATCH */
    }

    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background-color: #FF0000 !important; /* Red for DELETE */
}

    /* API Method Colors */
    .swagger-ui .opblock.opblock-get {
      border-color: #20c997 !important; /* Green for GET */
    }
  
    .swagger-ui .opblock.opblock-post {
      border-color: #40916c !important; /* Blue for POST */
    }
  
    .swagger-ui .opblock.opblock-patch {
      border-color: #a855f7 !important; /* Purple for PATCH */
    }
  
    .swagger-ui .opblock.opblock-delete {
      border-color: #f43f5e !important; /* Red for DELETE */
    }

    /* Hide Swagger Top Bar */
    .swagger-ui .topbar {
      display: none !important;
    }
  `;

    SwaggerModule.setup('/docs', app, document, {
      customCss: customCss, // Apply theme styles
      explorer: false,
      customSiteTitle: 'Vault API Docs',
    });

    app.getHttpAdapter().get('/api-docs', (_req, res) => {
      res.redirect('/docs');
    });

    // Serve OpenAPI JSON
    app.getHttpAdapter().get('/openapi.json', (_req, res) => {
      res.json(document);
    });

    // Scalar API Reference Middleware
    app.use(
      '/docs/reference',
      apiReference({
        theme: ScalarThemeEnum.DeepSpace,
        spec: {
          content: document,
        },
        config: {
          cssOverrides: `
            body {
              font-size: 24px !important;  /* Increase base font size */
            }
            .api-reference {
              font-size: 22px !important;
            }
            h1, h2, h3, h4 {
              font-size: 26px !important;  /* Increase headings */
            }
          `,
        },
      }),
    );

    // Fake awaits to satisfy the ESLint rule.
    await Promise.resolve();
  }

  static async info(app: INestApplication) {
    let appUrl = await app.getUrl();
    appUrl = appUrl.replace('[::1]', 'localhost');
    this.logger.log(`[Swagger] Docs available at: ${appUrl}/docs`);
    this.logger.log(`[API] Reference available at: ${appUrl}/docs/reference`);
    this.logger.log(`[OpenAPI] JSON available at: ${appUrl}/openapi.json`);
  }
}
