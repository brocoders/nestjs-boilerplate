export interface CreateTagPayload {
  name: string;
}

export interface CreateArticlePayload {
  title: string;
  subtitle?: string;
  summary?: string | null;
  views: number;
  isPublished: boolean;
  publishedAt?: string | null;
  hireDate: string;
  coverImage?: { id: string | number } | null;
  author: { id: string | number };
  tags?: Array<{ id: string | number }>;
  denormalizedAuthor: { id: string | number };
  editor?: { id: string | number };
}

export function buildArticlePayload(args: {
  adminId: string | number;
  tagId: string | number;
  titleSuffix: string;
}): CreateArticlePayload {
  return {
    title: `Test article ${args.titleSuffix}`,
    subtitle: 'optional subtitle',
    summary: null,
    views: 0,
    isPublished: false,
    publishedAt: null,
    hireDate: new Date('2025-01-01').toISOString(),
    coverImage: null,
    author: { id: args.adminId },
    tags: [{ id: args.tagId }],
    denormalizedAuthor: { id: args.adminId },
    editor: { id: args.adminId },
  };
}
