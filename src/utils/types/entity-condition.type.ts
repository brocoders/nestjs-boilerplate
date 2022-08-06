import { FindOptionsWhere } from 'typeorm';

export type EntityCondition<T> = FindOptionsWhere<T>;
