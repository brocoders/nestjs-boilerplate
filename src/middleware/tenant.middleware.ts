// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { TenantDataSource } from '../../database/tenant-data-source';

// /**
//  * Middleware to resolve tenant context for each request
//  * Attaches tenant-specific database connection to request
//  */
// @Injectable()
// export class TenantMiddleware implements NestMiddleware {
//   async use(req: Request, res: Response, next: NextFunction) {
//     const tenantId = this.extractTenantId(req);

//     if (tenantId) {
//       try {
//         req.tenantDataSource =
//           await TenantDataSource.getTenantDataSource(tenantId);
//         req.tenantId = tenantId;
//       } catch (error) {
//         console.error(`Tenant resolution failed: ${error.message}`);
//         throw new Error('Invalid tenant configuration');
//       }
//     }

//     next();
//   }

//   private extractTenantId(req: Request): string | null {
//     // Implementation example: Get from JWT or header
//     return (req.headers['x-tenant-id'] as string) || null;
//   }
// }
