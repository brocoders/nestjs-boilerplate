module.exports = [
  {
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
  },
  {
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
  },
  {
    type: 'select',
    name: 'type',
    choices: ['string', 'number', 'boolean'],
  },
  {
    type: 'confirm',
    name: 'isAddToDto',
    message: 'Add to DTO?',
    initial: true,
  },
];
