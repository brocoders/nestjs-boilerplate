const { execSync } = require('child_process');

const collectPromisesResults = (callback) => async (prevValues) => {
  const results = await callback(prevValues);

  return { ...prevValues, ...results };
};

module.exports = {
  prompt: async ({ prompter, args }) => {
    if (Object.keys(args).length) {
      return Promise.resolve({
        name: args.name,
        property: args.property,
        kind: args.kind,
        type: args.type,
        referenceType: args.referenceType,
        propertyInReference: args.propertyInReference,
        isAddToDto: args.isAddToDto === 'true',
        isOptional: args.isOptional === 'true',
        isNullable: args.isNullable === 'true',
      });
    }

    const result = await prompter
      .prompt({
        type: 'input',
        name: 'name',
        message: "Entity name (e.g. 'User')",
        validate: (input) => {
          if (!input.trim()) {
            return 'Entity name is required';
          }

          return true;
        },
        format: (input) => {
          return input.trim();
        },
      })
      .then(
        collectPromisesResults(() => {
          return prompter.prompt({
            type: 'input',
            name: 'property',
            message: "Property name (e.g. 'firstName')",
            validate: (input) => {
              if (!input.trim()) {
                return 'Property name is required';
              }

              return true;
            },
            format: (input) => {
              return input.trim();
            },
          });
        }),
      )
      .then(
        collectPromisesResults((rootValues) => {
          return prompter
            .prompt({
              type: 'select',
              name: 'kind',
              message: 'Select kind of type',
              choices: [
                {
                  message: 'Primitive and Date (string, number, Date, etc)',
                  value: 'primitive',
                },
                { message: 'Reference to entity', value: 'reference' },
                {
                  message: 'Duplication data from entity',
                  value: 'duplication',
                },
              ],
            })
            .then(
              collectPromisesResults((values) => {
                if (
                  values.kind === 'reference' ||
                  values.kind === 'duplication'
                ) {
                  return prompter
                    .prompt({
                      type: 'input',
                      name: 'type',
                      message: "Entity name (e.g. 'File')",
                      validate: (input) => {
                        if (!input.trim()) {
                          return 'Entity name is required';
                        }

                        return true;
                      },
                      format: (input) => {
                        return input.trim();
                      },
                    })
                    .then(
                      collectPromisesResults((referenceValues) => {
                        return prompter
                          .prompt({
                            type: 'select',
                            name: 'referenceType',
                            message: 'Select type of reference',
                            choices: [
                              {
                                message: `One to one (${rootValues.name} contains only one instance of ${referenceValues.type}, and ${referenceValues.type} contains only one instance of ${rootValues.name}. ${rootValues.property}: ${referenceValues.type})`,
                                value: 'oneToOne',
                              },
                              {
                                message: `One to many (${rootValues.name} contains multiple instances of ${referenceValues.type}, but ${referenceValues.type} contains only one instance of ${rootValues.name}. ${rootValues.property}: ${referenceValues.type}[])`,
                                value: 'oneToMany',
                              },
                              {
                                message: `Many to one (${rootValues.name} contains only one instance of ${referenceValues.type}, but ${referenceValues.type} contains multiple instances of ${rootValues.name}. ${rootValues.property}: ${referenceValues.type})`,
                                value: 'manyToOne',
                              },
                              {
                                message: `Many to many (${rootValues.name} contains multiple instances of ${referenceValues.type}, and ${referenceValues.type} contains multiple instances of ${rootValues.name}. ${rootValues.property}: ${referenceValues.type}[])`,
                                value: 'manyToMany',
                              },
                            ],
                          })
                          .then(
                            collectPromisesResults((referenceTypeValues) => {
                              if (
                                referenceTypeValues.referenceType ===
                                'oneToMany'
                              ) {
                                return prompter.prompt({
                                  type: 'input',
                                  name: 'propertyInReference',
                                  message: `Property name in ${referenceValues.type} (e.g. 'createdBy')`,
                                  validate: (input) => {
                                    if (!input.trim()) {
                                      return `Property name in ${referenceValues.type} is required`;
                                    }

                                    return true;
                                  },
                                  format: (input) => {
                                    return input.trim();
                                  },
                                });
                              }

                              return referenceTypeValues;
                            }),
                          );
                      }),
                    );
                }

                return prompter.prompt({
                  type: 'select',
                  name: 'type',
                  message: 'Property type',
                  choices: ['string', 'number', 'boolean', 'Date'],
                });
              }),
            );
        }),
      )
      .then(
        collectPromisesResults(() => {
          return prompter.prompt({
            type: 'confirm',
            name: 'isAddToDto',
            message: 'Add to DTO?',
            initial: true,
          });
        }),
      )
      .then(
        collectPromisesResults(() => {
          return prompter.prompt({
            type: 'confirm',
            name: 'isOptional',
            message: 'Is the property optional?',
            initial: true,
          });
        }),
      )
      .then(
        collectPromisesResults((values) => {
          if (!values.isOptional) {
            return { isNullable: false };
          }

          return prompter.prompt({
            type: 'confirm',
            name: 'isNullable',
            message: 'Can the property be nullable??',
            initial: true,
          });
        }),
      );

    if (!result.propertyInReference) {
      result.propertyInReference = '';
    }

    if (
      (result.kind === 'reference' || result.kind === 'duplication') &&
      result.referenceType === 'oneToMany'
    ) {
      execSync(
        `npm run add:property:to-relational -- --name ${result.type} --property ${result.propertyInReference} --propertyInReference ${result.property} --kind ${result.kind} --type ${result.name} --referenceType manyToOne --isAddToDto ${result.isAddToDto} --isOptional false --isNullable false`,
        {
          stdio: 'inherit',
        },
      );
    }

    return result;
  },
};
