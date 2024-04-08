import domainToDocumentCondition from './domain-to-document-condition';

describe('domainToDocumentCondition', () => {
  it('should convert domain to document conditions', () => {
    const conditions = {
      id: 'abc',
      email: 'test@example.com',
      role: [{ id: '1' }],
      status: {
        id: '2',
      },
      keyLevel1: {
        id: '3',
        keyLevel2: [{ id: '4' }, { id: '5' }],
      },
    };

    expect(domainToDocumentCondition(conditions)).toEqual({
      _id: 'abc',
      email: 'test@example.com',
      'role._id': { $in: ['1'] },
      'status._id': '2',
      'keyLevel1._id': '3',
      'keyLevel1.keyLevel2._id': { $in: ['4', '5'] },
    });
  });
});
