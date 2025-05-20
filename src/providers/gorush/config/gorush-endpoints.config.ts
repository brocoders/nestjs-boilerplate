import { ApiGatewayConfig } from 'src/common/api-gateway/api-gateway-config';
import { GORUSH_URL } from '../types/gorush-const.type';
import { HttpMethod } from '../../../common/api-gateway/types/api-gateway.enum';

export class GorushApiConfig extends ApiGatewayConfig {
  constructor(baseUrl: string = GORUSH_URL) {
    // Default Base URL
    super(baseUrl, {});

    this.name = 'GORUSH'; // Custom identifier for the API instance

    // Define API Endpoints
    this.addEndpoint('getGoStats', HttpMethod.GET, '/api/stat/go');
    this.addEndpoint('getAppStats', HttpMethod.GET, '/api/stat/app');
    this.addEndpoint('getConfig', HttpMethod.GET, '/api/config');
    this.addEndpoint('getSysStats', HttpMethod.GET, '/sys/stats');
    this.addEndpoint('sendPushNotification', HttpMethod.POST, '/api/push');
    this.addEndpoint('getMetrics', HttpMethod.GET, '/metrics');
    this.addEndpoint('checkHealth', HttpMethod.GET, '/healthz');
    this.addEndpoint('checkHealthHead', HttpMethod.HEAD, '/healthz');
    this.addEndpoint('getVersion', HttpMethod.GET, '/version');
    this.addEndpoint('getRoot', HttpMethod.GET, '/');
  }
}
