export class CmcCategoryInfo {
  /** Path prefix for the API group (e.g. `/cryptocurrency`) */
  path: string;

  /** Human-readable description of what this group provides */
  description: string;

  constructor(path: string, description: string) {
    this.path = path;
    this.description = description;
  }
}
