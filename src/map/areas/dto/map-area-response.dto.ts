import { ApiProperty } from '@nestjs/swagger';

export class GeometryDto {
  @ApiProperty({ example: 'Polygon' })
  type: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    },
  })
  coordinates: number[][][];
}

export class PropertiesDto {
  @ApiProperty({ required: false })
  id: number | null;

  @ApiProperty({ example: 'RTInc2018_324' })
  idtpn: string;

  @ApiProperty({ example: 'RTInc2018_324' })
  codice_rt: string;

  @ApiProperty({ example: 'PISA' })
  provincia: string;

  @ApiProperty({ example: 'CALCI' })
  comune: string;

  @ApiProperty({ example: 'LE PORTE' })
  localita: string;

  @ApiProperty({ example: '1899-11-30T00:00:00.000Z' })
  data_inizi: string;

  @ApiProperty({ example: 'BOSCHIVO' })
  esito_cfs: string;

  @ApiProperty({ example: 1091.78937 })
  area_b: number;

  @ApiProperty({ example: 108.36374 })
  area_n: number;

  @ApiProperty({ example: 1200.15311 })
  area_tot: number;

  @ApiProperty({ example: 'grande' })
  des_classe: string;

  @ApiProperty({ example: '' })
  tipologia: string;

  @ApiProperty({ example: 2018 })
  anno: number;
}

export class FeatureDto {
  @ApiProperty({ example: 'Feature' })
  type: string;

  @ApiProperty()
  geometry: GeometryDto;

  @ApiProperty()
  properties: PropertiesDto;
}

export class MapAreaResponseDto {
  @ApiProperty({ example: 'FeatureCollection' })
  type: string;

  @ApiProperty({ type: [FeatureDto] })
  features: FeatureDto[];
}
