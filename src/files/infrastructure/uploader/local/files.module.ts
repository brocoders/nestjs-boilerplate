import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { FilesLocalController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AllConfigType } from 'src/config/config.type';
import { FilesLocalService } from './files.service';
import databaseConfig from 'src/database/config/database.config';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { DocumentFilePersistenceModule } from '../../persistence/document/document-persistence.module';
import { RelationalFilePersistenceModule } from '../../persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentFilePersistenceModule
  : RelationalFilePersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new HttpException(
                  {
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                      file: `cantUploadFileType`,
                    },
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }

            callback(null, true);
          },
          storage: diskStorage({
            destination: './files',
            filename: (request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  controllers: [FilesLocalController],
  providers: [ConfigModule, ConfigService, FilesLocalService],
  exports: [FilesLocalService],
})
export class FilesLocalModule {}
