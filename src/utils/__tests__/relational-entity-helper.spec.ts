import { EntityRelationalHelper } from '../relational-entity-helper';

describe('EntityRelationalHelper', () => {
  it('should set entity name and serialize to plain object', () => {
    class TestEntity extends EntityRelationalHelper {
      id = 1;
    }
    const entity = new TestEntity();
    entity.setEntityName();
    expect(entity.__entity).toBe('TestEntity');
    expect(entity.toJSON()).toEqual({ id: 1, __entity: 'TestEntity' });
  });
});
