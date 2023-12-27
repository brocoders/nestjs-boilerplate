export type EntityCondition<T> = {
  [P in keyof T]?: T[P] | T[P][] | undefined;
};
