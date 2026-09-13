---
to: src/<%= (function(n){const p=n.split('/');const e=p.pop();const d=p.map(x=>h.inflection.transform(x, ['underscore','dasherize'])).join('/');return (d?d+'/':'')+h.inflection.transform(e, ['pluralize','underscore','dasherize']) })(name) %>/infrastructure/persistence/relational/entities/<%= h.inflection.transform(name.split('/').pop(), ['underscore','dasherize']) %>.entity.ts
---<%
const _parts = name.split('/');
const _entityName = _parts[_parts.length - 1];
const _dirParts = _parts.slice(0, -1);
const _resourceDir = (_dirParts.length ? _dirParts.map(p => h.inflection.transform(p, ['underscore','dasherize'])).join('/') + '/' : '') + h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
const _entitySlug = h.inflection.transform(_entityName, ['underscore','dasherize']);
const _entityPlural = h.inflection.transform(_entityName, ['pluralize']);
const _entityPluralSlug = h.inflection.transform(_entityName, ['pluralize','underscore','dasherize']);
%>

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: '<%= h.inflection.transform(_entityName, ['underscore']) %>',
})
export class <%= _entityName %>Entity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
