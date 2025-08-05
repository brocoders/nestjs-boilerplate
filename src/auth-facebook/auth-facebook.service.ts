import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { FacebookInterface } from './interfaces/facebook.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class AuthFacebookService {
  // Base Facebook Graph API URL and API version
  private readonly baseUrl = 'https://graph.facebook.com';
  private readonly apiVersion = 'v23.0';

  constructor(private configService: ConfigService<AllConfigType>) {}

  /**
   * Retrieves a Facebook user profile using the provided access token.
   * First validates the token, then fetches the user's profile fields.
   * @param loginDto DTO containing the short-lived Facebook access token.
   * @returns Normalized user profile in internal SocialInterface format.
   */
  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    try {
      // Step 1: Verify that the token is valid and belongs to our app
      await this.verifyAccessToken(loginDto.accessToken);

      // Step 2: Construct the profile URL and query Facebook for user data
      const profileUrl = new URL(`${this.baseUrl}/${this.apiVersion}/me`);
      profileUrl.searchParams.set('fields', 'id,last_name,email,first_name');
      profileUrl.searchParams.set('access_token', loginDto.accessToken);

      const response = await fetch(profileUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000), // Abort request if it exceeds 10 seconds
      });

      // Handle HTTP errors gracefully
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpException(
          errorData.error?.message || 'Facebook API error',
          response.status,
        );
      }

      const data: FacebookInterface = await response.json();

      // Ensure required fields are present in the response
      if (!data.id) {
        throw new HttpException(
          'Invalid Facebook profile data',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Map Facebook data to our internal social user interface
      return {
        id: data.id,
        email: data.email || undefined, // Email may not be present depending on user permissions
        firstName: data.first_name || '',
        lastName: data.last_name || '',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.name === 'TimeoutError') {
        throw new HttpException(
          'Facebook API request timeout',
          HttpStatus.REQUEST_TIMEOUT,
        );
      }

      throw new HttpException(
        'Failed to get Facebook profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates the Facebook access token by calling the /debug_token endpoint.
   * Also ensures the token belongs to our application.
   * @param accessToken The user's short-lived access token to be verified.
   */
  private async verifyAccessToken(accessToken: string): Promise<void> {
    try {
      const appId = this.configService.get('facebook.appId', { infer: true });
      const appSecret = this.configService.get('facebook.appSecret', {
        infer: true,
      });

      // Application credentials must be configured properly
      if (!appId || !appSecret) {
        throw new HttpException(
          'Facebook app credentials not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const debugUrl = new URL(`${this.baseUrl}/debug_token`);
      const appAccessToken = `${appId}|${appSecret}`;

      debugUrl.searchParams.set('input_token', accessToken);
      debugUrl.searchParams.set('access_token', appAccessToken);

      const response = await fetch(debugUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout for validation
      });

      if (!response.ok) {
        throw new HttpException(
          'Token verification failed',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const result = await response.json();
      const tokenData = result.data;

      // Check if the token is valid and active
      if (!tokenData.is_valid) {
        throw new HttpException(
          'Invalid Facebook access token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Check if the token belongs to our app (security measure)
      if (tokenData.app_id !== appId) {
        throw new HttpException(
          'Access token does not belong to this app',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Token verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Exchanges a short-lived Facebook access token for a long-lived one.
   * Useful for persisting user sessions longer than the default 1–2 hours.
   * @param shortLivedToken Facebook's default short-lived token.
   * @returns A long-lived access token from Facebook.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const appId = this.configService.get('facebook.appId', { infer: true });
      const appSecret = this.configService.get('facebook.appSecret', {
        infer: true,
      });

      if (!appId || !appSecret) {
        throw new HttpException(
          'Facebook app credentials not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const tokenUrl = new URL(`${this.baseUrl}/oauth/access_token`);
      tokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
      tokenUrl.searchParams.set('client_id', appId);
      tokenUrl.searchParams.set('client_secret', appSecret);
      tokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

      const response = await fetch(tokenUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to exchange token',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Facebook token exchange failed:', error);
      throw new HttpException(
        'Failed to exchange token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
