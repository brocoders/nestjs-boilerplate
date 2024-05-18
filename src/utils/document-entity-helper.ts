import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EntityDocumentHelper {
  @ApiProperty({
    type: String,
  })
  @Transform(
    (value) => {
      if ('value' in value) {
        // https://github.com/typestack/class-transformer/issues/879
        return value.obj[value.key].toString();
      }

      return 'unknown value';
    },
    {
      toPlainOnly: true,
    },
  )
  public _id: string;
}
