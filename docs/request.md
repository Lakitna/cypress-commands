# request

This command has been extended with

- `.request()` listens to the global configuration `requestBaseUrl`. [See arguments](#arguments)

See [original documentation](https://docs.cypress.io/api/commands/request.html)

---

Make an HTTP request.

## Syntax

```javascript
cy.request(url);
cy.request(url, body);
cy.request(method, url);
cy.request(method, url, body);
cy.request(options);
```

## Usage

### :heavy_check_mark: Correct Usage

```javascript
cy.request('http://dev.local/seed');
```

## Arguments

**> url** **_(string)_**

The `url` to make the request to.

If you provide a non fully qualified domain name (FQDN), Cypress will make its best guess as to
which host you want `cy.request()` to use in the url.

1. If you make a `cy.request()` after visiting a page, Cypress assumes the url used for the
   `cy.visit()` is the host.

```javascript
cy.visit('http://localhost:8080/app');
cy.request('users/1.json'); //  url is  http://localhost:8080/users/1.json
```

2. If you make a `cy.request()` prior to visiting a page, Cypress uses the host configured as the
   `requestBaseUrl` property inside of `cypress.json`.

```javascript
// cypress.json

{
"requestBaseUrl": "http://localhost:1234"
}
cy.request('seed/admin') // url is http://localhost:1234/seed/admin
```

If the `requestBaseUrl` is empty Cypress will use `baseUrl` instead.

```javascript
// cypress.json

{
"requestBaseUrl": ""
"baseUrl": "http://localhost:1234"
}
cy.request('seed/admin') // url is http://localhost:1234/seed/admin
```

3. If Cypress cannot determine the host it will throw an error.

**> body** **_(String, Object)_**

A request `body` to be sent in the request. Cypress sets the `Accepts` request header and serializes
the response body by its `Content-Type`.

**> method** **_(String)_**

Make a request using a specific method. If no method is defined, Cypress uses the `GET` method by
default.

Supported methods include:

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`
- `HEAD`
- `OPTIONS`
- `TRACE`
- `COPY`
- `LOCK`
- `MKCOL`
- `MOVE`
- `PURGE`
- `PROPFIND`
- `PROPPATCH`
- `UNLOCK`
- `REPORT`
- `MKACTIVITY`
- `CHECKOUT`
- `MERGE`
- `M-SEARCH`
- `NOTIFY`
- `SUBSCRIBE`
- `UNSUBSCRIBE`
- `SEARCH`
- `CONNECT`

**> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.request`.

| Option             | Default                                                                                    | Description                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `log`              | `true`                                                                                     | Displays the command in the [Command log](https://docs.cypress.io/guides/core-concepts/test-runner.html#Command-Log)       |
| `url`              | `null`                                                                                     | The URL to make the request to                                                                                             |
| `method`           | `GET`                                                                                      | The HTTP method to use in the request                                                                                      |
| `auth`             | `null`                                                                                     | Adds Authorization headers. ['Accepts these options.'](https://github.com/request/request#http-authentication)             |
| `body`             | `null`                                                                                     | Body to send along with the request                                                                                        |
| `failOnStatusCode` | `true`                                                                                     | Whether to fail on response codes other than `2xx` and `3xx`                                                               |
| `followRedirect`   | `true`                                                                                     | Whether to automatically follow redirects                                                                                  |
| `form`             | `false`                                                                                    | Whether to convert the `body` values to url encoded content and set the `x-www-form-urlencoded` header                     |
| `gzip`             | `true`                                                                                     | Whether to accept the `gzip` encoding                                                                                      |
| `headers`          | `null`                                                                                     | Additional headers to send; Accepts object literal                                                                         |
| `qs`               | `null`                                                                                     | Query parameters to append to the `url` of the request                                                                     |
| `timeout`          | [`responseTimeout`](https://docs.cypress.io/guides/references/configuration.html#Timeouts) | Time to wait for `cy.request()` to resolve before [timing out](https://docs.cypress.io/api/commands/request.html#Timeouts) |

You can also set options for `cy.request`'s `requestBaseUrl`, `baseUrl` and `responseTimeout`
globally in [configuration](https://docs.cypress.io/guides/references/configuration.html).

## Yields

`cy.request()` yields the `response` as an object literal containing properties such as:

- `status`
- `body`
- `headers`
- `duration`

## Examples

### URL

#### Make a `GET` request

`cy.request()` is great for talking to an external endpoint before your tests to seed a database.

```javascript
beforeEach(function () {
  cy.request('http://localhost:8080/db/seed');
});
```

#### Issue a simple HTTP request

Sometimes it's quicker to simply test the contents of a page rather than
[`cy.visit()`](https://docs.cypress.io/api/commands/visit.html) and wait for the entire page and all
of its resources to load.

```javascript
cy.request('/admin').its('body').should('include', '<h1>Admin</h1>');
```

### Method and URL

#### Send a `DELETE` request

```javascript
cy.request('DELETE', 'http://localhost:8888/users/827');
```

### Method, URL, and Body

#### Send a `POST` request with a JSON body

```javascript
cy.request('POST', 'http://localhost:8888/users/admin', { name: 'Jane' }).then((response) => {
  // response.body is automatically serialized into JSON
  expect(response.body).to.have.property('name', 'Jane'); // true
});
```

### Options

#### Request a page while disabling auto redirect

To test the redirection behavior of a login without a session, `cy.request` can be used to check the
`status` and `redirectedToUrl` property.

The `redirectedToUrl` property is a special Cypress property that normalizes the `url` the browser
would normally follow during a redirect.

```javascript
cy.request({
  url: '/dashboard',
  followRedirect: false, // turn off following redirects
}).then((resp) => {
  // redirect status code is 302
  expect(resp.status).to.eq(302);
  expect(resp.redirectedToUrl).to.eq('http://localhost:8082/unauthorized');
});
```

#### HTML form submissions using form option

Oftentimes, once you have a proper e2e test around logging in, there's no reason to continue to
`cy.visit()` the login and wait for the entire page to load all associated resources before running
any other commands. Doing so can slow down our entire test suite.

Using `cy.request()`, we can bypass all of this because it automatically gets and sets cookies just
as if the requests had come from the browser.

```javascript
cy.request({
  method: 'POST',
  url: '/login_with_form', // baseUrl is prepended to url
  form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
  body: {
    username: 'jane.lane',
    password: 'password123',
  },
});

// just to prove we have a session
cy.getCookie('cypress-session-cookie').should('exist');
```

#### Using cy.request for HTML Forms

> [Check out our example recipe using `cy.request()` for HTML form submissions](https://docs.cypress.io/examples/examples/recipes.html#HTML-Web-Forms)

### Request Polling

#### Call `cy.request()` over and over again:

This is useful when you're polling a server for a response that may take awhile to complete.

All we're really doing here is creating a recursive function. Nothing more complicated than that.

```js
// just a regular ol' function folks
function req () {
  cy
    .request(...)
    .then((resp) => {
      // if we got what we wanted

      if (resp.status === 200 && resp.body.ok === true)
        // break out of the recursive loop
        return

      // else recurse
      req()
    })
}

cy
  // do the thing causing the side effect
  .get('button').click()

  // now start the requests
  .then(req)

```

## Notes

### Debugging

#### Request is not displayed in the Network Tab of Developer Tools

Cypress does not _actually_ make an XHR request from the browser. We are actually making the HTTP
request from the Cypress Test Runner (in Node.js). So, you won't see the request inside of your
Developer Tools.

### Cors

#### CORS is bypassed

Normally when the browser detects a cross-origin HTTP request, it will send an `OPTIONS` preflight
check to ensure the server allows cross-origin requests, but `cy.request()` bypasses CORS entirely.

```javascript
// we can make requests to any external server, no problem.
cy.request('https://www.google.com/webhp?#q=cypress.io+cors')
  .its('body')
  .should('include', 'Testing, the way it should be'); // true
```

### Cookies

#### Cookies are automatically sent and received

Before sending the HTTP request, we automatically attach cookies that would have otherwise been
attached had the request come from the browser. Additionally, if a response has a `Set-Cookie`
header, these are automatically set back on the browser cookies.

In other words, `cy.request()` transparently performs all of the underlying functions as if it came
from the browser.

### `cy.request()` cannot be used to debug `cy.server()` and `cy.route()`

#### `cy.request()` sends requests to actual endpoints, bypassing those defined using `cy.route()`

The intention of `cy.request()` is to be used for checking endpoints on an actual, running server
without having to start the front end application.

## Rules

### Requirements

- `cy.request()` requires being chained off of `cy`.
- `cy.request()` requires that the server send a response.
- `cy.request()` requires that the response status code be `2xx` or `3xx` when `failOnStatusCode` is
  `true`.

### Assertions

- `cy.request()` will only run assertions you've chained once, and will not retry.

### Timeouts

- `cy.request()` can time out waiting for the server to respond.

## Command Log

### Request comments endpoint and test response

```javascript
cy.request('https://jsonplaceholder.typicode.com/comments').then((response) => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.length(500);
  expect(response).to.have.property('headers');
  expect(response).to.have.property('duration');
});
```

The commands above will display in the Command Log as:

![Command Log request](https://docs.cypress.io/img/api/request/testing-request-url-and-its-response-body-headers.12ea8bc4.png)

When clicking on `request` within the command log, the console outputs the following:

![Console log request](https://docs.cypress.io/img/api/request/console-log-request-response-body-headers-status-url.ec0e58df.png)

## History

| &nbsp; | &nbsp;                                                                                                                                                                                                                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.2.0  | Added support for any valid HTTP `method` argument including `TRACE`, `COPY`, `LOCK`, `MKCOL`, `MOVE`, `PURGE`, `PROPFIND`, `PROPPATCH`, `UNLOCK`, `REPORT`, `MKACTIVITY`, `CHECKOUT`, `MERGE`, `M-SEARCH`, `NOTIFY`, `SUBSCRIBE`, `UNSUBSCRIBE`, `SEARCH`, and `CONNECT`. |

## See also

- [`cy.exec()`](https://docs.cypress.io/api/commands/exec.html)
- [`cy.task()`](https://docs.cypress.io/api/commands/task.html)
- [`cy.visit()`](https://docs.cypress.io/api/commands/visit.html)
- [Recipe: Logging In - Single Sign on](https://docs.cypress.io/examples/examples/recipes.html#Single-Sign-On)
- [Recipe: Logging In - HTML Web Form](https://docs.cypress.io/examples/examples/recipes.html#HTML-Web-Forms)
- [Recipe: Logging In - XHR Web Form](https://docs.cypress.io/examples/examples/recipes.html#XHR-Web-Forms)
- [Recipe: Logging In - CSRF Tokens](https://docs.cypress.io/examples/examples/recipes.html#CSRF-Tokens)
