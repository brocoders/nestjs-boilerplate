import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import jwksRsa, { JwksClient, RsaSigningKey } from 'jwks-rsa';
import { AuthVeroLoginDto } from './dto/auth-vero-login.dto';
import { SocialInterface } from '../social/interfaces/social.interface';
import { VeroPayloadMapper } from './infrastructure/persistence/relational/mappers/vero.mapper';
import { AllConfigType } from '../config/config.type';
import {
  BASE_VALUE_JWKS_URL,
  DEFAULT_JWKS_CACHE_MAX_AGE,
  VERO_ENABLE_DYNAMIC_CACHE,
} from './types/vero-const.type';

@Injectable()
export class AuthVeroService {
  private jwksClient: JwksClient;
  private lastKeyChangeTimestamp: number;
  private keyUsageCounter: number;
  private enableDynamicCache: boolean;
  private readonly logger = new Logger(AuthVeroService.name);

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private jwtService: JwtService,
    private veroMapper: VeroPayloadMapper,
  ) {
    const jwksUri =
      this.configService.get('vero.jwksUri', { infer: true }) ||
      BASE_VALUE_JWKS_URL;
    const cacheMaxAge =
      this.configService.get('vero.jwksUriCacheMaxAge', { infer: true }) ||
      DEFAULT_JWKS_CACHE_MAX_AGE;

    this.enableDynamicCache =
      this.configService.get('vero.enableDynamicCache', { infer: true }) ||
      VERO_ENABLE_DYNAMIC_CACHE;
    this.lastKeyChangeTimestamp = Date.now();
    this.keyUsageCounter = 0;

    this.jwksClient = this.createJwksClient(jwksUri, cacheMaxAge);
  }

  private createJwksClient(jwksUri: string, cacheMaxAge: number): JwksClient {
    return jwksRsa({
      jwksUri,
      cache: false,
      cacheMaxAge,
    });
  }

  private adjustCacheDuration() {
    if (!this.enableDynamicCache) {
      this.logger.debug(
        'Dynamic cache adjustment is disabled. Using default cache duration.',
      );
      return;
    }

    const elapsedTimeSinceLastChange = Date.now() - this.lastKeyChangeTimestamp;
    const usageFrequency =
      this.keyUsageCounter / (elapsedTimeSinceLastChange / 1000); // Requests per second

    // Default cache duration: 15 minutes
    let newCacheMaxAge = DEFAULT_JWKS_CACHE_MAX_AGE;

    // Reduce cache duration for high usage
    if (usageFrequency > 1) {
      newCacheMaxAge = 5 * 60 * 1000; // 5 minutes
    }
    // Increase cache duration for low usage or stable keys
    else if (elapsedTimeSinceLastChange > 2 * 60 * 60 * 1000) {
      newCacheMaxAge = 30 * 60 * 1000; // 30 minutes
    }

    this.logger.debug(
      `Adjusting JWKS cache duration to ${newCacheMaxAge / 1000} seconds`,
    );

    const jwksUri =
      this.configService.get('vero.jwksUri', { infer: true }) ||
      BASE_VALUE_JWKS_URL;

    // Re-create the JwksClient with the updated cache duration
    this.jwksClient = this.createJwksClient(jwksUri, newCacheMaxAge);
  }

  private async getKey(header: {
    kid: string | null | undefined;
  }): Promise<string> {
    this.keyUsageCounter += 1; // Track key usage

    return new Promise((resolve, reject) => {
      if (!header.kid) {
        reject(new UnauthorizedException('Missing "kid" in token header.'));
        return;
      }

      this.jwksClient.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
          reject(new UnauthorizedException('Failed to retrieve signing key.'));
        } else {
          const signingKey = (key as RsaSigningKey).getPublicKey();

          if (this.enableDynamicCache) {
            this.logger.debug('JWKS key retrieved.');
            this.lastKeyChangeTimestamp = Date.now();
            this.adjustCacheDuration();
          }
          resolve(signingKey);
        }
      });
    });
  }

  async verifyToken(token: string): Promise<any> {
    const getSigningKey = async (header: {
      kid: string | null | undefined;
    }): Promise<string> => {
      if (!header || !header.kid) {
        throw new UnauthorizedException('Token header is missing "kid".');
      }
      return this.getKey(header);
    };

    try {
      // Decode token header to resolve the signing key
      const decodedHeader = this.jwtService.decode(token, {
        complete: true,
      }) as { header: { kid: string } };
      if (!decodedHeader || !decodedHeader.header) {
        throw new UnauthorizedException('Invalid token header.');
      }
      const secret = await getSigningKey(decodedHeader.header);

      // Verify token using the resolved signing key
      return await this.jwtService.verifyAsync(token, {
        secret,
        algorithms: ['RS256'],
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token has expired.');
      }
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async getProfileByToken(
    loginDto: AuthVeroLoginDto,
  ): Promise<SocialInterface> {
    const decodedToken = await this.verifyToken(loginDto.veroToken);
    return this.veroMapper.mapPayloadToSocial(decodedToken);
  }
}
