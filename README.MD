# What is qvue

<p align="center">
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/dt/qvue-js.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/v/qvue-js.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/l/qvue-js.svg" alt="License"></a>
</p>

日本語の説明は [こちら](https://github.com/maachang/qvue/blob/master/README_JP.MD)

qvue is a very thin framework that uses the template function of vue.js.

The qvue framework itself uses the core javascript of qvue.js, but it is difficult to create these template environments one by one, so use this qvue command to create a skeleton model .

By this, I think it can be a little easier to "set up the initial environment".

_

_

# Installation

※ It is assumed that nodejs is installed and npm can be used.

```sh
$ npm install -g qvue-js
```

_

_

# How to use

By executing the following command, you can create a template of qvue project.

```sh
$ qvue -n [name] -b [base folder]
  -n (--name) [name]  It is used for the title etc.
  -b (--base) [base folder]  url set base folder to be accessed.
  -d (--description) [description]  Set the description of index.html.
  -k (--keywords) [keywords]  Set keywords in index.html.

 Create an environment to use the qvue framework.
```

_
## name
name sets the qvue project name.

The name at this time is used for the default title.

_
## base folder
base folder is set when the current folder of URL exists.

For example, if the URL is `http://127.0.0.1:8080/hoge/`, `/hoge/` corresponds to the current folder name.

_
## description
description sets the value of description of index.html meta tag.

_
## keywords
keywords sets the keyword value of the meta tag of index.html.

_
## Folder structure
Executing the qvue command unfolds the template of the qvue project
```
[root]  Root folder.
  |
  +-- apps              Application folder.
  |    |
  |    +-- pages        qvue Page storage folder.
  |    |    |
  |    |    +-- index.html   qvue page sample.
  |    |
  |    +-- main.js      Application initialization javascript.
  |
  +-- css
  |    |
  |    +-- base.css     Basic style-sheet.
  |
  +-- js
  |    |
  |    +-- qvue.js      qvue core javascript.
  |    |
  |    +-- qvue.js.gz   qvue core javascript is gzipped.
  |
  +-- favicon.ico       Sample icon.
  |
  +-- index.html        qvue base html.
```

After creating a template like this, create an application based on the document.

_

_

# Documentation.

※ Document link is included.

_

_

# Finally

With this tool, I hope to be a good deal for web development.

日本語の説明は [こちら](https://github.com/maachang/qvue/blob/master/README_JP.MD)