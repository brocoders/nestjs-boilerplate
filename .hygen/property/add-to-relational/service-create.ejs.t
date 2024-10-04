---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service.ts
after: \<creating\-property \/\>
---
<% if (isAddToDto && !isOptional && !isNullable) { -%>
  <% if (kind === 'reference' || kind === 'duplication') { -%>
    <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
      const <%= property %>Object = await this.<%= h.inflection.camelize(type, true) %>Service.findById(
        create<%= name %>Dto.<%= property %>.id,
      );
      if (!<%= property %>Object) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            <%= property %>: 'notExists',
          },
        });
      }
      const <%= property %> = <%= property %>Object;
    <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
      const <%= property %>Objects = await this.<%= h.inflection.camelize(type, true) %>Service.findByIds(
        create<%= name %>Dto.<%= property %>.map((entity) => entity.id),
      );
      if (<%= property %>Objects.length !== create<%= name %>Dto.<%= property %>.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            <%= property %>: 'notExists',
          },
        });
      }
      const <%= property %> = <%= property %>Objects;
    <% } -%>
  <% } -%>
<% } else { -%>
  <% if (kind === 'reference' || kind === 'duplication') { -%>
    <% if (referenceType === 'oneToOne' || referenceType === 'manyToOne') { -%>
      let <%= property %>: <%= type %><% if (type === 'File') { -%>Type<% } -%> <% if (isNullable) { -%> | null<% } -%> | undefined = undefined;

      if (create<%= name %>Dto.<%= property %>) {
        const <%= property %>Object = await this.<%= h.inflection.camelize(type, true) %>Service.findById(
          create<%= name %>Dto.<%= property %>.id,
        );
        if (!<%= property %>Object) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              <%= property %>: 'notExists',
            },
          });
        }
        <%= property %> = <%= property %>Object;
      }
      <% if (isNullable) { -%>
        else if (create<%= name %>Dto.<%= property %> === null) {
          <%= property %> = null;
        }
      <% } -%>
    <% } else if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>
      let <%= property %>: <%= type %><% if (type === 'File') { -%>Type<% } -%>[] <% if (isNullable) { -%> | null<% } -%> | undefined = undefined;

      if (create<%= name %>Dto.<%= property %>) {
        const <%= property %>Objects = await this.<%= h.inflection.camelize(type, true) %>Service.findByIds(
          create<%= name %>Dto.<%= property %>.map((entity) => entity.id),
        );
        if (<%= property %>Objects.length !== create<%= name %>Dto.<%= property %>.length) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              <%= property %>: 'notExists',
            },
          });
        }
        <%= property %> = <%= property %>Objects;
      }
      <% if (isNullable) { -%>
        else if (create<%= name %>Dto.<%= property %> === null) {
          <%= property %> = null;
        }
      <% } -%>
    <% } -%>
  <% } -%>
<% } -%>