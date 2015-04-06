# photoeditor

[![Build Status](https://secure.travis-ci.org/https://github.com/hyeonmi/PhotoEditor/photoeditor.png?branch=master)](https://travis-ci.org/https://github.com/hyeonmi/PhotoEditor/photoeditor)

description

Contributers:

- HyeonMi.Kim

---
### [Contents](id:contents)
- [Usage](#usage)
- [Install](#install)
- [Why](#why)
- [Example](#example)
- [API](#api)
- [Tests](#tests)
- [Support](#support)

---
### [Usage](id:usage)


---
[top](#contents)
### [Install](id:install)

Bower is a package manager for the web built by twitter, you should check it out, and download this package.

`$ npm install bower -g`  
`$ bower install photoeditor --save `

The `--save` flag will save photoeditor as a dependency in your project's `bower.json` file.

OR  

Download this project, take `photoeditor.js` or `photoeditor.min.js` files out and put them wherever you would like.

---
[top](#contents)
### [Why](id:why)

---
[top](#contents)
### [Example](id:example)

There is a small how-to in this repository at [example/example.html](https://github.com/https://github.com/hyeonmi/PhotoEditor/photoeditor/blob/master/example/example.html). 

_description of what the example does here_

To run the example.

```
$ git clone git@github.com:https://github.com/hyeonmi/PhotoEditor/photoeditor.git
$ cd photoeditor/
$ bower install
$ node ./util/web-server.js
```

and then navigate to <http://localhost:8000/example/example.html>

---
[top](#contents)
### [API](id:api)

---
[top](#contents)
### [Tests](id:tests)

Tests are in the `test/` directory, they are written with mocha, and run via `testrunner.html`. To get the dependencies for testing, you must have npm and bower installed: `npm install -g bower`.

Single Test Run. This is how travis-ci runs the tests.

```
$ git clone git@github.com:https://github.com/hyeonmi/PhotoEditor/photoeditor.git  
$ cd photoeditor/
$ npm install
$ bower install
$ npm test
```

**OR**  

Run them in the terminal as you Develop!!!

```
$ git clone git@github.com:https://github.com/hyeonmi/PhotoEditor/photoeditor.git  
$ cd photoeditor/
$ npm install
$ bower install
```

Start a server in one terminal window.  
`$ grunt nodemon`

And then in another terminal window.

```   
$ cd photoeditor/ 
$ grunt watch
```

and then just start developing. Grunt will run automated tests with [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs), and JSHint whenever you save files.

Also tests in the browser at <http://localhost:8000/testrunner.html>

---
[top](#contents)
### [Support](id:support)

You can make an issue. Pull requests welcome.

_your contact info here_

component generated with yeoman and [backbone-module](https://github.com/nackjicholson/generator-backbone-module)