# then

This command has been extended with:

- The option `retry` which allows you to retry the function passed to `.then()` untill all
  assertions pass.
- The option `log` which allows you to output `.then()` to the command log.

See [original documentation](https://docs.cypress.io/api/commands/then)

---

Enables you to work with the subject yielded from the previous command.

> **Note:** `.then()` assumes you are already familiar with core concepts such as
> [closures](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures).

> **Note:** Prefer
> ['`.should()` with callback](https://docs.cypress.io/api/commands/should#Function) over `.then()`
> for assertions as they are automatically rerun until no assertions throw within it but be aware of
> [differences](https://docs.cypress.io/api/commands/should#Differences).

## Syntax

```javascript
.then(callbackFn)
.then(options, callbackFn)
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.get('.nav').then(($nav) => {}); // Yields .nav as first arg
cy.location().then((loc) => {}); // Yields location object as first arg
```

## Arguments

**> options** **_(Object)_**

Pass in an options object to change the default behavior of `.then()`.

| Option    | Default                                                                                          | Description                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `timeout` | [`defaultCommandTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `.then()` to resolve before [timing out](https://docs.cypress.io/api/commands/then.html#Timeouts)   |
| `retry`   | `false`                                                                                          | Retry itself until chained assertions pass                                                                           |
| `log`     | `false`                                                                                          | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log) |

**> callbackFn** **_(Function)_**

Pass a function that takes the previously yielded subject as its first argument.

## Yields

`.then()` is modeled identically to the way Promises work in JavaScript. Whatever is returned from
the callback function becomes the new subject and will flow into the next command (with the
exception of `undefined`).

Additionally, the result of the last Cypress command in the callback function will be yielded as the
new subject and flow into the next command if there is no `return`.

When `undefined` is returned by the callback function, the subject will not be modified and will
instead carry over to the next command.

Just like Promises, you can return any compatible "thenable" (anything that has a `.then()`
interface) and Cypress will wait for that to resolve before continuing forward through the chain of
commands.

## Examples

> We have several more examples in our
> [Core Concepts Guide](https://docs.cypress.io/guides/core-concepts/variables-and-aliases) which go
> into the various ways you can use `.then()` to store, compare, and debug values.

### DOM element

#### The `button` element is yielded

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.attr('class');

  cy.wrap($btn).click().should('not.have.class', cls);
});
```

#### The number is yielded from previous command

```javascript
cy.wrap(1)
  .then((num) => {
    cy.wrap(num).should('equal', 1); // true
  })
  .should('equal', 1); // true
```

### Change subject

#### The el subject is changed with another command

```javascript
cy.get('button')
  .then(($btn) => {
    const cls = $btn.attr('class');

    cy.wrap($btn).click().should('not.have.class', cls).find('i');
    // since there is no explicit return
    // the last Cypress command's yield is yielded
  })
  .should('have.class', 'spin'); // assert on i element
```

#### The number subject is changed with another command

```javascript
cy.wrap(1).then((num) => {
  cy.wrap(num)).should('equal', 1) // true
  cy.wrap(2)
}).should('equal', 2) // true
```

#### The number subject is changed by returning

```javascript
cy.wrap(1)
  .then((num) => {
    cy.wrap(num).should('equal', 1); // true

    return 2;
  })
  .should('equal', 2); // true
```

#### Returning `undefined` will not modify the yielded subject

```javascript
cy.get('form')
  .then(($form) => {
    console.log('form is:', $form);
    // undefined is returned here, but $form will be
    // yielded to allow for continued chaining
  })
  .find('input')
  .then(($input) => {
    // we have our $input element here since
    // our form element was yielded and we called
    // .find('input') on it
  });
```

### Raw HTMLElements are wrapped with jQuery

```javascript
cy.get('div')
  .then(($div) => {
    return $div[0]; // type => HTMLDivElement
  })
  .then(($div) => {
    $div; // type => JQuery<HTMLDivElement>
  });
```

### Promises

Cypress waits for Promises to resolve before continuing

#### Example using Q

```javascript
cy.get('button')
  .click()
  .then(($button) => {
    const p = Q.defer();

    setTimeout(() => {
      p.resolve();
    }, 1000);

    return p.promise;
  });
```

#### Example using bluebird

```javascript
cy.get('button')
  .click()
  .then(($button) => {
    return Promise.delay(1000);
  });
```

#### Example using jQuery deferred's

```javascript
cy.get('button')
  .click()
  .then(($button) => {
    const df = $.Deferred();

    setTimeout(() => {
      df.resolve();
    }, 1000);

    return df;
  });
```

### Retryability

The default Cypress command has been extended to allow you to retry a function until chained
assertions pass. Use this sparsely. If you find yourself using this all the time you are probably
doing it wrong. In most cases there are more suitable commands to get what you need.

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

#### What’s the difference between `.then()` and `.should()`/`.and()`?

Using `.then()` allows you to use the yielded subject in a callback function and should be used when
you need to manipulate some values or do some actions.

When using a callback function with `.should()`, `.and()` or `.then({ retry: true })`, on the other
hand, there is special logic to rerun the callback function until no assertions throw within it. You
should be careful of side affects in a `.should()`, `.and()`, or `.then({ retry: true })` callback
function that you would not want performed multiple times.

## Rules

### Requirements

- `.then()` requires being chained off a previous command.

### Assertions

- `.then()` will only run assertions you've chained once, and will not
  [retry](https://docs.cypress.io/guides/core-concepts/retry-ability) (unless you use the
  `retry: true` option).

### Timeouts

- `.then()` can time out waiting for a promise you've returned to resolve.
- `.then()` can time out waiting for a chained assertion to pass. (when using the `retry: true`
  option)

## Command Log

- `.then()` only logs in the Command Log in the following situations:
  - the option `log` is set to `true`
  - the option `retry` is set to `true` and the option `log` is not set

## History

| Version | Changes                 |
| ------- | ----------------------- |
| 0.14.0  | Added timeout option    |
| < 0.3.3 | `.then()` command added |

## See also

- [`.and()`](https://docs.cypress.io/api/commands/and)
- [`.each()`](https://docs.cypress.io/api/commands/each)
- [`.invoke()`](https://docs.cypress.io/api/commands/invoke)
- [`.its()`](https://docs.cypress.io/api/commands/its)
- [`.should()`](https://docs.cypress.io/api/commands/should)
- [`.spread()`](https://docs.cypress.io/api/commands/spread)
- [Guide: Using Closures to compare values](https://docs.cypress.io/guides/core-concepts/variables-and-aliases#Closures)
- [Guide: Chains of Commands](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)
