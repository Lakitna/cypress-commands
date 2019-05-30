# text

This is a command that does not exist as a default command.

----

Enables you to get the text contents of the subject yielded from the previous command.

`.text()` allows you to be more specific than you can be with `.contains()` or `.should('contain')`.

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
`whitespace` | `simplify` | Replace complex whitespace with a single regular space.<br> Accepted values: `simplify`, `keep-newline` & `keep`
`depth` | `0` | Include the text contents of child elements upto `n` levels

## Yields

* `.text()` yields the text inside the subject.
* `.text()` yields an array of the texts inside multiple subjects.

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

The default value of `whitespace` is `simplify` so the following yields the same.

```javascript
// yields "Extravagant Eagle"
cy.get('div').text({ whitespace: 'simplify' });
```

#### Simplify whitespace but keep new line characters

```javascript
// yields "Extravagant\nEagle"
cy.get('div').text({ whitespace: 'keep-newline' });
```

#### Do not simplify whitespace

```javascript
// yields "Extravagant \xa0\n  Eagle"
cy.get('div').text({ whitespace: 'keep' });
```

### Depth of elements

By default only the text of the subject itself will be yielded. Use this option to also get the text of underlying elements.

```html
<div class="grandparent">
  Grandma Gazelle
  <div class="parent">
    Mother Meerkat
    <div class="child">
      Son Scorpion
    </div>
  </div>
  <div class="parent">
    Father Fox
  </div>
</div>
```

#### Only the subject by default

```javascript
// yields "Grandma Gazelle"
cy.get('.grandparent')
  .text();
```

The default value of `depth` is `0` so the following yields the same.

```javascript
// yields "Grandma Gazelle"
cy.get('.grandparent')
  .text({ depth: 0 });
```

#### Include the direct children

The text of the child elements are concatenated and yielded as a single string with a space as delimiter.

```javascript
// yields "Grandma Gazelle Mother Meerkat Father Fox"
cy.get('.grandparent')
  .text({ depth: 1 });
```

#### Multiple elements with depth

Selecting multiple elements will yield an array of concatenated strings.

```javascript
// yields [
//   "Mother Meerkat Son Scorpion",
//   "Father Fox"
// ]
cy.get('.parent')
  .text({ depth: 1 });
```

#### Remove all depth limitations

To infinity and beyond!

```javascript
// yields "Grandma Gazelle Mother Meerkat Father Fox Son Scorpion"
cy.get('.grandparent')
  .text({ depth: Infinity });
```

## Notes

### Form elements

`.text()` also gets text from form elements like `input` and `textarea`.

```javascript
cy.get('input')
  .text();
```

## Rules

### Requirements

* `.text()` requires being chained off a command that yields DOM element(s).

### Assertions

* `.text()` will automatically retry itself until assertions you've chained all pass.

### Timeouts

* `.text()` can time out waiting for a chained assertion to pass.

## Command Log

`.text()` will output to the command log.

## See also

* [`.contains()`](https://docs.cypress.io/api/commands/contains.html)
