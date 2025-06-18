# Map Areas Seed Service

This service provides functionality to seed the Map Areas collection in MongoDB with GeoJSON data.

## Features

- Seed from single GeoJSON file
- Seed from directory containing multiple GeoJSON files
- Duplicate detection and skipping
- Collection statistics
- Clear collection functionality

## Usage

### Command Line

```bash
# Seed from a single file
npm run seed:map-areas file ./files/sisteco.geojson

# Seed from a directory
npm run seed:map-areas directory ./files

# Get collection statistics
npm run seed:map-areas stats

# Clear collection
npm run seed:map-areas clear
```

## File Structure

```
src/database/seeds/Map/
├── seed.module.ts              # Main Map seed module
└── Areas/
    ├── map-areas.seed.ts       # Main seed service
    ├── map-areas-seed.module.ts # Seed module for Map Areas
    ├── run-seed.ts             # Command line runner
    └── README.md               # This file
```

## Configuration

The service expects GeoJSON files with the following structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "unique-identifier",
        // ... other properties
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], [lng, lat], ...]]
      }
    }
  ]
}
```

## Duplicate Detection

The service uses the `properties.id` field to detect duplicates. If a document with the same ID already exists, it will be skipped.

## Error Handling

- Invalid GeoJSON files are logged and skipped
- Individual feature processing errors are logged but don't stop the entire process
- File system errors are properly handled and reported

## Dependencies

- `@nestjs/mongoose` - MongoDB integration
- `mongoose` - MongoDB ODM
- `fs` - File system operations
- `path` - Path utilities

## Integration

The seed service is designed to run independently of the main application, using its own MongoDB connection and module structure.

## Examples

### Seeding from a file

```bash
npm run seed:map-areas file ./data/regions.geojson
```

### Seeding from a directory

```bash
npm run seed:map-areas directory ./data/geojson-files
```

### Getting statistics

```bash
npm run seed:map-areas stats
```

### Clearing the collection

```bash
npm run seed:map-areas clear
```

## Module Structure

The seed service follows the same pattern as other seeds in the project:

1. **MapSeedModule** (`src/database/seeds/Map/seed.module.ts`) - Main module that sets up MongoDB connection and imports all Map-related seed modules
2. **MapAreasSeedModule** (`src/database/seeds/Map/Areas/map-areas-seed.module.ts`) - Module specific to Map Areas seeding
3. **MapAreasSeedService** (`src/database/seeds/Map/Areas/map-areas.seed.ts`) - Service containing the seeding logic
4. **run-seed.ts** (`src/database/seeds/Map/Areas/run-seed.ts`) - Command line entry point

This structure ensures proper dependency injection and MongoDB connection handling. 