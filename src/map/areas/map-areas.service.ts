import { Injectable } from '@nestjs/common';
import { MapAreasFilterDto } from './dto/map-areas-filter.dto';
import { MapAreaResponseDto } from './dto/map-area-response.dto';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class MapAreasService {
  private readonly dataPath = path.join(
    process.cwd(),
    'files',
    'sisteco.geojson',
    // 'Incendi_boschivi.json',
  );
  private readonly readFileAsync = promisify(fs.readFile);

  async getAreas(filters: MapAreasFilterDto): Promise<MapAreaResponseDto> {
    // Read the JSON file asynchronously
    const fileContent = await this.readFileAsync(this.dataPath, 'utf8');
    const data: MapAreaResponseDto = JSON.parse(fileContent);

    // Apply filters
    let filteredFeatures = [...data.features];

    if (filters.area) {
      const areaLower = filters.area.toLowerCase();
      filteredFeatures = filteredFeatures.filter(
        (feature) =>
          feature.properties.comune?.toLowerCase().includes(areaLower) ||
          feature.properties.localita?.toLowerCase().includes(areaLower) ||
          feature.properties.codice_rt?.toLowerCase().includes(areaLower),
      );
    }

    if (filters.intervention) {
      const interventionLower = filters.intervention.toLowerCase();
      filteredFeatures = filteredFeatures.filter(
        (feature) =>
          feature.properties.tipologia
            ?.toLowerCase()
            .includes(interventionLower) ||
          feature.properties.esito_cfs
            ?.toLowerCase()
            .includes(interventionLower),
      );
    }

    if (filters.budget) {
      filteredFeatures = filteredFeatures.filter((feature) => {
        const area = feature.properties.area_tot || 0;
        return (
          area >= (filters.budget?.min || 0) &&
          area <= (filters.budget?.max || Number.MAX_VALUE)
        );
      });
    }

    if (filters.priority) {
      const priorityLower = filters.priority.toLowerCase();
      filteredFeatures = filteredFeatures.filter((feature) =>
        feature.properties.des_classe?.toLowerCase().includes(priorityLower),
      );
    }

    if (filters.participation) {
      const participationLower = filters.participation.toLowerCase();
      filteredFeatures = filteredFeatures.filter((feature) =>
        feature.properties.provincia
          ?.toLowerCase()
          .includes(participationLower),
      );
    }

    return {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };
  }
}
