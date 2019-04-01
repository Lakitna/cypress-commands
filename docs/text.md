# then

This is a command that does not exist as a default command.

----

Enables you to get the text contents of the subject yielded from the previous command.

> **Note:** When using `.text()` you should be aware about how Cypress [only retries the last command](https://docs.cypress.io/guides/core-concepts/retry-ability.html#Only-the-last-command-is-retried).

## Syntax

```javascript
.text()
.text(options)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.get('nav').text()  // Yields the text inside `nav`
```

### :x: Incorrect Usage

```javascript
cy.text()  // Errors, cannot be chained off 'cy'
cy.location().text()  // Errors, 'location' does not yield DOM element
```

## Arguments

**> options** ***(Object)***

Pass in an options object to change the default behavior of `.text()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.text()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)
`log` | `false` | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)
`whitespace` | `normalize` | Replace complex whitespace with a single regular space.<br> Accepted values: `normalize`, `keep-newline` & `keep`
`depth` | `0` | Include the text contents of child elements upto `n` levels

## Yields

* `.text()` yields the text inside the subject.

## Examples

### No Args

#### Get the text of a div

```html
<div>Teriffic Tiger</div>
```

```javascript
// yields "Teriffic Tiger"
cy.get('div').text();
```

#### Get the text of multiple divs

```html
<div>Catastrophic Cat</div>
<div>Dramatic Dog</div>
<div>Amazing Ant</div>
```

```javascript
// yields [
//   "Catastrophic Cat",
//   "Dramatic Dog",
//   "Amazing Ant"
// ]
cy.get('div').text();
```

### Whitespace handling

By default all whitespace will be simplified.

```html
<div> Extravagant &nbsp;
  Eagle            </div>
```

#### Simplify whitespace by default

```javascript
// yields "Extravagant Eagle"
cy.get('div').text();
```

The default value of `whitespace` is `normalize` so the following yields the same.

```javascript
// yields "Extravagant Eagle"
cy.get('div').text({ whitespace: 'normalize' });
```

#### Simplify whitespace but keep new line characters

```javascript
// yields "Extravagant\nEagle"
cy.get('div').text({ whitespace: 'keep-newline' });
```

#### Do not simplify whitespace

```javascript
// TODO: Check yielded value
// yields "Extravagant \xa0 \n Eagle"
cy.get('div').text({ whitespace: 'keep' });
```

### Depth of elements

By default only the text of the subject itself will be yielded. Use this option to also get the text of underlying elements.

```html
<div class="grandmother">
  Grandma Gazelle
  <div>
    Mother Meerkat
      <div>
        Son Scorpion
      </div>
  </div>
  <div>
    Father Fox
  </div>
</div>
```

#### Only the subject by default

```javascript
// yields "Grandma Gazelle"
cy.get('.grandmother').text()
```

The default value of `depth` is `0` so the following yields the same.

```javascript
// yields "Grandma Gazelle"
cy.get('.grandmother').text({ depth: 0 });
```

#### Include the direct children

```javascript
// yields "Grandma Gazelle Mother Meerkat Father Fox"
cy.get('.grandmother').text({ depth: 1 });
```

#### Remove all depth limitations

To infinity and beyond!

```javascript
// TODO: Check order of yield
// yields "Grandma Gazelle Mother Meerkat Father Fox Son Scorpion"
cy.get('.grandmother').text({ depth: Infinity });
```


<!-- TODO from this point -->

## Notes

### Differences

What’s the difference between `.then()` and `.should()`/`.and()`?

Using `.then()` simply allows you to use the yielded subject in a callback function and should be used when you need to manipulate some values or do some actions.

When using a callback function with `.should()`, `.and()` or `.then({ retry: true })`, on the other hand, there is special logic to rerun the callback function until no assertions throw within it. You should be careful of side affects in a `.should()` or `.and()` callback function that you would not want performed multiple times.

## Rules

### Requirements

- `.then()` requires being chained off a previous command.

### Assertions

- `.then()` will only run assertions you've chained once, and will not retry (unless you use the `retry` option).

### Timeouts

- `.then()` can time out waiting for a promise you've returned to resolve.
- `.then()` can time out waiting for a chained assertion to pass. (when using the `retry` option)

## Command Log

- `.then()` only logs in the Command Log if
  - the option `log` is set to `true`
  - the option `retry` is set to `true` and the option `log` is not set

## See also

- [`.and()`](https://docs.cypress.io/api/commands/and.html)
- [`.each()`](https://docs.cypress.io/api/commands/each.html)
- [`.invoke()`](https://docs.cypress.io/api/commands/invoke.html)
- [`.its()`](https://docs.cypress.io/api/commands/its.html)
- [`.should()`](https://docs.cypress.io/api/commands/should.html)
- [`.spread()`](https://docs.cypress.io/api/commands/spread.html)
- [Guide: Using Closures to compare values](https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html#Closures)
- [Guide: Chains of Commands](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Chains-of-Commands)
