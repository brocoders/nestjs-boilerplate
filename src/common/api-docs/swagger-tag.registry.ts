// src/docs/swagger-tag.registry.ts
import { DocumentBuilder } from '@nestjs/swagger';

export interface SwaggerTagDefinition {
  name: string;
  description?: string;
  reference?: string;
}

export class SwaggerTagRegistry {
  private static instance: SwaggerTagRegistry;
  private tags: SwaggerTagDefinition[] = [];

  private constructor() {}

  static getInstance(): SwaggerTagRegistry {
    if (!SwaggerTagRegistry.instance) {
      SwaggerTagRegistry.instance = new SwaggerTagRegistry();
    }
    return SwaggerTagRegistry.instance;
  }

  registerTag(name: string, description?: string, reference?: string) {
    if (!this.tags.find((tag) => tag.name === name)) {
      this.tags.push({ name, description, reference });
    }
  }

  getTags(): SwaggerTagDefinition[] {
    return this.tags;
  }

  clear() {
    this.tags = [];
  }

  /**
   * Registers all collected tags into the given DocumentBuilder instance.
   * Returns the same builder for fluent chaining.
   */
  registerToBuilder(builder: DocumentBuilder): DocumentBuilder {
    this.tags.forEach((tag) => {
      if (tag.description && tag.reference) {
        builder.addTag(
          tag.name,
          `***[${tag.description}](${tag.reference})***`,
        );
      } else if (tag.description) {
        builder.addTag(tag.name, tag.description);
      } else {
        builder.addTag(tag.name); // Only name, no description
      }
    });
    return builder;
  }
}
