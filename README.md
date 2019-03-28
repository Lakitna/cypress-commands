# Cypress commands

[![npm version](https://badge.fury.io/js/cypress-commands.svg)](https://badge.fury.io/js/cypress-commands)

A collection of high-quality Cypress commands to improve your life*.

This repository is not maintained by the Cypress developers. This means we can choose to ignore certain parts of their vision. That being said, their vision is excellent and we should not deviate from it very much.

The goal of these commands is to give you better tools for specific situations and use cases.

Documentation is a cornerstone of Cypress, the commands in this repository will try to keep these documentation standards.

\* These commands won't make your life better if you don't already know the powers and limitations of the default commands. It would only add clutter and you'll probably not be able to differentiate between all the options.

## Installation

Install the module.

```shell
npm install cypress-commands
```

Add the following line to `cypress/support/index.js`.

```javascript
require('cypress-commands');
```

## Extended commands

These commands have been extended to be able to more than originally intended. For these commands, all tests that exist in the Cypress repository are copied into this repository to make sure the default behaviour stays identical unless we want it changed.

* [`.then()`](./docs/then.md)

## Added commands

These commands do not exist in Cypress by default.

* None yet, though there are some coming.

## Contributing

Contributors are always welcome! I really don't care if you are a beginner or an expert, all help is welcome.

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
