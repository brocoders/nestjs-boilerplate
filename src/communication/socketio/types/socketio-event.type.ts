export class WsEvent {
  private constructor(public readonly value: string) {}

  static readonly ERROR = new WsEvent('error');
  static readonly PING = new WsEvent('ping');
  static readonly PONG = new WsEvent('pong');
  static readonly RPC = new WsEvent('rpc');
  static readonly WHOAMI = new WsEvent('whoami');
  static readonly REAUTH = new WsEvent('re-auth');
  static readonly MSG_TO_CLIENT = new WsEvent('message');
}
