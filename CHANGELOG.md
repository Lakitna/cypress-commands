# Changelog

All notable changes to this project will be documented in this file.

## 2.0.0 - 2021-09-13

### Breaking changes

#### Whitespace handling for zero-width whitespace in `.text()` and `.attribute()`

Whitespace handling in `.text()` and `.attribute()` has been changed to no longer consider
zero-width whitespace to be whitespace in modes `{whitespace: 'simplify'}` and
`{whitespace: 'keep-newline'}`. Mode `{whitespace: 'keep'}` has not changed.

<!-- prettier-ignore -->
```html
<div>super\u200Bcalifragilistic\u200Bexpialidocious</div>
```

```javascript
// Old situation
cy.get('div').text().should('equal', 'super califragilistic expialidocious');
```

```javascript
// New situation
cy.get('div').text().should('equal', 'supercalifragilisticexpialidocious');
```

When using `.text()` on elements containing the `<wbr>` tag: `<wbr>` is now considered a zero-width
space and will thus be removed with whitespace `simplify` and `keep-newline` as described above.

<!-- prettier-ignore -->
```html
<div>super<wbr>califragilistic<wbr>expialidocious</div>
```

```javascript
// Old situation
cy.get('div').text().should('equal', 'super califragilistic expialidocious');
```

```javascript
// New situation
cy.get('div').text().should('equal', 'supercalifragilisticexpialidocious');
```

#### Output order of `.text()`

When using `.text({ depth: Number })` the order of texts has been changed to better reflect what the
user sees. It will now first traverse all the way to the deepest point, before going sideways. This
will make `.text()` behave much better with inline styling and links.

<!-- prettier-ignore -->
```html
<div class="parent">
    parent div top
    <div>
        child div
    </div>
    parent div middle
    <div>
        second-child div
    </div>
    parent div bottom
</div>
```

```javascript
// Old situation
// Note how the first part of the string is the various parts of `div.parent`
cy.get('parent')
  .text({ depth: 1 })
  .should('equal', 'parent div top parent div middle parent div bottom child div second-child div');
```

```javascript
// New situation
cy.get('div')
  .text({ depth: 1 })
  .should('equal', 'parent div top child div parent div middle second-child div parent div bottom');
```

Inline text formatting:

<!-- prettier-ignore -->
```html
<div>
    Text with <b>some</b> styling and <a href="...">a link</a>.
</div>
```

```javascript
// Old situation
cy.get('div').text({ depth: 1 }).should('equal', 'Text with styling and . some a link');
```

```javascript
// New situation
cy.get('div').text({ depth: 1 }).should('equal', 'Text with some styling and a link.');
```

#### Stricter types

Types have been made stricter for `.attribute()`, `text()`, and `.to()`. This is a great improvement
for TypeScript users as it reduces any manual casting. It allows for things like:

```typescript
cy.get('div')
  .text() // yields type 'string | string[]'
  .to('array') // yields type 'string[]'
  .then((texts: string[]) => ...);
```

```typescript
cy.get('div')
  .attribute('class') // yields type 'string | string[]'
  .to('array') // yields type 'string[]'
  .then((texts: string[]) => ...);
```

### Fixes

- Support for Cypress 8.3.0 and above. There was a change in an internal API used for the
  `.attribute()` command. This internal API allows us to do some complex stuff with
  `{strict: true}`. The fix does not impact versions <= 8.2.0. See #60 for details.

- `.attribute()` would not work properly in situations where it finds one attribute with a string
  length longer than the number of elements. For example:

  <!-- prettier-ignore -->
  ```html
  <div data-foo="hello"></div>
  <div></div>
  <div></div>
  ```

  ```javascript
  cy.get('div').attribute('data-foo'); // Throws error because `hello`.length > $elements.length
  ```

  This change also prompted some refactoring.

- Updated docs based on changed made upstream in the Cypress docs.

- Added config for Prettier/editorconfig and Eslint rules to match them. Reformatted a lot of files
  because of this.

- Moved CI from Travis to Github. Now tests on multiple versions of NodeJS and multiple versions of
  Cypress.

- Updated a lot of dependencies. It was over due.

- Switched use of `path` to `path-browserify` to reduce config overhead for TypeScript users.
