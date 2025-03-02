// vero.mapper.ts
import { SocialInterface } from '../../../../../social/interfaces/social.interface';

export class VeroPayloadMapper {
  mapPayloadToSocial(payload: any): SocialInterface {
    return {
      id: payload.uid,
      firstName: payload.fullname ? payload.fullname.split(' ')[0] : undefined,
      lastName: payload.fullname ? payload.fullname.split(' ')[1] : undefined,
      email: payload.email,
    };
  }
}
