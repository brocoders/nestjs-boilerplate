import { HttpStatus } from '@nestjs/common';

export class TypeMessage {
  static readonly MESSAGES: Record<number, string> = {
    // Informational responses
    [HttpStatus.CONTINUE]: 'continue',
    [HttpStatus.SWITCHING_PROTOCOLS]: 'switchingProtocols',
    [HttpStatus.PROCESSING]: 'processing',

    // Success responses
    [HttpStatus.OK]: 'success',
    [HttpStatus.CREATED]: 'created',
    [HttpStatus.ACCEPTED]: 'accepted',
    [HttpStatus.NON_AUTHORITATIVE_INFORMATION || 203]:
      'nonAuthoritativeInformation',
    [HttpStatus.NO_CONTENT]: 'noContent',
    [HttpStatus.RESET_CONTENT || 205]: 'resetContent',
    [HttpStatus.PARTIAL_CONTENT || 206]: 'partialContent',

    // Redirection messages
    [HttpStatus.AMBIGUOUS || 300]: 'ambiguous',
    [HttpStatus.MOVED_PERMANENTLY]: 'movedPermanently',
    [HttpStatus.FOUND]: 'found',
    [HttpStatus.SEE_OTHER]: 'seeOther',
    [HttpStatus.NOT_MODIFIED]: 'notModified',
    [HttpStatus.TEMPORARY_REDIRECT]: 'temporaryRedirect',
    [HttpStatus.PERMANENT_REDIRECT]: 'permanentRedirect',

    // Client error responses
    [HttpStatus.BAD_REQUEST]: 'badRequest',
    [HttpStatus.UNAUTHORIZED]: 'unauthorized',
    [HttpStatus.PAYMENT_REQUIRED || 402]: 'paymentRequired',
    [HttpStatus.FORBIDDEN]: 'forbidden',
    [HttpStatus.NOT_FOUND]: 'notFound',
    [HttpStatus.METHOD_NOT_ALLOWED]: 'methodNotAllowed',
    [HttpStatus.NOT_ACCEPTABLE]: 'notAcceptable',
    [HttpStatus.PROXY_AUTHENTICATION_REQUIRED || 407]:
      'proxyAuthenticationRequired',
    [HttpStatus.REQUEST_TIMEOUT]: 'requestTimeout',
    [HttpStatus.CONFLICT]: 'conflict',
    [HttpStatus.GONE]: 'gone',
    [HttpStatus.LENGTH_REQUIRED || 411]: 'lengthRequired',
    [HttpStatus.PRECONDITION_FAILED || 412]: 'preconditionFailed',
    [HttpStatus.PAYLOAD_TOO_LARGE || 413]: 'payloadTooLarge',
    [HttpStatus.URI_TOO_LONG || 414]: 'uriTooLong',
    [HttpStatus.UNSUPPORTED_MEDIA_TYPE || 415]: 'unsupportedMediaType',
    [HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE || 416]:
      'requestedRangeNotSatisfiable',
    [HttpStatus.EXPECTATION_FAILED || 417]: 'expectationFailed',
    [HttpStatus.I_AM_A_TEAPOT || 418]: 'imATeapot',
    [HttpStatus.MISDIRECTED || 421]: 'misdirectedRequest',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'notEntityExist',
    [HttpStatus.FAILED_DEPENDENCY || 424]: 'failedDependency',
    [HttpStatus.PRECONDITION_REQUIRED || 428]: 'preconditionRequired',
    [HttpStatus.TOO_MANY_REQUESTS]: 'tooManyRequests',

    // Server error responses
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'internalServerError',
    [HttpStatus.NOT_IMPLEMENTED]: 'notImplemented',
    [HttpStatus.BAD_GATEWAY]: 'badGateway',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'serviceUnavailable',
    [HttpStatus.GATEWAY_TIMEOUT]: 'gatewayTimeout',
    [HttpStatus.HTTP_VERSION_NOT_SUPPORTED || 505]: 'httpVersionNotSupported',
  };

  /**
   * Get the message for a given HTTP status code.
   * @param status The HTTP status code.
   * @returns The corresponding message or 'unknownStatus' if not defined.
   */
  static getMessageByStatus(status: number): string {
    return this.MESSAGES[status] || 'unknownStatus';
  }
}
