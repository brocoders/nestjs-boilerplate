import { Request } from 'express';

export function getReadableClientIpSync(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  let ip =
    typeof forwarded === 'string' && forwarded.length > 0
      ? forwarded.split(',')[0].trim()
      : req.socket?.remoteAddress ||
        (req.connection as any)?.remoteAddress ||
        req.ip ||
        '';

  // Normalize IPv6-mapped IPv4: ::ffff:127.0.0.1
  ip = ip.replace(/^::ffff:/, '');

  // Local / private → "localhost"
  if (ip === '::1' || ip === '127.0.0.1') return 'localhost';
  if (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)
  ) {
    return 'localhost';
  }

  return ip || 'unknown';
}

export function getClientAgentName(req: Request): string {
  const ua = (req.headers['user-agent'] || '').toString();

  if (!ua) return 'unknown';

  const lower = ua.toLowerCase();

  if (lower.includes('postman')) return 'Postman';
  if (lower.includes('insomnia')) return 'Insomnia';
  if (lower.includes('curl/')) return 'curl';
  if (lower.includes('axios')) return 'axios';
  if (lower.includes('node-fetch')) return 'node-fetch';
  if (lower.includes('python-requests') || lower.includes('requests'))
    return 'python-requests';
  if (lower.includes('java-http-client')) return 'java-http-client';
  if (lower.includes('okhttp')) return 'okhttp (Android)';
  if (lower.includes('retrofit')) return 'retrofit (Android)';
  if (lower.includes('dart:io') || lower.includes('dart/'))
    return 'dart-http-client (Flutter)';
  if (lower.includes('unity')) return 'unity';
  if (lower.includes('android')) return 'android-client';
  if (
    lower.includes('iphone') ||
    lower.includes('ios') ||
    lower.includes('swift')
  )
    return 'ios-client';
  if (lower.startsWith('mozilla/')) return 'browser';

  // generic: first token before whitespace or slash
  const token = ua.split(/[ \t]/)[0];
  const name = token.split('/')[0];
  return name || 'unknown';
}
