import { EntityCondition } from './entity-condition.type';

export type FindOptions<T> = {
  where: EntityCondition<T>;
};
