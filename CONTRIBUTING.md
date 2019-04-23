# Contributing to Cypress-commands

Thank you for considering to contribute! :tada:

## Ways to contribute

As with any project, there are many ways to contribute.

Some of you reading this may be wondering if you have the skills to contribute. I think you do, so please give it a shot and don't hesitate to ask questions!

* Talk about Cypress-commands with your fellow Cypress users
* [Improve our documentation](#writing-documentation)
* [Report a bug](#reporting-bugs) by opening an issue
* [Request a feature](#requesting-features) by opening an issue
* [Write code](#writing-code) for one of the commands

## Openings an issue

Before you open an issue please make sure there is not already an existing issue for the problem you're facing.

### Reporting bugs

When you find something wrong with any of the code in this repository, please file an issue using the Bug report template.

Please follow the template as closely as you can, it will help anyone looking into the issue to find the underlying problem a lot quicker.

### Requesting features

If you missing a command or you want to extend an existing command, please file an issue using the Feature request template.

The template for feature requests is set up to provide answers to the questions what? why? and how? Please provide an explanation for all three to promote constructive discussion and make implementation easier.

### Requesting documentation changes

If you think the documentation is not as good as it could be, please file an issue using the Documentation template.

It would also be appreciated very much if you write the changes you would like to see. For details see [Writing documentation](#writing-documentation) and [Creating a pull request](#creating-a-pull-request).

## Writing documentation

Aside from documentation like this document there are some specific forms to describe the commands themselves.

*Note* A command will not be added without being referenced in `README.md`.

### Command documentation

Every command has its own documentation file that lives in `./docs/{command}.md`. The structure of these documents borrow heavily from the Cypress documentation, the biggest difference being that our documentation is written in pure [Github Flavoured Markdown](https://guides.github.com/features/mastering-markdown/).

*Note* A command will not be added to the package without documention.

#### Type definitions

You can describe the method signature for your custom command, allowing IntelliSense to show helpful documentation. Type definitions live in `./types`.

If Typescript scares you, then please ask for help when writing type definitions.

*Note* A command will not be added to the package without type definitions.

## Creating a pull request

Are you new to contibuting to an open source project? [Github has great resource](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) for first-timers to learn which steps you have to take when contributing.

The TL;DR version is:

> You cannot push code to repositories that you don’t own or have sufficient permission to. So instead, you make your own copy of the repository by “forking” it. [...] the next step is to create a branch. [...] Then we'll create a pull request.

Please follow the pull request template as much as possible.

### Branch names

Please name your branch kind of logically. Preferably after the issue you're fixing in it.

### Pull request names

Here again, please make sure if makes some sense.

## Questions?

The only communication channel we have at the moment is this repository, so if you have any questions the best way do ask them is by opening an issue.
