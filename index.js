#!/usr/bin/env node

/*!
 * qvue.
 * Copyright(c) 2020 maachang.
 * MIT Licensed
 */

//
// 現在のプロジェクトフォルダに対して、qvue環境を構築する.
//
(function() {
  'use strict';

  var fs = require('fs');
  var file = require("./lib/file");

  // パラメータ引数を取得.
  var _args = function(c) {
    for(var i = 2; i < process.argv.length; i ++) {
      if(process.argv[i] == c) {
        return process.argv[i+1];
      }
    }
    return undefined;
  }

  // 文字列を置き換える.
  var _change = function(base, src, dest) {
    base = "" + base;
    src = "" + src;
    dest = "" + dest;
    var old = base;
    var val = base;
    while (true) {
      val = val.replace(src,dest);
      if (old == val) {
        return val;
      }
      old = val;
    }
  }

  // ファイルコピー.
  var _cp = function(src, dest) {
    fs.copyFileSync(src, dest);
  }

  // ヘルプ情報.
  var name = process.argv[2]
  if(!name || name == "" || name == "-h" || name == "--help") {
    console.log("$ qvue -n [name] -b [base folder]")
    console.log("  -n (--name) [name]  It is used for the title etc.")
    console.log("  -b (--base) [base folder]  url set base folder to be accessed.")
    console.log("  -d (--description) [description]  Set the description of index.html.")
    console.log("  -k (--keywords) [keywords]  Set keywords in index.html.")
    console.log("");
    console.log(" Create an environment to use the qvue framework.");
    console.log("");
    return false;
  }

  // パラメータを取得.
  var name = _args("-n") || _args("--name");
  var base = _args("-b") || _args("--base");
  var description = _args("-d") || _args("--description");
  var keywords = _args("-k") || _args("--keywords");

  name = (!name || name == "") ? "" : name;
  base = (!base || base == "") ? "" : base;
  description = (!description || description == "") ? "" : description;
  keywords = (!keywords || keywords == "") ? "" : keywords;

  // lib/qvue/index.html の {{base_dir}}を置き換える場合のパス名変換.
  var appendDir = base;
  if(appendDir.indexOf("/") == 0) {
    appendDir = appendDir.substring(1);
  }
  if(appendDir.lastIndexOf("/") == appendDir.length - 1) {
    appendDir = appendDir.substring(0, appendDir.length - 1);
  }

  var qvueDir = __dirname + "/lib/qvue/"
  var outDir = "./";

  // lib/qvue/index.html を読み込む.
  var value = file.readByString(qvueDir + "index.html");
  value = _change(value, "{{default_title}}", name);
  value = _change(value, "{{base_path}}", appendDir);
  value = _change(value, "{{description}}", description);
  value = _change(value, "{{keywords}}", keywords);

  // lib/qvue/index.html を書き込む.
  file.writeByString(outDir + "index.html", value);

  // lib/qvue/favicon.icoをコピー.
  _cp(qvueDir + "favicon.ico", outDir + "favicon.ico");

  // フォルダを作成.
  file.mkdir(outDir + "js");
  file.mkdir(outDir + "css");
  file.mkdir(outDir + "apps");

  // jsファイルをコピー.
  _cp(qvueDir + "js/qvue.js", outDir + "js/qvue.js");
  _cp(qvueDir + "js/qvue.js.gz", outDir + "js/qvue.js.gz");

  // cssファイルをコピー.
  _cp(qvueDir + "css/base.css", outDir + "css/base.css");

  // appsファイルコピー.
  _cp(qvueDir + "apps/main.js", outDir + "apps/main.js");

  // apps/pagesフォルダを作成.
  file.mkdir(outDir + "apps/pages");

  // apps/pages/index.htmlファイルをコピー.
  _cp(qvueDir + "apps/pages/index.html", outDir + "apps/pages/index.html");

  return true;
})();
