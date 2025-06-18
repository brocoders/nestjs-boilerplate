import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import {
  MapArea,
  MapAreaDocument,
} from '../../../../map/areas/schemas/map-area.schema';

@Injectable()
export class MapAreasSeedService {
  private readonly readFileAsync = promisify(fs.readFile);
  private readonly CHUNK_SIZE = 200; // Process 1000 features at a time

  constructor(
    @InjectModel(MapArea.name) private mapAreaModel: Model<MapAreaDocument>,
  ) {}

  async seedFromFile(
    filePath: string,
  ): Promise<{ success: boolean; message: string; count: number }> {
    try {
      // Read the file
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), filePath);
      const fileContent = await this.readFileAsync(fullPath, 'utf8');
      const data = JSON.parse(fileContent);

      if (!data.features || !Array.isArray(data.features)) {
        throw new Error('Invalid GeoJSON file: missing features array');
      }

      console.log(`Processing ${data.features.length} features...`);

      let insertedCount = 0;
      let skippedCount = 0;
      let invalidGeometryCount = 0;

      // Process features in chunks
      const chunks = this.chunkArray(data.features, this.CHUNK_SIZE);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(
          `Processing chunk ${i + 1}/${chunks.length} (${chunk.length} features)...`,
        );

        const chunkResult = await this.processChunk(chunk);
        insertedCount += chunkResult.insertedCount;
        skippedCount += chunkResult.skippedCount;
        invalidGeometryCount += chunkResult.invalidGeometryCount;
      }

      return {
        success: true,
        message: `Seeding completed. Inserted: ${insertedCount}, Skipped: ${skippedCount}, Invalid Geometry: ${invalidGeometryCount}`,
        count: insertedCount,
      };
    } catch (error) {
      console.error('Seeding error:', error);
      return {
        success: false,
        message: `Seeding failed: ${error.message}`,
        count: 0,
      };
    }
  }

  private async processChunk(features: any[]): Promise<{
    insertedCount: number;
    skippedCount: number;
    invalidGeometryCount: number;
  }> {
    let insertedCount = 0;
    let skippedCount = 0;
    let invalidGeometryCount = 0;

    // Filter out invalid geometries first
    const validFeatures: any[] = [];
    for (const feature of features) {
      if (!this.isValidGeometry(feature.geometry)) {
        console.warn(
          `Skipping feature with invalid geometry: ${
            feature.properties?.id || 'unknown'
          }`,
        );
        invalidGeometryCount++;
        continue;
      }
      validFeatures.push(feature);
    }

    if (validFeatures.length === 0) {
      return { insertedCount: 0, skippedCount: 0, invalidGeometryCount };
    }

    // Get existing IDs to avoid duplicates
    const existingIds = await this.getExistingIds(validFeatures);

    // Prepare bulk operations
    const bulkOps: any[] = [];
    for (const feature of validFeatures) {
      const featureId = feature.properties?.id;

      if (existingIds.has(featureId)) {
        skippedCount++;
        continue;
      }

      const mapAreaData = {
        type: feature.type || 'Feature',
        geometry: feature.geometry,
        properties: feature.properties || {},
      };

      bulkOps.push({
        insertOne: {
          document: mapAreaData,
        },
      });
    }

    // Execute bulk write if there are operations
    if (bulkOps.length > 0) {
      try {
        const result = await this.mapAreaModel.bulkWrite(bulkOps, {
          ordered: false, // Continue processing even if some operations fail
        });
        insertedCount = result.insertedCount || 0;
      } catch (error) {
        console.error('Bulk write error:', error);
        // Fallback to individual inserts for failed operations
        const fallbackResult = await this.fallbackToIndividualInserts(
          validFeatures,
          existingIds,
        );
        insertedCount = fallbackResult.insertedCount;
        skippedCount += fallbackResult.skippedCount;
      }
    }

    return { insertedCount, skippedCount, invalidGeometryCount };
  }

  private async getExistingIds(features: any[]): Promise<Set<any>> {
    const ids = features
      .map((f) => f.properties?.id)
      .filter((id) => id !== undefined);

    if (ids.length === 0) {
      return new Set();
    }

    const existingDocs = await this.mapAreaModel
      .find({ 'properties.id': { $in: ids } })
      .select('properties.id')
      .lean()
      .exec();

    return new Set(existingDocs.map((doc) => doc.properties.id));
  }

  private async fallbackToIndividualInserts(
    features: any[],
    existingIds: Set<any>,
  ): Promise<{
    insertedCount: number;
    skippedCount: number;
  }> {
    let insertedCount = 0;
    let skippedCount = 0;

    for (const feature of features) {
      try {
        const featureId = feature.properties?.id;

        if (existingIds.has(featureId)) {
          skippedCount++;
          continue;
        }

        const mapAreaData = {
          type: feature.type || 'Feature',
          geometry: feature.geometry,
          properties: feature.properties || {},
        };

        const newMapArea = new this.mapAreaModel(mapAreaData);
        await newMapArea.save();
        insertedCount++;
      } catch (error) {
        console.error(
          `Error inserting feature ${feature.properties?.id}:`,
          error,
        );
        continue;
      }
    }

    return { insertedCount, skippedCount };
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async seedFromDirectory(
    directoryPath: string,
  ): Promise<{ success: boolean; message: string; results: any[] }> {
    try {
      const fullPath = path.isAbsolute(directoryPath)
        ? directoryPath
        : path.join(process.cwd(), directoryPath);
      const files = fs.readdirSync(fullPath);
      const geoJsonFiles = files.filter(
        (file) => file.endsWith('.geojson') || file.endsWith('.json'),
      );

      const results: any[] = [];

      for (const file of geoJsonFiles) {
        const filePath = path.join(fullPath, file);
        const result = await this.seedFromFile(filePath);
        results.push({
          file,
          ...result,
        });
      }

      return {
        success: true,
        message: `Processed ${geoJsonFiles.length} files`,
        results,
      };
    } catch (error) {
      console.error('Directory seeding error:', error);
      return {
        success: false,
        message: `Directory seeding failed: ${error.message}`,
        results: [],
      };
    }
  }

  async clearCollection(): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const result = await this.mapAreaModel.deleteMany({}).exec();
      return {
        success: true,
        message: `Cleared collection. Deleted ${result.deletedCount} documents.`,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      console.error('Clear collection error:', error);
      return {
        success: false,
        message: `Failed to clear collection: ${error.message}`,
        deletedCount: 0,
      };
    }
  }

  async getCollectionStats(): Promise<{ total: number; message: string }> {
    try {
      const total = await this.mapAreaModel.countDocuments().exec();
      return {
        total,
        message: `Collection contains ${total} documents.`,
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return {
        total: 0,
        message: `Failed to get stats: ${error.message}`,
      };
    }
  }

  private isValidGeometry(geometry: any): boolean {
    if (!geometry || !geometry.type || !geometry.coordinates) {
      return false;
    }

    const { type, coordinates } = geometry;

    switch (type) {
      case 'Point':
        return Array.isArray(coordinates) && coordinates.length >= 2;

      case 'LineString':
        return (
          Array.isArray(coordinates) &&
          coordinates.length >= 2 &&
          coordinates.every(
            (coord) => Array.isArray(coord) && coord.length >= 2,
          )
        );

      case 'Polygon':
        return (
          Array.isArray(coordinates) &&
          coordinates.length >= 1 &&
          coordinates.every((ring) => Array.isArray(ring) && ring.length >= 4)
        );

      case 'MultiPolygon':
        return (
          Array.isArray(coordinates) &&
          coordinates.length >= 1 &&
          coordinates.every(
            (polygon) =>
              Array.isArray(polygon) &&
              polygon.length >= 1 &&
              polygon.every((ring) => Array.isArray(ring) && ring.length >= 4),
          )
        );

      default:
        return false;
    }
  }
}
