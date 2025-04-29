import {
  UploadFileResponseDto,
  DeleteFileResponseDto,
  ListFilesResponseDto,
  ListBucketsResponseDto,
} from '../../../../dto/response.dto';

export class MinioResponseMapper {
  static toUploadFileResponse(fileName: string): UploadFileResponseDto {
    return {
      message: `File '${fileName}' uploaded successfully`,
      fileName,
    };
  }

  static toDeleteFileResponse(fileName: string): DeleteFileResponseDto {
    return {
      message: `File '${fileName}' deleted successfully`,
    };
  }

  static toListFilesResponse(files: string[]): ListFilesResponseDto {
    return {
      files,
    };
  }

  static toListBucketsResponse(buckets: string[]): ListBucketsResponseDto {
    return {
      buckets,
    };
  }
}
