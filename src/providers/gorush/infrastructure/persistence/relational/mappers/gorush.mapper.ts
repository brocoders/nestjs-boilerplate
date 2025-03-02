import {
  PushNotificationDto,
  PushNotificationRequestDto,
  PushNotificationResponseDto,
} from 'src/providers/gorush/dto/gorush-notify.dto';

/**
 * Map raw push notification data to PushNotificationDto
 */
export function mapPushNotification(data: any): PushNotificationDto {
  return {
    notif_id: data?.notif_id || undefined,
    tokens: Array.isArray(data?.tokens) ? data.tokens : [],
    platform: Number(data?.platform) || 0,
    message: data?.message || 'No message provided',
    title: data?.title || undefined,
    priority: data?.priority || undefined,
    content_available: Boolean(data?.content_available),
    sound: typeof data?.sound === 'object' ? data.sound : undefined,
    data: typeof data?.data === 'object' ? data.data : undefined,
    huawei_data: data?.huawei_data || undefined,
    retry: Number(data?.retry) || undefined,
    topic: data?.topic || undefined,
    image: data?.image || undefined,
    to: data?.to || undefined,
    collapse_key: data?.collapse_key || undefined,
    huawei_collapse_key: Number(data?.huawei_collapse_key) || undefined,
    delay_while_idle: Boolean(data?.delay_while_idle),
    time_to_live: Number(data?.time_to_live) || undefined,
    huawei_ttl: data?.huawei_ttl || undefined,
    restricted_package_name: data?.restricted_package_name || undefined,
    dry_run: Boolean(data?.dry_run),
  };
}

/**
 * Map raw push notification request data to PushNotificationRequestDto
 */
export function mapPushNotificationRequest(
  data: any,
): PushNotificationRequestDto {
  return {
    notifications: Array.isArray(data?.notifications)
      ? data.notifications.map(mapPushNotification)
      : [],
  };
}

/**
 * Map raw push notification response to PushNotificationResponseDto
 */
export function mapPushNotificationResponse(
  data: any,
): PushNotificationResponseDto {
  return {
    success: Boolean(data?.success),
    count: Number(data?.count) || 0,
    logs: Array.isArray(data?.logs)
      ? data.logs.map((log: any) => ({
          type: log?.type || 'Unknown',
          platform: log?.platform || 'Unknown',
          token: log?.token || 'Unknown',
          message: log?.message || 'No message provided',
          error: log?.error || 'No error details',
        }))
      : [],
  };
}
