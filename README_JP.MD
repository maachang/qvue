# qvue とは

<p align="center">
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/dt/qvue-js.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/v/qvue-js.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/qvue-js"><img src="https://img.shields.io/npm/l/qvue-js.svg" alt="License"></a>
</p>

English documents [here](https://github.com/maachang/qvue/blob/master/README.MD)

qvueはvue.jsのテンプレート機能を利用する、凄く薄いフレームワークです。

qvueフレームワーク自身は qvue.jsのコアjavascriptを用いますが、これらの雛形環境をいちいち、手動で作成するのも大変なので、このqvueコマンドを利用して、スケルトンモデルを作成します。

これによって、少しは「初期環境の構築」が楽にできるのかと思います。

_

_

# インストール

※ nodejsがインストールされており npm が利用できることが前提です。

```sh
$ npm install -g qvue
```

_

_

# 使い方について

以下のコマンドを実行することで、qvueプロジェクトの雛形が作成出来ます。

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
name は、qvueプロジェクト名を設定します。

この時の名前は、デフォルトのタイトルに利用されます。

_
## base folder
base folder は、URLのカレントフォルダが存在する場合に設定します。

たとえば、URLが `http://127.0.0.1:8080/hoge/` の場合は `/hoge/` がカレントフォルダ名に該当します。

_
## description
description は index.html の metaタグの description の値を設定します.

_
## keywords
keywords は index.html の metaタグの keywords の値を設定します.

_
## フォルダ構成
qvueコマンドを実行することで、qvueプロジェクトの雛形が展開されます
```
[root]  ルートフォルダ.
  |
  +-- apps              アプリケーションフォルダ.
  |    |
  |    +-- pages        qvue ページ格納フォルダ.
  |    |    |
  |    |    +-- index.html   qvue ページサンプル.
  |    |
  |    +-- main.js      アプリケーション初期化用 javascript.
  |
  +-- css
  |    |
  |    +-- base.css     基本style-sheet.
  |
  +-- js
  |    |
  |    +-- qvue.js      qvue コアjavascript.
  |    |
  |    +-- qvue.js.gz   qvue コアjavascriptをgzipで固めたもの.
  |
  +-- favicon.ico       サンプルアイコン.
  |
  +-- index.html        qvue ベース html.
```

こんな感じの雛形が作成されるので、あとは、ドキュメントを元に、アプリケーションを作成します.

_

_

# ドキュメント.

※ ドキュメントのリンクを記載.

_

_

# 最後に

このツールによって、Web開発にとって `お得になる` ことを願っています.

English documents [here](https://github.com/maachang/qvue/blob/master/README.MD)