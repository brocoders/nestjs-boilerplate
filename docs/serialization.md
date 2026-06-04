# Serialization

For serialization boilerplate use [class-transformer](https://www.npmjs.com/package/class-transformer) and global interceptor `ClassSerializerInterceptor`.

---

## Table of Contents <!-- omit in toc -->

- [Hide private property](#hide-private-property)
- [Show private property for admins](#show-private-property-for-admins)

---

## Hide private property

If you need to hide some property in the response model you can use `@Exclude({ toPlainOnly: true })`.

```ts
// /src/users/domain/user.ts

import { Exclude } from 'class-transformer';

export class User {
  // Some code here...

  @Exclude({ toPlainOnly: true })
  password?: string;

  // Some code here...
}
```

## Show private property for admins

1. Create a controller that returns data only for admin and add `@SerializeOptions({ groups: ['admin'] })` to method:

   ```ts
   // /src/users/users.controller.ts

   // Some code here...

   @ApiBearerAuth()
   @Roles(RoleEnum.admin)
   @UseGuards(AuthGuard('jwt'), RolesGuard)
   @Controller({
     path: 'users',
     version: '1',
   })
   export class UsersController {
     constructor(private readonly usersService: UsersService) {}

     // Some code here...

     @SerializeOptions({
       groups: ['admin'],
     })
     @Get(':id')
     @HttpCode(HttpStatus.OK)
     findOne(@Param('id') id: string) {
       return this.usersService.findOne({ id: +id });
     }

     // Some code here...
   }
   ```

1. In the response model add `@Expose({ groups: ['admin'] })` to the property that should be exposed for admin:

   ```ts
   // /src/users/domain/user.ts

   // Some code here...

   import { Expose } from 'class-transformer';

   export class User {
     // Some code here...

     @Expose({ groups: ['admin'] })
     email: string | null;

     // Some code here...
   }
   ```

---

Previous: [Auth](auth.md)

Next: [File uploading](file-uploading.md)
