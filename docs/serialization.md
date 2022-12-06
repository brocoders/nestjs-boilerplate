# Serialization

For serialization boilerplate use [class-transformer](https://www.npmjs.com/package/class-transformer) and global interceptor `ClassSerializerInterceptor`.

---

## Table of Contents

- [Hide private property](#hide-private-property)
- [Show private property for admins](#show-private-property-for-admins)

---

## Hide private property

If you need to hide some property in the entity you can use `@Exclude({ toPlainOnly: true })` on the column.

```ts
// /src/users/entities/user.entity.ts

import { Exclude } from 'class-transformer';

@Entity()
export class User extends EntityHelper {
  // Some code here...

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

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

1. In the entity add `@Expose({ groups: ['admin'] })` to the column that should be exposed for admin:

    ```ts
    // /src/users/entities/user.entity.ts
    
    // Some code here...

    import { Expose } from 'class-transformer';

    @Entity()
    export class User extends EntityHelper {
      // Some code here...

      @Column({ unique: true, nullable: true })
      @Expose({ groups: ['admin'] })
      email: string | null;

      // Some code here...
    }
    ```

---

GitHub: https://github.com/brocoders/nestjs-boilerplate
