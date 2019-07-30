# to

This is a command that does not exist as a default command.

----

Cast the subject to another type. Will do nothing if the subject is already of that type.

> **Note:** When using `.to()` you should be aware about how Cypress [only retries the last command](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried).

## Syntax

```javascript
.to(type)
.to(type, options)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.wrap('00123').to('number'); // Yields 123
cy.wrap(42).to('string'); // Yields '42'
cy.wrap({ passive: 'Parakeet' }).to('string'); // Yields '{"passive":"Parakeet"}'
cy.wrap('Underwhelming Uakari').to('array'); // Yields ['Underwhelming Uakari']
```

### :x: Incorrect Usage

```javascript
cy.to('string'); // Errors, cannot be chained off 'cy'
```

## Arguments

**> type** ***(string)***

The type you want to cast the subject to. Must be one of `number`, `string` or `array`.

**> options** ***(Object)***

Pass in an options object to change the default behavior of `.to()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.to()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)
`log` | `false` | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)

## Yields

* `.to('array')` yields an array
* `.to('string')` yields a string or array of strings
* `.to('number')` yields a number or array of numbers

## Examples

### Casting a string to a number

```javascript
// yields 42
cy.wrap('042').to('string');
```

### Casting a sring to an array

```javascript
// yields ['042']
cy.wrap('042').to('array');
```

### Casting an object to a string

This uses `JSON.stringify`.

```javascript
// yields '{"foo":"bar"}'
cy.wrap({ foo: 'bar' }).to('string');
```

### Casting an array of numbers to an array of strings

```javascript
// yields [ '123', '456', '789' ]
cy.wrap([ 123, 456, 789 ]).to('string');
```

### Casting an array to an array

When trying to cast to the type of the subject `.to()` will do nothing.

```javascript
// yields [ 'foo' ]
cy.wrap([ 'foo' ]).to('array');
```

## Notes

### Ensuring iterability

Some commands, like `.text()`, yield a string when there is only a single subject, but an array when there are multiple subjects. Use `.to('array')` to ensure you can loop over the results of `.text()` without the risk of an error.

```javascript
cy.get('.maybeOneElement')
    .text()
    .to('array')
    .each((text) => {
        // ...
    });
```

## Rules

### Requirements

* `.to()` requires being chained off a previous command.

### Assertions

* `.to()` will automatically retry itself until the subject can be casted.
* `.to()` will automatically retry itself until assertions you've chained all pass.

### Timeouts

* `.to()` can time out waiting for a chained assertion to pass.

## Command Log

`.to()` will output to the command log.
