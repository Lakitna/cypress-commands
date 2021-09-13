# attribute

This is a command that does not exist as a default command.

---

Enables you to get the value of an elements attributes.

> **Note:** When using `.attribute()` you should be aware about how Cypress
> [only retries the last command](https://docs.cypress.io/guides/core-concepts/retry-ability#Only-the-last-command-is-retried).

## Syntax

```javascript
.attribute(attribute)
.attribute(attribute, options)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.get('a').attribute('href'); // Yields the value of the `href` attribute
```

### :x: Incorrect Usage

```javascript
cy.attribute('foo'); // Errors, cannot be chained off 'cy'
cy.location().attribute('foo'); // Errors, 'location' does not yield DOM element
```

## Arguments

**> attribute** **_(String)_**

The name of the attribute to be yielded by `.attribute()`

**> options** **_(Object)_**

Pass in an options object to change the default behavior of `.attribute()`.

| Option       | Default                                                                                          | Description                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `timeout`    | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.attribute()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts) |
| `log`        | `false`                                                                                          | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)    |
| `whitespace` | `keep`                                                                                           | Replace complex whitespace with a single regular space.<br> Accepted values: `simplify`, `keep-newline` & `keep`        |
| `strict`     | `true`                                                                                           | Implicitly assert that all subjects have the requested attribute                                                        |

## Yields

- `.attribute()` yields the value of a subjects given attribute.
- `.attribute()` yields an array of the values of multiple subjects given attribute.

## Examples

### An alt attribute

<!-- prettier-ignore -->
```html
<img src="./images/tiger.jpg" alt="Teriffic tiger">
```

```javascript
// yields "Teriffic Tiger"
cy.get('img').attribute('alt');
```

### Multiple subjects

<!-- prettier-ignore -->
```html
<input type="text">
<input type="submit">
```

```javascript
// yields [
//     "text",
//     "submit"
// ]
cy.get('input').attribute('type');
```

### Whitespace handling

By default all whitespace will be kept intact.

<!-- prettier-ignore -->
```html
<div
  data-attribute=" Extravagant &nbsp;
  Eagle            "
></div>
```

#### Simplify whitespace

```javascript
// yields "Extravagant Eagle"
cy.get('div').attribute('data-attribute', { whitespace: 'simplify' });
```

#### Simplify whitespace but keep new line characters

```javascript
// yields "Extravagant\nEagle"
cy.get('div').attribute('data-attribute', { whitespace: 'keep-newline' });
```

#### Do not simplify whitespace (default)

```javascript
// yields " Extravagant  \n  Eagle            "
cy.get('div').attribute('data-attribute');
```

The default value of `whitespace` is `keep` so the following yields the same.

```javascript
// yields " Extravagant  \n  Eagle            "
cy.get('div').attribute('data-attribute', { whitespace: 'keep' });
```

### Strict mode

Strict mode comes into play when using `.attribute()` with multiple subjects. By default strict mode
is enabled.

<!-- prettier-ignore -->
```html
<a href="#armadillo" target="_blank">Amazing armadillo</a>
<a href="#eel">Everlasting eel</a>
```

#### Strict mode `true`

Throws an error, because some subjects don't have the `target` attribute.

```javascript
// Throws error: Expected all 2 elements to have attribute 'target', but never found it on 1 elements.
cy.get('a').attribute('target');
```

Yields two values because both subjects have the `href` attribute.

```javascript
// yields [
//     "#armadillo",
//     "#eel"
// ]
cy.get('a').attribute('href');
```

#### Strict mode `false`

Does not throw an error because it's possible to yield a value, even though not all subjects have a
`target` attribute. Any subject that does not have the `target` attribute is ignored.

```javascript
// yields "_blank"
cy.get('a').attribute('target', { strict: false });
```

## Notes

### Empty attributes

`.attribute()` considers an empty attribute like below as existing, but empty.

<!-- prettier-ignore -->
```html
<p hidden>Catastrophic Cat</p>
```

```javascript
cy.get('p').attribute('hidden').should('exist').should('be.empty');
```

## Rules

### Requirements

- `.attribute()` requires being chained off a command that yields DOM element(s).

### Assertions

- `.attribute()` will automatically retry until the attribute exist on the subject(s).
- `.attribute()` will automatically retry itself until assertions you've chained all pass.

### Timeouts

- `.attribute()` can time out waiting for a chained assertion to pass.

## Command Log

`.attribute()` will output to the command log.
