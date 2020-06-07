// vue.js テンプレート機能 [quick-vue.js -> qvue.js].
//

(function(_g) {
"use strict";
var _u = undefined;

// キャッシュ関連.
// 取り合えず、キャッシュモードは現状なし.
//var NO_CACHE = true;
//var PAGE_CACHE_TIME = 0;
//var CACHE_HEAD = "qvue.pages.";

// httpキャッシュなし.
var _HTTP_NOT_CACHE = true;

// デバッグ表示用.
var _DEBUG = true;

// ローディング、ダイアログ関連.
var BODY_ZINDEX = 0;
var LOADING_ZINDEX = 500;
var DIALOG_ZINDEX = 1000;

// qvue id.
var _DEF_QVUE_BODY_ID = "qvue_body";
var _QVUE_BODY_ID = _DEF_QVUE_BODY_ID;
var _QVUE_NOW_LOADING_ID = "qvue_loading";
var _QVUE_DIALOG_ID = "qvue_dialog";

// 基本ファイル・フォルダ名.
var _CURRENT_PATH = "/";
var _BASE_PATH = "$apps";
var _BASE_MAIN_JS = "/main.js";
var _BASE_PAGE_DIR = "/pages/";
var _BASE_ERROR_DIR = "/errors/";
var _BASE_ERROR_PAGE = "error.html";

// 基本パス.
var CURRENT_PATH = _CURRENT_PATH;
var BASE_PATH = _BASE_PATH;
var INIT_JS = CURRENT_PATH + BASE_PATH + _BASE_MAIN_JS;
var PAGE_PATH = CURRENT_PATH + BASE_PATH + _BASE_PAGE_DIR;

// エラー系基本パス.
var ERROR_PAGES = CURRENT_PATH + BASE_PATH + _BASE_ERROR_DIR;
var DEFAULT_ERROR_PAGE = _BASE_ERROR_PAGE;

//  qvue埋め込みタグ.
var QVUE_TAG_NAME = "script";
var QVUE_START_TAG = "<" + QVUE_TAG_NAME + ">";
var QVUE_START_TAG_LEN = QVUE_START_TAG.length;
var QVUE_END_TAG = "</" + QVUE_TAG_NAME + ">";
var QVUE_END_TAG_LEN = QVUE_END_TAG.length;

// os判別関連.
var _ua = _g.navigator.userAgent ;
var isIPHONE = _ua.match(/iPhone|iPod/) != null ;   // iphone/ipod.
var isIPAD = _ua.match(/iPad/) != null ;            // ipad.
var isAndroid = _ua.match(/Android/) != null ;      // Android.

// クリックイベント処理.
// Androidの場合は、touchendイベントで処理させる.
//var _CLICK = (isIPHONE || isIPAD) ? "touchend" : "click";
//var _CLICK = (isIPHONE || isIPAD) ? "click" : "click";
//var _CLICK = (isAndroid) ? "touchend" : "click";
var _CLICK = (isAndroid || isIPHONE || isIPAD) ? "touchend" : "click";

// 基本処理系.
var _Array_prototype_slice = function( args,no ) {return Array.prototype.slice.call( args,no );}
var _$ = function(n) {return document.getElementById(n);}

// イベント追加.
// node 対象の要素を設定します.
// name 対象のイベント条件を設定します.
// func 対象のイベント処理を設定します.
var addEvent = function(node, name, func) {
  if(!node) {
    node = _g ; 
  } else if(typeof(node) == "string") {
    node = _$(node);
  }
  if(node.addEventListener){
    node.addEventListener(name, func, false);
  } else if(node.attachEvent){
    node.attachEvent("on"+name, func);
  }
}

// 正確な時間情報を取得.
// 戻り値 : ページ読み込みからの時間情報(ミリ秒)が返却されます.
var getTime = (function() {
  var _now = _g.performance && (
    _g.performance.now || 
    _g.performance.mozNow || 
    _g.performance.webkitNow ||
    _g.performance.msNow || 
    _g.performance.oNow ) ;
  if(_now) {
    var _wp = _g.performance ;
    return function() {
        return  _now.call(_wp)|0 ;
    }
  } else {
    return Date.now;
  }
})() ;

// 非同期処理.
var async = function(func) {
  if( typeof(func) != "function" ) return null ;
  var args = arguments ;
  if( args.length > 1 ) {
    var id = setInterval( function() {
      clearInterval(id) ;
      var f = func;
      f.apply(null, _Array_prototype_slice( args,1 )) ;
    },0) ;
  }
  else {
    var id = setInterval( function() {
      clearInterval(i) ;
      var f = func;
      f();
    },0) ;
  }
}

// タイマー実行処理.
var executionTime = function(time, call) {
  if(typeof(call) != "function") return null ;
  var args = arguments ;
  time = (time == _u) ? 0 : time|0;
  if(args.length > 2) {
    return setTimeout(function() {
      var c = call;
      c.apply(null, _Array_prototype_slice(args, 2)) ;
    },time) ;
  } else {
    return setTimeout(function() {
      var c = call;
      c();
    },time) ;
  }
}

// 文字列内のコーテーションを１つUPさせる.
var ucode = function(target, value) {
  var len = value.length, ret = "", cote = -1, yen = 0, n, j;
  for(var i = 0;i < len; i++) {
    n = value.charAt(i);
    if(cote == -1) {
      if(n == target) {
        cote = n;
        ret += "\\" + n;
      } else {
        ret += n;
      }
    } else if(n == "\\") {
      yen ++;
    } else if(n == target) {
      if(yen == 0) {
        cote = -1;
        ret += "\\" + n;
      } else {
        for(j = 0;j < yen; j++) {
          ret += "\\\\";
        }
        yen = 0;
        ret += "\\\"";
      }
    } else if(yen != 0) {
      for(j = 0;j < yen; j++) {
        ret += "\\";
      }
      yen = 0;
      ret += n;
    } else {
      ret += n;
    }
  }
  return ret;
}

// コーテーションを検知しない、indexOf
var notCoteIndex = function(base, cc, off) {
  var c, res, i, j;
  var len = base.length, cote = -1, cLen = cc.length, bef = 0, yenFlag = false ;
  for(i = off|0 ; i < len ; i ++ ) {
    c = base.charAt(i) ;
    if( cote != -1 ) {
      if( bef != '\\' && c == cote ) {
        yenFlag = false ;
        cote = -1 ;
      } else if( c == '\\' && bef == '\\' ) {
        yenFlag = true ;
      } else {
        yenFlag = false ;
      }
    } else if( bef != '\\' && ( c == '\'' || c == '\"' ) ) {
      cote = c ;
    } else if( c == cc.charAt(0) ) {
      res = true ;
      for(j = 1 ; j < cLen ; j ++) {
        if( i + j >= len || cc.charAt(j) != base.charAt( i + j ) ) {
          res = false ;
          break ;
        }
      }
      if( res == true ) return i ;
    }
    if( yenFlag ) {
      yenFlag = false ;
      bef = 0 ;
    } else {
      bef = c ;
    }
  }
  return -1 ;
}

// フォント設定.
var font = (function() {
// デフォルトフォント定義.
var DEF_FONT = "Verdana,Roboto,\'Droid Sans\',\'游ゴシック\',YuGothic,\'メイリオ\',Meiryo,"+
    "\'ヒラギノ角ゴ ProN W3\',\'Hiragino Kaku Gothic ProN\',\'ＭＳ Ｐゴシック\',sans-serif" ;

// デフォルトフォントに追加.
o.add = function(name) {
  DEF_FONT = name + "," + DEF_FONT;
}

// デフォルトフォントをセット
o.set = function(name) {
  DEF_FONT = name;
}

// デフォルトフォントを取得.
o.get = function() {
  return DEF_FONT;
}

// bodyに現在のフォントファミリーをセット.
o.setting = function() {
  var body = document.body;
  if(body) {
    body.style = "fontFamil: " + DEF_FONT + ";";
  }
}

return o;
})

// ソート処理.
var sort = ( function() {
    
  // 基本ソート.
  var _defSort = function(x, y) {
    return (x > y) ? 1 : ((x < y) ?  -1 : 0);
  }
  // 数値用ソート.
  var _numSort = function(x, y) {
      return x - y ;
  }
  // 文字列ソート.
  var _strSort = function(x, y) {
    return (x == y) ? 0 : ((x > y) ? 1 : -1);
  }
  // ソート処理がサポートされていない場合(quick-sort).
  var _q = function(ary, head, tail, cmp) {
    var pivot, tmp, i, j, t ;
    pivot = ary[ head + ((tail - head)>>1) ];
    i = head - 1;
    j = tail + 1;
    while(1){
        while (cmp(ary[++i], pivot) < 0){};
        while (cmp(ary[--j], pivot) > 0){};
        if (i >= j) break;
        tmp = ary[i];
        ary[i] = ary[j];
        ary[j] = tmp;
    }
    if (head < i - 1) _q(ary, head, i - 1, cmp);
    if (j + 1 < tail) _q(ary, j + 1, tail, cmp);
    return ary;
  } ;
  // 対象のcomparerを取得.
  var _cmp = function(comparer, list) {
    if(!comparer) {
      if(( t = typeof( list[ 0 ] ) ) == "number") {
        return _numSort ;
      } else if(t == "string") {
        return _strSort ;
      } else {
        return _defSort ;
      }
    }
    return comparer ;
  } ;
  // ソート処理がサポートされている場合.
  if( typeof( Array.sort ) == "function" ) {
    return function(list, comparer, size) {
      if(!list|| list.length <= 0) {
        return list ;
      }
      // サイズ指定されている場合.
      else if(size != _u) {
        
        // クイックソート.
        return _q(list, 0, ( size|0 )-1, _cmp( comparer,list )) ;
      }
      // TypedArray関連の場合.
      else if(!list.sort) {
        
        // クイックソート.
        return _q(list, 0, list.length - 1, _cmp( comparer,list )) ;
      }
      // 通常ソートの場合.
      return list.sort( _cmp( comparer,list ) ) ;
    }
  }
  // ソート処理がサポートされていない場合.
  else {
    return function(list, comparer, size) {
      if(!list || list.length <= 0) {
        return list ;
      }
      // サイズ指定されている場合.
      else if( size != _u ) {
        return _q(list, 0, ( size|0 )-1, _cmp( comparer,list )) ;
      }
      // 通常ソートの場合.
      return _q(list, 0, list.length - 1, _cmp( comparer,list ));
    }
  }
})() ;

// jsonエンコード、デコード.
var json = (function() {
  var o = {} ;
  
  // Arrayタイプから、eval実行可能内容を生成.
  var evalByArrayString = function( buf,v ) {
    var tt ;
    var vv = v ;
    var aryLen = vv.length ;
    buf += "[" ;
    for( var i = 0 ; i < aryLen ; i ++ ) {
      if( i != 0 ) {
        buf += "," ;
      }
      tt = valueof( vv[i] ) ;
      if( tt == "object" ) {
        continue ; // 不明オブジェクトの内容は無視する.
      } else if( tt == "array" ) {
        buf += evalByArrayString( buf, vv[i] ) ;
      } else if( tt == "map" ) {
        buf += evalByMapString( buf, vv[i] ) ;
      } else {
        buf += evalByString( vv[i] );
      }
    }
    buf += "]";
    return buf;
  }

  // Mapタイプから、eval実行可能内容を生成.
  var evalByMapString = function( buf,v ) {
    var tt, ky;
    var vv = v, cnt = 0 ;
    buf += "{" ;
    for( ky in vv ) {
      if( cnt != 0 ) {
        buf += "," ;
      }
      buf += "\"" + ky + "\":" ;
      tt = valueof( vv[ky] ) ;
      if( tt == "object" ) {
        continue ; // 不明オブジェクトの内容は無視する.
      } else if( tt == "array" ) {
        buf += evalByArrayString( buf,vv[ky] ) ;
      } else if( tt == "map" ) {
        buf += evalByMapString( buf,vv[ky] ) ;
      } else {
        buf += evalByString( vv[ky] ) ;
      }
      cnt ++ ;
    }
    buf += "}" ;
    return buf ;
  }

  // 指定タイプから、eval実行可能内容を生成.
  var evalByString = function( vv ) {
    var tt = valueof(vv) ;
    if( tt == "string" ) {
      return "\""+ucode( "\"",vv )+"\"" ;
    } else if( tt == "boolean" ) {
      return ""+vv ;
    } else if( tt == "number" ) {
      return ""+vv ;
    } else if( tt == "date" ) {
      return "new Date(" + vv.getTime() + ")" ;
    }
    return "\"\"" ;
  }
  // 指定内容タイプがArrayかMapか取得.
  var arrayOrMapValueTo = function(val) {
    return (typeof(val.length) == "number") ? "array" : "map" ;
  }

  // 指定内容タイプを取得.
  var valueof = function(val) {
    if( val == null || val == _u ) {
      return "null" ;
    }
    var tt = typeof( val ) ;
    if( tt == "string" ) {
      return "string" ;
    } else if( tt == "boolean" ) {
      return "boolean" ;
    } else if( tt == "number" ) {
      return "number" ;
    } else if( tt == "function" ) {
      return "function" ;
    } else if( tt == "date" ) {
      return "date" ;
    } else if( tt == "object" ) {
      if( val instanceof Date ) {
        return "date" ;
      } else if( val instanceof Array ) {
        if( val.length == 0 ) {
          return "array" ;
        }
        return arrayOrMapValueTo( val ) ;
      }
    }
    return arrayOrMapValueTo( val ) ;
  }
  
  // json形式に変換.
  o.encode = function( value ) {
    if( value == null || value == _u ) {
      return "\"\"" ;
    }
    var tt = valueof( value ) ;
    if( tt == "array" ) {
      return evalByArrayString("", value) ;
    } else if( tt == "map" ) {
      return evalByMapString("", value) ;
    } else {
      return evalByString(value) ;
    }
  }

  // json形式の文字列を変換.
  o.decode = (function() {
    var _REG = /^\s+|\s+$/g ;
    return function( value ) {
      if( value == null || value == _u || typeof( value ) != "string" ) {
        return null ;
      }
      var ret = null;
      try {
        ret = JSON.parse(value);
      } catch(e) {
        ret = new Function("return (" + value.replace(_REG, "") + ")")() ;
      }
      return ret;
    }
  } )();

  // 指定内容タイプを取得.
  o.valueof = function( val ) {
    return valueof(val);
  }
  
  return o ;
})() ;

// httpClient.
var http_client = (function(){
  var head = function(m, x, h) {
    if(!h["Content-Type"]) {
      if(m=='POST') {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      else if(m=='JSON') {
        x.setRequestHeader('Content-Type', 'application/json');
      }
    }
    if(h) {
      for(var k in h) {
        // コンテンツ長は設定すると警告が出るのでいれない.
        if(k != "Content-Length") {
          x.setRequestHeader(k,h[k]);
        }
      }
    }
  }
  var _m=function(m) {
    return m == 'JSON' ? 'POST' : m;
  }
  
  return function(method ,url, option, func, errFunc) {
    if(!option) {
      option = {};
    }
    var params = option.params;
    var noCache = option.noCache;
    var headers = option.headers;
    headers = (!headers) ? {} : headers;
    errFunc = (typeof(errFunc) != "function") ? func : errFunc;
    method = (method+"").toUpperCase() ;
    if(noCache != false) {
      url += (( url.indexOf( "?" ) == -1 )? "?":"&" )+(new Date().getTime()) ;
    }
    var pms = "" ;
    if( params ) {
      if( typeof( params ) == "string" ||
        params instanceof Blob || params instanceof File ||
        params instanceof Uint8Array || params instanceof ArrayBuffer) {
        pms = params ;
      }
      else {
        var cnt = 0;
        for( var k in params ) {
          if(cnt != 0) {
            pms += "&";
          }
          pms += k + "=" + encodeURIComponent( params[ k ] ) ;
          cnt ++;
        }
      }
    }
    if( method == "GET" ) {
      url += pms ;
      pms = null ;
    }
    // 同期Ajax.
    if( func == _u ) {
      var x = new XMLHttpRequest();
      x.open(_m(method),url,false);
      head(method, x, headers);
      x.send(pms);
      var state = x.status;
      if(state == 0) {
          state = 500;
      }
      var ret = x.responseText;
      x.abort() ;
      if(state < 300) {
          return ret ;
      }
      throw new Error("response status:" + state + " error");
    }
    // 非同期Ajax.
    else {
      var x = new XMLHttpRequest();
      x.open(_m(method),url,true);
      x.onload = function(){
        if(x.readyState==4) {
          try {
            var status = x.status;
            if(!status || status == 0) {
              status = 500;
            }
            if( status < 300 ) {
              func(status,x.responseText) ;
            } else {
              errFunc(status,x.responseText) ;
            }
          } finally {
            x.abort() ;
            x = null;
            func = null;
            errFunc = null;
          }
        }
      };
      x.onerror = function() {
        var status = x.status;
        if(!status || status == 0) {
          status = 500;
        }
        try {
          errFunc(status,x.responseText ) ;
        } finally {
          x.abort() ;
          x = null;
          func = null;
          errFunc = null;
        }
      }
    }
    head(method, x, headers);
    x.send(pms);
  };
})();

// promise版http_client.
var phttpc = (function() {

  // promise対応版 http client.
  var _promiseHttpClient = function(method, options) {
    var url = options.url;
    var params = options.body;
    var headers = options.headers;

    // httpClient用のオプション変換.
    var opt = {
      params: params,
      headers: headers,
      noCache: _HTTP_NOT_CACHE
    };
    return new Promise(function(resolve, reject) {
      http_client(method, url, opt,
        function(status, body, headers) {
          var c = "";
          if(headers != undefined) {
            // content-typeを取得.
            var c = headers["Content-Type"];
            if(c == undefined) {
              c = headers["tontent-type"];
              if(c == undefined) {
                c = "";
              }
            }
            c = c.toLowerCase();
          }
          // json返信の場合はJSON変換.
          if(c.indexOf("application/json") == 0) {
            body = json.decode(body);
          }
          resolve({status: status, body: body, headers: headers});
        },
        function(status, body, headers) {
          // エラー系.
          reject({status: status, body: body, headers: headers});
        }
      )
    });
  }
  var o = {};

  // get method.
  o.get = function(options) {
    return _promiseHttpClient("GET", options);
  }

  // post method(form).
  o.post = function(options) {
    return _promiseHttpClient("POST", options);
  }

  // post method(json).
  o.json = function(options) {
    return _promiseHttpClient("JSON", options);
  }
  return o;
})();


// xor128演算乱数装置.
var Xor128 = function(seet) {
  var r = {v:{a:123456789,b:362436069,c:521288629,d:88675123}};
  
  // シートセット.
  r.setSeet = function(s) {
    if (s != _u && s != null) {
      var n = this.v;
      s = s|0;
      n.a=s=1812433253*(s^(s>>30))+1;
      n.b=s=1812433253*(s^(s>>30))+2;
      n.c=s=1812433253*(s^(s>>30))+3;
      n.d=s=1812433253*(s^(s>>30))+4;
    }
  }
  
  // 乱数取得.
  r.next = function() {
    var n = this.v;
    var t=n.a;
    var r=t;
    t = ( t << 11 );
    t = ( t ^ r );
    r = t;
    r = ( r >> 8 );
    t = ( t ^ r );
    r = n.b;
    n.a = r;
    r = n.c;
    n.b = r;
    r = n.d;
    n.c = r;
    t = ( t ^ r );
    r = ( r >> 19 );
    r = ( r ^ t );
    n.d = r;
    return r;
  }
  r.nextInt = function() {
    return this.next();
  }
  r.setSeet(seet) ;
  return r;
}
var xor128 = new Xor128(Date.now());

// ページ読み込み時に表示させる、ローディングマーク.
var nowLoading = (function() {
  var o = {};
  var _FRAME_ID = "qvue_loading_frame";
  var _initLoading = false;

  // ポップアップカラー値.
  var _rgba = {r:0,g:0,b:0,a:0};

  // nowLoading タイミング.
  var _NOW_LOADING_TIMING = 100;

  // NowLoadingイメージGIF.
  var _NOW_LOAD_IMG_GIF = "data:image/gif;base64,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'";

  // ロード中の画面表示.
  var _view = function(rgba) {
    if(!rgba) {
      rgba = _rgba;
    }
    var iconW = 50;
    var iconH = 50;
    var iconR = 5;
    var w = document.documentElement.scrollWidth || document.body.scrollWidth;
    var h = document.documentElement.scrollHeight || document.body.scrollHeight;
    return "<div id='" + _FRAME_ID + "' style='z-index:" + LOADING_ZINDEX + ";position:absolute;width:"+w+"px;height:"+h+"px;" +
      "left:0px;top:0px;background-color:rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+");' " +
      "onclick='event.preventDefault()' ontouchstart='event.preventDefault()' ontouchend='event.preventDefault()'" +
      " ontouchmove='event.preventDefault()'>\n" +
      "<img src='" + _NOW_LOAD_IMG_GIF +
      " style='position:absolute;left:"+ ((_g.innerWidth-iconW)>>1) + "px;top:"+((_g.innerHeight-iconH)>>1)
    + "px;border-radius:"+iconR+"px;'>\n</div>\n";
  }

  // ポップアップバックカラー値をセット.
  // r : 赤カラー値を設定します.
  // g : 緑カラー値を設定します.
  // b : 青カラー値を設定します.
  // a : 透過値を設定します(1.0 ～ 0.0).
  o.setting = function(r,g,b,a) {
    _rgba.r = (r & 0x00ff)|0;
    _rgba.g = (g & 0x00ff)|0;
    _rgba.b = (b & 0x00ff)|0;
    _rgba.a = parseFloat(a);
  }

  // nowloading画面の初期設定.
  o.init = function(rgba) {
    var em = _$(_QVUE_NOW_LOADING_ID);
    if(em) {
      o.destroy();
      em.style.display = "none";
      em.innerHTML = _view(rgba);
      _initLoading = true;
      return true;
    }
    return false;
  }

  // nowloading画像の終了設定.
  o.destroy = function() {
    var em = _$(_FRAME_ID);
    if(em) {
      em.parentNode.innerHTML = "";
      _initLoading = false;
      return true;
    }
    return false;
  }

  // nowloadingを表示.
  // この処理を呼び出す場合は、先にnowLoading.init()の呼び出しが必須です.
  o.start = function(call) {
    if(!_initLoading) return false;
    var ret = false;
    var em = _$(_QVUE_NOW_LOADING_ID);
    if(em) {
      setTimeout(function() {
        em.style.display = "block";
      },_NOW_LOADING_TIMING);
    }
    if(typeof(call) == "function") {
      var cc = call;
      setTimeout(function() {
        var c = cc;
        c();
      }, _NOW_LOADING_TIMING);
    }
    return ret;
  }

  // nowloadingを非表示.
  // この処理を呼び出す場合は、先にnowLoading.init()の呼び出しが必須です.
  o.end = function() {
    if(!_initLoading) return false;
    setTimeout(function() {
      var em = _$(_QVUE_NOW_LOADING_ID);
      if((em)) {
        em.style.display = "none";
        return true;
      }
      return false;
    },_NOW_LOADING_TIMING + 50);
  }

  // nowLoading.startが有効中かチェック.
  o.isInit = function() {
    return _initLoading;
  }

  return o;
})();

// 背景半透明画面.
var fillAlpha = (function() {
  var QVUE_FILL_ALPHA_ID = "qvue_fillAlpha";

  // ポップアップカラー値.
  var _rgba = {r:32,g:32,b:32,a:0.5};

  var o = {};

  // ポップアップバックカラー値をセット.
  // r : 赤カラー値を設定します.
  // g : 緑カラー値を設定します.
  // b : 青カラー値を設定します.
  // a : 透過値を設定します(1.0 ～ 0.0).
  o.setting = function(r,g,b,a) {
    _rgba.r = (r & 0x00ff)|0;
    _rgba.g = (g & 0x00ff)|0;
    _rgba.b = (b & 0x00ff)|0;
    _rgba.a = parseFloat(a);
  }

  // 背景半透明画面セット.
  o.start = function(zIndex,rgba) {
    zIndex = zIndex == _u || zIndex == null ? DIALOG_ZINDEX-1 : zIndex;
    var w = document.documentElement.scrollWidth || document.body.scrollWidth;
    var h = document.documentElement.scrollHeight || document.body.scrollHeight;
    if(!(rgba)) {
        rgba = _rgba;
    }
    return "<div id='" + QVUE_FILL_ALPHA_ID + "' style='z-index:" + zIndex + ";position:absolute;width:"+w+"px;height:"+h+"px;" +
        "left:0px;top:0px;background-color:rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+");' " +
        "onclick='javascript:void(0)' ontouchstart='javascript:void(0)' ontouchend='javascript:void(0)'" +
        " ontouchmove='javascript:return (event.target.id != \"" + QVUE_FILL_ALPHA_ID + "\");'>\n";
  }

  return o;
})();

// dialog.
var dialog = (function() {
  var o = {};

  // ダイアログクローズタイミング.
  var _CLOSE_DIALOG_TIMING = 100;

  // ダイアログ文字表示ポジション.
  var _DIALOG_PADDING = 10;

  // ダイアログ影.
  var _BACK_DIALOG_SHADOW = "box-shadow: 10px 10px 10px rgba(0,0,0,0.75);";

  // ConfirmボタンHeight.
  var _CONFIRM_BUTTON_HEIGHT = 50;

  // ダイアログフォントサイズ.
  var _DIALOG_FONT_SIZE = "small";

  // ダイアログコールバック.
  var _DIALOG_CALL = {};

  // アラート用Id.
  var _ALERT_ID = "qvue_alert";

  // confirmId.
  var _COMFIRM_ID = "qvue_confirm";

  // 確認ダイアログボタンスタイル.
  var _confirmDefButtonDef = {
    "position": "relative",
    "display": "inline-block",
    "padding": "0.25em 0.5em",
    "text-decoration": "none",
    "color": "#FFF",
    "background": "#03A9F4",
    "border": "solid 1px #0f9ada",
    "border-radius": "4px",
    "box-shadow": "inset 0 1px 0 rgba(255,255,255,0.2)",
    "text-shadow": "0 1px 0 rgba(0,0,0,0.2)"
  }

  // 確認ダイアログボタン定義.
  var _confirmDef = {
    "yesName": "ＯＫ",
    "noName": "キャンセル",
    "yesButtonStyle": _confirmDefButtonDef,
    "noButtonStyle": _confirmDefButtonDef,
    "yesButtonClass": "",
    "noButtonClass": ""
  };

  // HTML表示可能な形式に変換.
  var _changeHtml = ( function() {
    var _chkCD = "&<>\'\" \r\n" ;
    return function( string ) {
      var len = string.length ;
      var chkCd = _chkCD ;
      var ret = "";
      var c ;
      for( var i = 0 ; i < len ; i ++ ) {
        switch( chkCd.indexOf( c = string.charAt( i ) ) ) {
          case -1: ret += c; break;
          case 0 : ret += "&amp;" ; break ;
          case 1 : ret += "&lt;" ; break ;
          case 2 : ret += "&gt;" ; break ;
          case 3 : ret += "&#039;" ; break ;
          case 4 : ret += "&#034;" ; break ;
          case 5 : ret += "&nbsp;" ; break ;
          case 6 : ret += "" ; break ;
          case 7 : ret += "<br>" ; break ;
        }
      }
      return ret
    }
  })() ;

  // 表示枠、最適なサイズを計算.
  var _dialog_positionSize = function() {
    var w = _g.innerWidth;
    var h = _g.innerHeight;
    
    if(w > h) {
      var left = (w*0.3)|0;
      var top = (h*0.2)|0;
      var width = (w*0.4)|0;
      var height = (h*0.6)|0;
      var radius = 10;
    } else {
      var left = (w*0.15)|0;
      var top = (h*0.2)|0;
      var width = (w*0.7)|0;
      var height = (h*0.6)|0;
      var radius = 10;
    }
    return {w:w,h:h,left:left,top:top,width:width,height:height,radius:radius};
  }

  // 新しいダイアログIDを取得.
  var _createDialogId = function(call) {
    var id = "" + xor128.next() + "_" + xor128.next();
    while(true) {
      if(_DIALOG_CALL[id] == undefined) {
        _DIALOG_CALL[id] = call;
        return id;
      }
      id = "" + xor128.next();
    }
  }

  // 指定ダイアログIDを削除.
  var _deleteDialogId = function(id) {
    var ret = _DIALOG_CALL[id];
    if(ret != undefined) {
      delete _DIALOG_CALL[id];
      return ret;
    }
  }

  // ダイアログIDのクリーニング処理.
  var _cleaningDialogId = function() {
    // 60秒に１度実行.
    setTimeout(function() {
      for(var k in _DIALOG_CALL) {
        if($(_ALERT_ID + "_" + k) == undefined &&
          $(_COMFIRM_ID + "_" + k) == undefined) {
          delete _DIALOG_CALL[k];
        }
      }
      _cleaningDialogId();
    }, 60000);
  }
  // クリーニング処理開始.
  _cleaningDialogId();

  // アラート表示.
  var _alert = function(text, alertId) {
    var pd = _DIALOG_PADDING;
    var p = _dialog_positionSize();
    return "<div id='" + _ALERT_ID + "_" + alertId + "' style='z-index:"+DIALOG_ZINDEX+";position:absolute;left:"+p.left+"px;top:"+p.top+"px;"+
      "width:"+p.width+"px;height:"+p.height+"px;border-radius:"+p.radius+"px;word-break:break-all;"+
      "background:#ffffff;color:#000000;border: solid 2px #efefef;"+
      _BACK_DIALOG_SHADOW +
      "overflow:auto;-webkit-overflow-scrolling:touch;'"+
      " ontouchmove='return true;'"+
      "><div style='margin:"+pd+"px;font-size:"+_DIALOG_FONT_SIZE+";'><BR>" + _changeHtml(text)+"</div></div>";
  }

  // アラートイベントをセット.
  var _alertEvent = function(alertId) {
    setTimeout(function() {
      var em = _$(_ALERT_ID + "_" + alertId);
      if(em) {
        addEvent(em, "click", function() {_closeDialog("alert", false, alertId);return true;});
      }
    }, 50);
  }

  // 確認ダイアログ表示.
  var _confirm = function(text, confirmId, opt) {
    var yn, nn, ycl, ncl, yst, nst, pd, p, ret;
    yn = opt.yesName;
    nn = opt.noName;
    ycl = opt.yesButtonClass;
    ncl = opt.noButtonClass;
    yst = opt.yesButtonStyle;
    nst = opt.noButtonStyle;
    if(!yn) {
      yn = _confirmDef.yesName;
    }
    if(!nn) {
      nn = _confirmDef.noName;
    }
    if(yst == _u) {
      yst = _confirmDef.yesButtonStyle;
    }
    if(nst == _u) {
      nst = _confirmDef.noButtonStyle;
    }
    pd = _DIALOG_PADDING;
    p = _dialog_positionSize();
    // 大枠をセット.
    ret = "<div id='" + _COMFIRM_ID + "_" + confirmId +
      "' style='z-index:"+DIALOG_ZINDEX+";position:absolute;left:"+p.left+"px;top:"+p.top+"px;"+
      "width:"+p.width+"px;height:"+p.height+"px;border-radius:"+p.radius+"px;"+
      "background:#ffffff;color:#000000;border: solid 2px #efefef;"+
      _BACK_DIALOG_SHADOW +
      " ontouchmove='return true;'>";
    // テキスト表示枠をセット.
    ret += "<div id='" + _COMFIRM_ID + "_" + confirmId +
      "_inner' style='z-index:"+(DIALOG_ZINDEX+1)+";left:"+(p.left-(pd>>1))+"px;top:"+(p.top-(pd>>1))+"px;"+
      "width:"+(p.width-pd)+"px;height:"+((p.height-(pd>>1))-(_CONFIRM_BUTTON_HEIGHT))+"px;"+
      "background:#ffffff;color:#000000;margin-left:"+pd+"px;margin-top:"+pd+"px;word-break:break-all;"+
      "overflow:auto;-webkit-overflow-scrolling:touch;font-size:"+_DIALOG_FONT_SIZE+";'"+
      " ontouchmove='return true;'>";
    ret += "<BR>" + _changeHtml(text) + "</div>";
    // yesボタン.
    ret += "<a href='javascript:void(0);' id='"+ _COMFIRM_ID + "_" + confirmId + "_yesButton' ";
    if(ycl) {
      ret += "class='"+ycl+"' ";
    }
    ret += "style='z-index:"+(DIALOG_ZINDEX+1)+";margin-left:" + pd + "px;";
    if(!ycl) {
      for(var k in yst) {
        ret += ""+k+":"+yst[k]+";";
      }
    }
    ret += "'>&nbsp;" + _changeHtml(yn) + "&nbsp;</a>";
    // noボタン.
    ret += "<a href='javascript:void(0);' id='"+ _COMFIRM_ID + "_" + confirmId + "_noButton' ";
    if(ncl) {
      ret += "class='"+ncl+"' ";
    }
    ret += "style='z-index:"+(DIALOG_ZINDEX+1)+";margin-left:" + (pd>>1) + "px;";
    if(!ncl) {
      for(var k in nst) {
        ret += ""+k+":"+nst[k]+";";
      }
    }
    ret += "'>&nbsp;" + _changeHtml(nn) + "&nbsp;</a></div>";
    return ret;
  }

  // アラートイベントをセット.
  var _confirmEvent = function(confirmId) {
    setTimeout(function() {
      var em = _$(_COMFIRM_ID + + "_" + confirmId + "_yesButton");
      if(em) {
        addEvent(em, _CLICK, function() {_closeDialog("confirm", true, confirmId);return true;});
      }
      em = _$(_COMFIRM_ID + "_" + confirmId + "_noButton");
      if(em) {
        addEvent(em, _CLICK, function() {_closeDialog("confirm", false, confirmId);return true;});
      }
    }, 50);
  }

  // ダイアログクローズ.
  var _closeDialog = function(type, yes, dialogId) {
    var em = null;
    if(type == "confirm") {
      em = _$(_COMFIRM_ID + "_" + dialogId);
    } else {
      em = _$(_ALERT_ID + "_" + dialogId);
    }
    if(em) {
      executionTime(_CLOSE_DIALOG_TIMING, function(dialogType, yesFlag, dialogId) {
        if(typeof(callFunc) == "function") {
          if(dialogType == "confirm") {
            setTimeout(function() {
              var call = _deleteDialogId(dialogId);
              if(call != undefined) {
                if(yesFlag) {
                  call(true);
                } else {
                  call(false);
                }
              }
            },100);
          } else {
            setTimeout(function() {
              var call = _deleteDialogId(dialogId);
              if(call != undefined) {
                call();
              }
            },100);
          }
        }
        var targetEm = null;
        if(dialogType == "confirm") {
          targetEm = _$(_COMFIRM_ID + "_" + dialogId);
        } else {
          targetEm = _$(_ALERT_ID + "_" + dialogId);
        }
        targetEm.parentNode.parentNode.innerHTML = "";
      },type, yes, dialogId);
      return true;
    }
    return false;
  }

  // alertを表示.
  //var oldAlert = _g.alert;
  o.alert = function(text, err, id) {
    if(!id) {
      id = _QVUE_DIALOG_ID;
    }
    if(_DEBUG) console.log("[alert]" + text);
    if(err != undefined && err.stack) {
      if(_DEBUG) console.trace(err);
    }
    var em = _$(id);
    if(em) {
     return new Promise(function(resolve) {
        var dialogId = _createDialogId(resolve);
        em.innerHTML =  fillAlpha.start(DIALOG_ZINDEX-1) + _alert(text, dialogId) + "\n<div>";
        _alertEvent(resolve);
      });
    } else {
      //oldAlert(text);
      return new Promise(function(_, reject) {
        // リジェクトを返却.
        reject();
      });
    }
  }

  // confirm用ボタンクラスを定義.
  o.setConfirmButtonClass = function(css) {
    if(!css) {
      css = "";
    }
    _confirmDef.yesButtonClass = css;
    _confirmDef.noButtonClass = css;
  }

  // confirm用ボタン表示名を定義.
  o.setConfirmButtonView = function(yes, no) {
    if(!yes) {
      yes = "ＯＫ";
    }
    if(!no) {
      no = "キャンセル";
    }
    _confirmDef.yesName = yes;
    _confirmDef.noName = no;
  }

  // confirmを表示.
  o.confirm = function(text, opt, id) {
    if(!id) {
      id = _QVUE_DIALOG_ID;
    }
    var margeOpt = {};
    for(var k in _confirmDef) {
      margeOpt[k] = _confirmDef[k];
    }
    if(opt == _u) {
      for(var k in opt) {
        margeOpt[k] = opt[k];
      }
    }
    var em = _$(id);
    if(em) {
      return new Promise(function(resolve, reject) {
        var dialogId = _createDialogId(resolve);
        em.innerHTML = fillAlpha.start(DIALOG_ZINDEX-1) + _confirm(text, dialogId, margeOpt) + "\n<div>";
        _confirmEvent(dialogId);
      });
    } else {
      return new Promise(function(_, reject) {
        // リジェクトを返却.
        reject();
      });
    }
  }
  return o;
})();

// ページ表示用.
var page = (function() {
var o = {};
var nowPath = "";

// JSにパラメータを付与する.
var _jsParams = function(js, params) {
  if(notCoteIndex(js, "(function(_g)", 0) == -1) {
    js = "\"use strict\";\n(function(_g) {\n" + js + "\n})(this);";
  }
  if(!params) return js;
  var p = notCoteIndex(js, "(function(_g)", 0);
  if(p == -1) return js;
  p = notCoteIndex(js, "{", p + 13);
  if(p == -1) return js;
  return js.substring(0, p + 1) + "\nvar params=" + json.encode(params) + ";\n" + js.substring(p + 1);
}

// 文字列を置き換える.
var _change = function(base, src, dest) {
  if(typeof(base) != "string") {
    return base ;
  }
  src = "" + src ;
  dest = "" + dest ;
  var old = base;
  var val = base ;
  while( true ) {
    val = val.replace( src,dest ) ;
    if( old === val ) {
      return val ;
    }
    old = val ;
  }
}

// エラーページを表示する.
var _errorView = function(id, title, html, status, message, endCall) {
  var em = _$(id);
  if(!em) {
    return;
  }
  html = _change(html, "{{status}}", status);
  html = _change(html, "{{message}}", message);
  em.innerHTML = html;
  if(title) {
    setTimeout(function() {
      document.title = title;
    }, 50)
  }
  if(typeof(endCall) == "function") {
    endCall();
  } else {
    setTimeout(function() {
      nowLoading.end();
    }, 50);
  }
}

// エラーページを設定.
var _errorPage = function(id, status, message, endCall) {
  var title = "error - " + status;
  // エラー専用ページがあるか取得.
  phttpc.get({url: ERROR_PAGES + status + ".html", body: {}, headers: {}})
    .then(function(result) {
      if(nowLoading.isInit()) {
        nowLoading.start(function() {
          _errorView(id, title, result.body, status, message, endCall);
        });
      } else {
        _errorView(id, title, result.body, status, message, endCall);
      }
    })
    .catch(function() {
      phttpc.get({url: ERROR_PAGES + DEFAULT_ERROR_PAGE, body: {}, headers: {}})
        .then(function(result) {
          if(nowLoading.isInit()) {
            nowLoading.start(function() {
              _errorView(id, title, result.body, status, message, endCall);
            });
          } else {
            _errorView(id, title, result.body, status, message, endCall);
          }
        })
        .catch(function() {
          var html = "<p>error status: {{status}}</p><p>message: {{message}}</p>";
          if(nowLoading.isInit()) {
            nowLoading.start(function() {
              _errorView(id, title, html, status, message, endCall);
            });
          } else {
            _errorView(id, title, html, status, message, endCall);
          }
        });
    });
}

// ページのロードを行う.
var _loadPage = function(id, url, params, headers, call) {
  if(url.lastIndexOf("/") == url.length-1) url = url.substring(0,url.length-1);
  if(!params) params = {};
  if(!headers) headers = {};
  var path =  PAGE_PATH + url;
  nowPath = path;
  phttpc.get({url: path + ".html", body: params, headers: headers})
    // result = {status: status, body: body, headers: headers}.
    .then(function(result) {
      try {
        // qvue開始タグが存在するかチェック.
        var p = notCoteIndex(result.body, QVUE_START_TAG, 0);
        if(p != -1) {
          // qvue終了タグが存在するかチェック.
          var pp = notCoteIndex(result.body, QVUE_END_TAG, p + QVUE_START_TAG_LEN);
          // HTMLファイル内にqvueのJSが混在している.
          if(pp != -1) {
            // ロードページをセット.
            call(
              (result.body.substring(0, p) + "\n" + result.body.substring(pp + QVUE_END_TAG_LEN)),
              (_jsParams(result.body.substring(p + QVUE_START_TAG_LEN, pp), params)),
              nowLoading.end);
            return;
          }
        }
        // htmlとqvueのファイルが分離されている.
        var html = result.body;
        phttpc.get({url: path + ".js", body: params, headers: headers})
          // result = {status: status, body: body, headers: headers}.
          .then(function(result) {
            // 取得したjsをセット.
            call(html, _jsParams(result.body, params));
          })
          .catch(function() {
            // jsファイルが存在しないので、ダミーをセットする.
            call(html,
              "\"use strict\";\n(function(_g) {var app = qvue('<<ID>>').execute()})(this);");
          });
        } catch(e) {
          console.log(e);
        }
    })
    .catch(function() {
      // htmlが存在しないので、空をセット.
      phttpc.get({url: path + ".js", body: params, headers: headers})
        // result = {status: status, body: body, headers: headers}.
        .then(function(result) {
          // 取得したjsをセット."Error occurred:"
          call("", _jsParams(result.body, params));
        })
        .catch(function() {
          // エラーを設定.
          _errorPage(id, "404", "not found.");
        });
    });
}

// ページロード実行.
var _execLoadPage = function(id, src, params, title) {
  // ページロード.
  _loadPage(id, src, params, {}, function(html, js) {
    var notEnd = false;
    try {
      // 画面描画.
      var em = _$(id);
      if(em) {
        // 前回の条件が存在する場合.
        // 前回のexecuteUnloadを呼び出す.
        var bef = _idManager[id];
        if(bef) {
          bef.executeUnload();
        }
        // jsの実行.
        js = _change(js, "<<ID>>", "#" + id);
        em.innerHTML = html;
        new Function(js)();
        // タイトルセット.
        if(title) {
          setTimeout(function() {
            document.title = title;
          }, 50)
        }
      } else {
        notEnd = true;
        _errorPage(id, 500, "Error occurred:" + "id: "+ id + "does not exist");
      }
    } catch(e) {
      notEnd = true;
      _errorPage(id, 500, "Error occurred: " + e);
      console.trace(e);
    } finally {
      if(!notEnd) {
        setTimeout(function() {
          nowLoading.end();
        }, 50);
      }
    }
  });
}

// ロード処理.
o.load = function(title, src, params, id) {
  if(!id) {
    id = _QVUE_BODY_ID;
  }
  if(src.length == 0 || src[src.length-1] == "/") {
    src += "index";
  }
  // nowloadingを表示.
  if(nowLoading.isInit()) {
    nowLoading.start(function() {
      _execLoadPage(id, src, params, title);
    });
  } else {
    _execLoadPage(id, src, params, title);
  }
}

// エラーページに遷移.
o.error = function(status, message, id) {
  if(!id) {
    id = _QVUE_BODY_ID;
  }
  _errorPage(id, status, message);
}

// ＩＤに対するデータ保持.
var _idManager = {}
o.putObject = function(id, value) {
  if(id == undefined || id == null || ("" + id).length <= 0) {
    id = _QVUE_BODY_ID;
  }
  id = (id.indexOf("#") == 0) ? id.substring(1) : id;
  _idManager[id] = value
}
o.getObject = function(id) {
  if(id == undefined || id == null || ("" + id).length <= 0) {
    id = _QVUE_BODY_ID;
  }
  id = (id.indexOf("#") == 0) ? id.substring(1) : id;
  return _idManager[id]
}

// 現在のパスを取得.
o.getPath = function() {
  return nowPath;
}

return o;
})();

// vue機能.
var vueObject = (function() {
var o = {};
var DEF_DATA = null;

// 初期必須タグを設定.
var _initTags = function(id) {
  var em;
  _QVUE_BODY_ID = id;
  // bodyの表示用タグが無い場合は追加する.
  if(!_$(_QVUE_BODY_ID)) {
    em = document.createElement("div");
    em.id = _QVUE_BODY_ID;
    em.style.zIndex = BODY_ZINDEX;
    if(document.body) {
      document.body.appendChild(em);
    }
  }

  // nowLoadingの表示用タグが無い場合は追加する.
  if(!_$(_QVUE_NOW_LOADING_ID)) {
    em = document.createElement("div");
    em.id = _QVUE_NOW_LOADING_ID;
    em.style.zIndex = LOADING_ZINDEX;
    if(document.body) {
      document.body.appendChild(em);
    }
  }
  // dialogの表示用タグが無い場合は追加する.
  if(!_$(_QVUE_DIALOG_ID)) {
    em = document.createElement("div");
    em.id = _QVUE_DIALOG_ID;
    em.style.zIndex = DIALOG_ZINDEX;
    if(document.body) {
      document.body.appendChild(em);
    }
  }
}

// 初期処理.
// currentPath qvueのカレントパスを設定します.
// id デフォルトのIDを設定します.
// defData 基本データを設定します.
o.init = function(currentPath, id, defData) {
  // カレントパスをセット.
  if(currentPath && currentPath != "") {
    CURRENT_PATH = currentPath;
    if(CURRENT_PATH.indexOf("/") != 0) {
      CURRENT_PATH = "/" + CURRENT_PATH;
    }
    if(CURRENT_PATH.lastIndexOf("/") != CURRENT_PATH.length - 1) {
      CURRENT_PATH = CURRENT_PATH + "/";
    }
    // 独自のカレントパスがセットされたので、各パスを再定義.
    INIT_JS = CURRENT_PATH + BASE_PATH + _BASE_MAIN_JS;
    PAGE_PATH = CURRENT_PATH + BASE_PATH + _BASE_PAGE_DIR;
    ERROR_PAGES = CURRENT_PATH + BASE_PATH + _BASE_ERROR_DIR;
  }
  // 独自のIDが設定されている場合.
  if(!id || id == "") {
    id = _DEF_QVUE_BODY_ID;
  }
  _initTags(id);
  // 基本データをセット.
  o.setDefData(defData);
  // main.js を読み込む.
  http_client("GET", INIT_JS, null, function(_, res) {
    // 正常に読み込めた場合は、main.jsを実行する.
    new Function("\"use strict\";\n(function(_g) {" + res + "})(this);")();
  }, function(_, res){
    alert("error:" + res);
  }, true);
}

// Vuep処理.
// vue Vue({})の{}内容を定義します.
// 戻り値 : 生成情報が返却されます.
o.execute = function(v) {
  if(!(v["data"])) {
    v["data"] = {};
  }
  if((DEF_DATA)) {
    for(var k in DEF_DATA) {
      v["data"][k] = DEF_DATA[k];
    }
  }
  v["data"]["basePath"] = CURRENT_PATH + BASE_PATH;
  return new Vue(v);
}

// 基本データをセット.
// defData 基本データを設定します.
o.setDefData = function(defData) {
  DEF_DATA = defData;
  if(!(DEF_DATA)) {
      DEF_DATA = null;
  }
}

// 基本パスを取得.
o.basePath = function() {
  return CURRENT_PATH + BASE_PATH;
}

return o;
})();

// apps実行.
var apps = function(id) {
  var o = {};
  if(id == undefined || id == null || ("" + id).length <= 0) {
    id = _QVUE_BODY_ID;
  }
  id = (id.indexOf("#") == 0) ? id.substring(1) : id;
  var value = {el: "#"+id, data:{}, methods:{}};
  var baseId = id;
  var currentId = id;
  var baseTitle = "";
  var loadFunctionList = null;
  var unloadFunctionList = null;
  var vue = null;
  
  // データのクリア.
  var _clear = function() {
    baseId = null;
    currentId = null;
    baseTitle = "";
    value = null;
    vue = null;
    loadFunctionList = null;
    unloadFunctionList = null;
    unloadFunction = null;
  }

  // Vue.jsオブジェクト作成.
  o.execute = function() {
    if(vue != null) {
      return o;
    }
    // vueデータ生成.
    vue = vueObject.execute(value);
    // vueロード後の処理.
    var src = loadFunctionList;
    loadFunctionList = null;
    if(src != null) {
      setTimeout(function() {
        var len = src.length;
        for(var i = 0; i < len; i ++) {
          try {
            src[i]();
          } catch(e) {
            if(_DEBUG) console.log("load error",e);
          }
          src[i] = null;
        }
        src = null;
      },100);
    }
    // 指定IDに、現在作成したオブジェクトを保存.
    page.putObject(baseId, o);
    return o;
  }
  
  // [run]executeと同じ.
  o.run = o.execute;
  
  // データ層セット.
  o.data = function() {
    var list = arguments;
    var len = list.length;
    if(vue != null) {
      var data = vue;
      for(var i = 0; i < len; i += 2) {
        data[list[i]] = list[i+1];
      }
    } else {
      var data = value.data;
      for(var i = 0; i < len; i += 2) {
        data[list[i]] = list[i+1];
      }
    }
    return o;
  }
  
  // メソッド層セット.
  o.methods = function() {
    if(vue != null) {
      return o;
    }
    var list = arguments;
    var len = list.length;
    var methods = value.methods;
    for(var i = 0; i < len; i += 2) {
      methods[list[i]] = list[i+1];
    }
    return o;
  }
  
  // 画面描画後のロードメソッドをセット.
  o.loads = function() {
    if(vue != null) {
      return o;
    } else if(loadFunctionList == null) {
      loadFunctionList = [];
    }
    var list = arguments;
    var len = list.length;
    for(var i = 0; i < len; i ++) {
      loadFunctionList.push(list[i]);
    }
    return o;
  }
  
  // ページ移動時のunloadメソッドをセット.
  o.unloads = function() {
    if(vue != null) {
      return o;
    } else if(unloadFunctionList == null) {
      unloadFunctionList = [];
    }
    var list = arguments;
    var len = list.length;
    for(var i = 0; i < len; i ++) {
      unloadFunctionList.push(list[i]);
    }
    return o;
  }
  
  // ページタイトルをセット.
  o.title = function(title) {
    if(title != undefined && ("" + title).length > 0) {
      baseTitle = "" + title;
      setTimeout(function() {
        document.title = baseTitle;
      }, 50);
    }
    return o;
  }
  
  // カレントＩＤをセット.
  o.currentId = function(id) {
    currentId = id;
    return o;
  }
  
  // unloadメソッド実行.
  o.unload = function() {
    // unload生成.
    var src = unloadFunctionList;
    var dest = [];
    if(src == null) {
      dest = [_clear];
    } else {
      var len = src.length;
      for(var i = 0; i < len; i ++) {
        dest.push(src[i]);
        src[i] = null;
      }
      src = null;
      dest.push(_clear);
    }
    
    // unloadメソッドを実行.
    var len = dest.length;
    for(var i = 0; i < len; i ++) {
      try {
        dest[i]();
      } catch(e) {
        if(_DEBUG) console.log("unload error",e);
      }
      dest[i] = null;
    }
    return o;
  }
  
  // vueオブジェクトを取得.
  o.vue = function() {
    if(vue == null) {
      o.execute();
    }
    return vue;
  }
  
  // データを取得.
  o.get = function(name) {
    if(vue == null) {
      o.execute();
    }
    return vue[name];
  }
  
  // データセット.
  o.put = function(name, value) {
    if(vue == null) {
      o.execute();
    }
    vue[name] = value;
    return o;
  }
  
  // 実行されているかチェック.
  o.isExecute = function() {
    return vue != null;
  }
  
  // 対象のＩＤを取得.
  o.getId = function() {
    return baseId;
  }
  
  // カレントＩＤを取得.
  o.getCurrentId = function() {
    return currentId;
  }
  
  // タイトルを取得.
  o.getTitle = function() {
    return baseTitle;
  }
  
  // 現在パスを取得.
  o.getPath = function() {
    return vueObject.getPath();
  }
  return o;
}

// qvue.
var qvue = {};

// 基本処理系.
qvue.getTime = getTime;
qvue.async = async;
qvue.executionTime = executionTime;

// 環境系.
qvue.font = font;

// 機能系.
qvue.phttpc = phttpc;
qvue.json = json;
qvue.sort = sort;
qvue.Xor128 = Xor128;

// 画面系.
qvue.nowLoading = nowLoading;
qvue.fillAlpha = fillAlpha;
qvue.dialog = dialog;
qvue.page = page;

// vue命令系.
qvue.apps = apps;

// 指定IDのvueオブジェクトを取得.
qvue.current = function(id) {
  return page.getObject(id);
}

// http通信キャッシュなし条件.
//qvue.httpNoCache = function(f) {
//  if(f != _u && f != null) {
//    _HTTP_NOT_CACHE != false;
//  }
//  return _HTTP_NOT_CACHE
//}

// ページ移動.
qvue.movePage = function(title, src, params, id) {
  if(!id || id == "") {
    id = _QVUE_BODY_ID;
  }
  if(!title) {
      title = "";
  }
  page.load(title, src, params, id);
}

// エラーページ表示.
qvue.error = function(status, message, id) {
  return page.error(status, message, id);
}

// alert処理.
qvue.alert = function(text, err, id) {
  return dialog.alert(text, err, id);
}

// confirm処理.
qvue.confirm = function(text, opt, id) {
  return dialog.confirm(text, opt, id);
}

// qvue初期化処理.
qvue.init = vueObject.init;

// alert処理を乗せかえる.
//_g.alert = function(text, err, id) {
//  return dialog.alert(text, err, id);
//}

// [qvue]オブジェクトとして、設定.
_g["qvue"] = qvue;
})(this);