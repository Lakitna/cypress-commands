# then

This command has been extended with

- The option `retry`
- The option `log`

See [original documentation](https://docs.cypress.io/api/commands/then.html)

----

Enables you to work with the subject yielded from the previous command.

> **Note:** `.then()` assumes you are already familiar with core concepts such as [closures](https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html#Closures).

> **Note:** Prefer ['`.should()` with callback](https://docs.cypress.io/api/commands/should.html#Function) over `.then()` for assertions as they are automatically rerun until no assertions throw within it but be aware of [differences](https://docs.cypress.io/api/commands/should.html#Differences).

## Syntax

```javascript
.then(callbackFn)
.then(options, callbackFn)
```

## Usage

### :white_check_mark: Correct Usage

```javascript
cy.get('.nav').then(($nav) => {})  // Yields .nav as first arg
cy.location().then((loc) => {})   // Yields location object as first arg
```

## Arguments

**> options** ***(Object)***

Pass in an options object to change the default behavior of `.then()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.then()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)
`retry` | `false` | Retry itself until assertions you've chained all pass
`log` | `false` | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)

**> callbackFn** ***(Function)***

Pass a function that takes the previously yielded subject as its first argument.

## Yields

`.then()` is modeled identically to the way Promises work in JavaScript. Whatever is returned from the callback function becomes the new subject and will flow into the next command (with the exception of `undefined`).

When `undefined` is returned by the callback function, the subject will not be modified and will instead carry over to the next command.

Just like Promises, you can return any compatible "thenable" (anything that has a `.then()` interface) and Cypress will wait for that to resolve before continuing forward through the chain of commands.

## Examples

> We have several more examples in our [Core Concepts Guide](https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html) which go into the various ways you can use `.then()` to store, compare, and debug values.

### DOM element

#### The element `button` is yielded

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.class()

  cy.wrap($btn).click().should('not.have.class', cls)
})
```

### Change subject

#### The subject is changed by returning

```javascript
cy.wrap(null).then(() => {
  return { id: 123 }
})
.then((obj) => {
  // subject is now the obj {id: 123}
  expect(obj.id).to.eq(123) // true
})
```

#### Returning `null` or `undefined` will not modify the yielded subject

```javascript
cy.get('form')
.then(($form) => {
  console.log('form is:', $form)
  // undefined is returned here, but $form will be
  // yielded to allow for continued chaining
})
.find('input').then(($input) => {
  // we have our $input element here since
  // our form element was yielded and we called
  // .find('input') on it
})
```

### Promises

Cypress waits for Promises to resolve before continuing

#### Example using Q

```javascript
cy.get('button').click().then(($button) => {
  const p = Q.defer()

  setTimeout(() => {
    p.resolve()
  }, 1000)

  return p.promise
})
```

#### Example using bluebird

```javascript
cy.get('button').click().then(($button) => {
  return Promise.delay(1000)
})
```

#### Example using jQuery deferred's

```javascript
cy.get('button').click().then(($button) => {
  const df = $.Deferred()

  setTimeout(() => {
    df.resolve()
  }, 1000)

  return df
})
```

### Retryability

The default Cypress command has been extended to allow you to retry a function until chained assertions pass. Use this sparsely. If you find yourself using this all the time you are probably doing it wrong. In most cases there are more suitable commands to get what you need.

```javascript
cy.get('form')
.then({ retry: true }, ($form) => {
  // We have acces to the jQuery object describing the form
  // here. We can now do some operations on it without using
  // Cypress commands, while we maintain retryability.

  // Note that this function might be executed multiple
  // times. Keep it light and make sure you know what
  // you're doing.

  return 'foo';
})
.should('equal', 'foo');
```

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
