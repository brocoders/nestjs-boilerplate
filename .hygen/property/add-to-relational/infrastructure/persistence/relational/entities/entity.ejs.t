---
inject: true
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.entity.ts
after: export class <%= name %>Entity
---

<% if (kind === 'primitive') { -%>
  @Column({
    nullable: <%= isNullable %>,
    type:
      <% if (type === 'string') { -%>
        String,
      <% } else if (type === 'number') { -%>
        Number,
      <% } else if (type === 'boolean') { -%>
        Boolean,
      <% } else if (type === 'Date') { -%>
        Date,
      <% } -%>
  })
<% } -%>

<% if (kind === 'duplication') { -%>
  @Column({
    nullable: <%= isNullable %>,
    type: 'jsonb',
  })
<% } -%>

<% if (kind === 'reference') { -%>
  <% if (referenceType === 'oneToOne') { -%>
    @OneToOne(() => <%= type %>Entity, { eager: true, nullable: <%= isNullable %> })
  <% } else if (referenceType === 'oneToMany') { -%>
    @OneToMany(() => <%= type %>Entity, (childEntity) => childEntity.<%= propertyInReference %>, { eager: true, nullable: <%= isNullable %> })
  <% } else if (referenceType === 'manyToOne') { -%>
    @ManyToOne(
      () => <%= type %>Entity,
      <% if (propertyInReference) { -%>
        (parentEntity) => parentEntity.<%= propertyInReference %>,
      <% } -%>
      { eager: <% if (propertyInReference) { -%>false<% } else { -%>true<% } -%>, nullable: <%= isNullable %> }
    )
  <% } else if (referenceType === 'manyToMany') { -%>
    @ManyToMany(() => <%= type %>Entity, { eager: true, nullable: <%= isNullable %> })
  <% } -%>

  <% if (referenceType === 'oneToOne' || referenceType === 'manyToMany') { -%>
    @JoinColumn()
  <% } -%>

  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>Entity<% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>[]<% } -%> <% if (isNullable) { -%> | null<% } -%>;
<% } else if (kind === 'duplication') { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %>Entity<% if (referenceType === 'oneToMany' || referenceType === 'manyToMany') { -%>[]<% } -%> <% if (isNullable) { -%> | null<% } -%>;
<% } else { -%>
  <%= property %><% if (!isAddToDto || isOptional) { -%>?<% } -%>: <%= type %> <% if (isNullable) { -%> | null<% } -%>;
<% } -%>


