import { IsString, MaxLength } from 'class-validator';

export class CreateOrganizationMemberDto {
  @IsString()
  @MaxLength(500)
  image: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  description: string;
}
