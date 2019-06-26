# toArray

This is a command that does not exist as a default command.

----

Wrap the subject in an Array. Will do nothing if the subject is array-like.

> **Note:** When using `.toArray()` you should be aware about how Cypress [only retries the last command](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried).

## Syntax

```javascript
.toArray()
.toArray(options)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.wrap('Electric Elk').toArray(); // Yields ['Electric Elk']
cy.wrap(42).toArray(); // Yields [40]
```

### :x: Incorrect Usage

```javascript
cy.toArray('foo')  // Errors, cannot be chained off 'cy'
```

## Arguments

**> options** ***(Object)***

Pass in an options object to change the default behavior of `.toArray()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.toArray()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)
`log` | `false` | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)

## Yields

* `.toArray()` yields an array with any contents
* `.toArray()` yields an iterable with any contents

## Examples

### String to array

```javascript
// yields ['Leaping Lizard']
cy.wrap('Leaping Lizard').toArray();
```

### Number to array

```javascript
// yields [42]
cy.wrap(42).toArray();
```

### Object to array

```javascript
// yields [{ purple: 'possums' }]
cy.wrap({ purple: 'possums' }).toArray();
```

### Array to array

When the input is already an array the subject is yielded unchanged.

```javascript
// yields [1, 2, 3]
cy.wrap([1, 2, 3]).toArray();
```

### DOM element to array

DOM elements are already iterable, the subject is yielded unchanged.

```html
<div>Heroic Haddock</div>
```

```javascript
// yields the unchanged div element
cy.get('div').toArray();
```

## Notes

### Ensuring iterability

Some commands, like `.text()`, yield a string when there is only a single subject, but an array when there are multiple subjects. Use `.toArray()` to ensure you can loop over the results of `.text()` without the risk of an error.

```javascript
cy.get('.maybeOneElement')
    .text()
    .toArray()
    .each((text) => {
        // ...
    });
```

## Rules

### Requirements

* `.toArray()` requires being chained off a previous command.

### Assertions

* `.toArray()` will automatically retry itself until assertions you've chained all pass.

### Timeouts

* `.toArray()` can time out waiting for a chained assertion to pass.

## Command Log

`.toArray()` will output to the command log.
