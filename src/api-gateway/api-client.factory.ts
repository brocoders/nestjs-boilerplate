import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiGatewayConfig } from './types/api-gateway.interfaces';
import { ApiFunction } from './types/api-gateway.type';
import { HttpMethod } from './types/api-gateway.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from './dto/base-response.dto';
import { plainToInstance } from 'class-transformer';

export class ApiClientFactory {
  private axiosInstance: AxiosInstance;

  constructor(private readonly config: ApiGatewayConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: 5000,
      headers: config.headers || {},
      responseType: 'json',
    });
  }

  createClient(): Record<string, ApiFunction> {
    const client: Record<string, ApiFunction> = {};
    this.config.endpoints.forEach((endpoint) => {
      client[endpoint.name] = async (
        params?: any,
        headers?: Record<string, string>,
        callback?: (error: any, response: BaseResponse<any> | null) => void,
      ) => {
        try {
          const response: AxiosResponse = await this.axiosInstance.request({
            method: endpoint.method,
            url: endpoint.url,
            headers: { ...this.config.headers, ...headers },
            ...(endpoint.method === HttpMethod.GET
              ? { params }
              : { data: params }),
            responseType: 'json',
          });

          const nestResponse = plainToInstance(
            BaseResponse,
            {
              statusCode: response.status,
              data: response.data,
              headers: response.headers,
            },
            { groups: ['admin'] },
          );

          if (callback) return callback(null, nestResponse);
          return nestResponse;
        } catch (error: any) {
          const status =
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.response?.data || 'Internal Server Error';

          const nestError = new HttpException(
            { statusCode: status, message },
            status,
          );

          if (callback) return callback(nestError, null);
          throw nestError;
        }
      };
    });
    return client;
  }
}
