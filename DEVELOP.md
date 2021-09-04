# How to develop

## Node version

Anything above Node 8

## Running tests

There are many ways to run tests. Here is a list

| Command                        | Headless           | Starts server      | Code under test     |
| ------------------------------ | ------------------ | ------------------ | ------------------- |
| `npm test`                     | :heavy_check_mark: | :heavy_check_mark: | Source files        |
| `npm run test:source`          | :heavy_check_mark: | :heavy_check_mark: | Source files        |
| `npm run test:bundle`          | :heavy_check_mark: | :heavy_check_mark: | Distribution bundle |
| `npm run run:cypress`          | :heavy_check_mark: | :x:                | Source files        |
| `npm run run:cypress:source`   | :heavy_check_mark: | :x:                | Source files        |
| `npm run run:cypress:bundle`   | :heavy_check_mark: | :x:                | Distribution bundle |
| `npm start`                    | :x:                | :heavy_check_mark: | Source files        |
| `npm run start:source`         | :x:                | :heavy_check_mark: | Source files        |
| `npm run start:bundle`         | :x:                | :heavy_check_mark: | Distribution bundle |
| `npm run start:cypress`        | :x:                | :x:                | Source files        |
| `npm run start:cypress:source` | :x:                | :x:                | Source files        |
| `npm run start:cypress:bundle` | :x:                | :x:                | Distribution bundle |

For commands that don't start their own server you'll need to run `npm run start:server` in a second
command line.

## Publishing

`npm publish` will run tests that have to pass before allowing you to publish.
