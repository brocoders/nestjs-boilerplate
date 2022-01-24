import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as AWS from 'aws-sdk';
import { v2 } from 'cloudinary';
import * as multerS3 from 'multer-s3';
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';

interface LocalFilesInterceptorOptions {
    fieldName?: string;
    path?: string;
}

function UploadFileInterceptor(options?: LocalFilesInterceptorOptions): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;
        constructor(configService: ConfigService) {
            const storages = {
                local: () => diskStorage({
                    destination: './files',
                    filename: (request, file, callback) => {
                        callback(
                            null,
                            `${randomStringGenerator()}.${file.originalname
                                .split('.')
                                .pop()
                                .toLowerCase()}`,
                        );
                    }
                }),
                s3: () => {
                    const s3 = new AWS.S3();
                    AWS.config.update({
                        accessKeyId: configService.get('file.accessKeyId'),
                        secretAccessKey: configService.get('file.secretAccessKey'),
                        region: configService.get('file.awsS3Region'),
                    });

                    return multerS3({
                        s3: s3,
                        bucket: configService.get('file.awsDefaultS3Bucket'),
                        acl: 'public-read',
                        contentType: multerS3.AUTO_CONTENT_TYPE,
                        key: (request, file, callback) => {
                            callback(
                                null,
                                `${randomStringGenerator()}.${file.originalname
                                    .split('.')
                                    .pop()
                                    .toLowerCase()}`,
                            );
                        },
                    });
                },
                cloudinary: () => {
                    v2.config({
                        cloud_name: configService.get('file.cloudinaryCloudName'),
                        api_key: configService.get('file.cloudinaryApiKey'),
                        api_secret: configService.get('file.cloudinaryApiSecret'),
                    })

                    return new CloudinaryStorage({
                        cloudinary: v2,
                        params: (req, file) => {
                            return {
                                folder: '',
                                format: 'jpeg',
                                allowedFormats: ["jpg", "png", "pdf"],
                                unique_filename: true,
                                resource_type: "auto",
                                use_filename: false,
                            };
                        },
                    });
                }
            }

            const multerOptions: MulterOptions = {
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
                storage: storages[configService.get('file.driver')](),
                limits: {
                    fileSize: configService.get('file.maxFileSize'),
                },
            }

            this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions));
        }

        intercept(...args: Parameters<NestInterceptor['intercept']>) {
            return this.fileInterceptor.intercept(...args);
        }
    }
    return mixin(Interceptor);
}

export default UploadFileInterceptor;