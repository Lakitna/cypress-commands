# Cypress commands

[![npm version](https://badge.fury.io/js/cypress-commands.svg)](https://badge.fury.io/js/cypress-commands)

A collection of high-quality Cypress commands to complement and extend the defaults.

This repository is not maintained by the Cypress developers. This means we can choose to ignore
parts of their vision.

Documentation is a cornerstone of Cypress, the commands in this repository will try to keep these
documentation standards.

## Cypress version

`cypress-commands` should work with the latest version of Cypress. If this is not the case, please
open an issue.

It's tested against multiple versions of Cypress. See the
[CI definition](./.github/workflows/ci.yaml) for the most up-to-date list.

## Installation

Install the module.

```shell
npm install cypress-commands
```

Add the following line to `cypress/support/index.js`.

```javascript
require('cypress-commands');
```

### Type definitions

Import typescript definitions by adding them to your `tsconfig.json`. Add the cypress-commands types
before the Cypress types so intellisense will prefer the cypress-commands versions of extended
commands.

```json
{
  "compilerOptions": {
    "types": ["cypress-commands", "cypress"]
  }
}
```

## Extended commands

These commands have been extended to be able to do more than originally intended. For these
commands, all tests that exist in the Cypress repository are copied to make sure the default
behaviour stays identical unless we want it changed.

- [`.request()`](./docs/request.md)
- [`.then()`](./docs/then.md)

## Added commands

These commands do not exist in Cypress by default.

- [`.attribute()`](./docs/attribute.md)
- [`.text()`](./docs/text.md)
- [`.to()`](./docs/to.md)

## Contributing

Contributors are always welcome! I don't care if you are a beginner or an expert, all help is
welcome.

## Running tests

First clone the repository and install the dependencies.

### GUI mode

```shell
npm start
```

### CLI mode

```shell
npm test
```
