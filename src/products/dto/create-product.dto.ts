import { IsInt, IsString, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @Min(0)
  jumlah: number;

  @IsString()
  @MaxLength(255)
  judul: string;

  @IsString()
  deskripsi: string;
}
