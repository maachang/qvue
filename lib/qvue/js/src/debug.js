// デバッグ用の処理.
// モバイルアプリ系のブラウザでデバッグする場合に、便利です.
// 
//

(function(_g) {

  var _u = undefined;
  var _debugBaseId = "debug";
  var _debugId = "_debugId";
  var _debugButtonId = "_debugButtonId";
  
  var _max = 500;
  var _debugMode = false;
  var _debugList = [];
  
  // IDを取得.
  var _id = function(id) {
    return document.getElementById(id);
  }

  // イベントを取得.
  var _getEvent = function(e) {
    if(!e) {
      if(_g.event) {
        return _g.event;
      }
      return null;
    }
    return e;
  }

  // イベントセット.
  var _addEvent = function(node, name, func) {
    if(!node) {
      node = _g ; 
    } else if(typeof(node) == "string") {
      node = _id(node);
    }
    if(node.addEventListener){
      node.addEventListener(name, func, false);
    } else if(node.attachEvent){
      node.attachEvent("on"+name, func);
    }
  }

  // デバッグボタンクリック.
  var _debugButtonFunc = function(e) {
    e = _getEvent(e);
    if(e != undefined && e != null) {
      e.preventDefault();
      e.cancelBubble = true;
      e.returnValue = false ;
    }
    if(!_debugMode) {
      return false;
    }
    setTimeout(function() {
      var em = _id(_debugId);
      if(em.style.display == "none") {
        em.style.display = "block";
        _flush();
      } else {
        em.style.display = "none";
      }
    },100);
    return false;
  }

  // カラー値.
  var _dbRGBA = {r:255,g:0,b:0,a:0.5};
  var _dpRGBA = {r:127,g:127,b:127,a:0.75};

  // デバッグボタンカラーを設定.
  // r : 赤カラー値を設定します.
  // g : 緑カラー値を設定します.
  // b : 青カラー値を設定します.
  // a : 透過値を設定します(1.0 ～ 0.0).
  var _settingDebugButtonColor = function(r,g,b,a) {
    _dbRGBA.r = (r & 0x00ff)|0;
    _dbRGBA.g = (g & 0x00ff)|0;
    _dbRGBA.b = (b & 0x00ff)|0;
    _dbRGBA.a = parseFloat(a);
  }

  // デバッグパネルカラーを設定.
  // r : 赤カラー値を設定します.
  // g : 緑カラー値を設定します.
  // b : 青カラー値を設定します.
  // a : 透過値を設定します(1.0 ～ 0.0).
  var _settingDebugPanelColor = function(r,g,b,a) {
    _dpRGBA.r = (r & 0x00ff)|0;
    _dpRGBA.g = (g & 0x00ff)|0;
    _dpRGBA.b = (b & 0x00ff)|0;
    _dpRGBA.a = parseFloat(a);
  }
  
  // デバッグ画面を作成.
  var _debugView = function() {
    var buttonDisplay = _debugMode ? "block" : "none";
    var button = "<div id='"+_debugButtonId+"' style='position:absolute;" +
      "left:0px;top:0px;width:25px;height:25px;color:#000000;" +
      "background:rgba("+
        _dbRGBA.r + "," + _dbRGBA.g + "," + _dbRGBA.b + "," + _dbRGBA.a +
      ");z-index:10001;display:"+buttonDisplay+";' "+
      "></div>";
    var panel = "<div id='"+_debugId+"' style='position:absolute;" +
      "left:1%;top:1%;width:98%;height:95%;" +
      "background:rgba("+
        _dpRGBA.r + "," + _dpRGBA.g + "," + _dpRGBA.b + "," + _dpRGBA.a +
      ");z-index:10002;"+
      "color:#000000;border-radius:5px;font-size:10px;" +
      "overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;"+
      "display:none;word-break:break-all;' "+
      "></div>";
    var em = _id("debug");
    if(em == _u) {
      var em = document.createElement("div");
      em.id = _debugBaseId;
      em.style.zIndex = "10000";
      em.innerHTML = button + panel;
      document.body.appendChild(em);
    } else {
      em.innerHTML = button + panel;
    }
    // クリックイベントをセット.
    _addEvent(_id(_debugButtonId), "click", _debugButtonFunc);
    _addEvent(_id(_debugId), "click", _debugButtonFunc);
  }
  
  // デバッグ情報のクリア.
  var _clear = function() {
    _debugList = [];
    var em = _id(_debugId);
    if(em != _u) {
      em.innerHTML = "";
    }
  }
  
  // HTML表示可能な形式に変換.
  var _changeHtml = ( function() {
    var _chkCD = "&<>\'\" \r\n" ;
    return function( string ) {
      var len = string.length ;
      var chkCd = _chkCD ;
      var ret = "";
      var c,n ;
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
  
  // デバッグ内容の追加.
  var _append = function(txt) {
    if(typeof(txt) != "string") {
      txt = ""+txt;
    }
    if(_debugList.length > _max) {
      _debugList.splice(0,1);
    }
    if(txt.indexOf("\n") != -1) {
      txt = "\n" + txt;
    }
    var d = new Date();
    var h = ""+d.getHours();
    var m = ""+d.getMinutes();
    var s = ""+d.getSeconds();
    var ms = ""+d.getMilliseconds();
    _debugList[_debugList.length] = "　" +
      "00".substring(h.length) + h + ":" +
      "00".substring(m.length) + m + ":" +
      "00".substring(s.length) + s + "." +
      "000".substring(ms.length) + ms + "&nbsp;" +_changeHtml(txt);
    var em = _id(_debugId);
    if(em != _u) {
      if(em.style.display == "block") {
        _flush();
      }
    }
  }
  
  // テキスト内容をデバッグ表示に反映.
  var _flush = function() {
    var len = _debugList.length;
    var txt = "";
    for(var i = len-1; i >=0; i --) {
      txt += _debugList[i] + "<br>";
    }
    var em = _id(_debugId);
    if(em != _u) {
      em.innerHTML = txt;
      setTimeout(function() {
        _id(_debugId).scrollTop = 0;
      },50);
    }
  }
  
  var o = {};
  
  // デバッグモードをセット / 取得.
  o.mode = function(m) {
    if(m != _u) {
      _debugMode = m == true;
      var em = _id(_debugButtonId);
      if(em != _u) {
        em.style.display = _debugMode ? "block" : "none";
      }
    }
    return _debugMode;
  }
  
  // 表示最大行数をセット / 取得.
  o.maxLine = function(m) {
    m = parseInt(m)|0;
    if(m > 0) {
      if(m > 500) {
        m = 500;
      }
      _max = m;
      var b = _debugList.length
      if(b > m) {
        var ln = [];
        for(var i = b-1,j = m-1; j >= 0; i --,j--) {
          ln[j] = _debugList[i];
        }
        _debugList = ln;
      }
    }
    return _max;
  }

  // カラーを設定します.
  // type: "button" を設定した場合は、デバッグボタンのカラー値を設定します.
  //       "panel" を設定した場合は、デバッグパネルのカラー値を設定します.
  // r : 赤カラー値を設定します.
  // g : 緑カラー値を設定します.
  // b : 青カラー値を設定します.
  // a : 透過値を設定します(1.0 ～ 0.0).
  o.color = function(type, r, g, b, a) {
    if(type == "button") {
      _settingDebugButtonColor(r, g, b, a);
    } else if(type == "panel") {
      _settingDebugPanelColor(r, g, b, a);
    }
  }
  
  // 初期化処理.
  o.init = function() {
    _debugView();
  }
  
  // デバッグ情報のクリア.
  o.clear = function() {
    _clear();
  }
  
  // デバッグ情報に書き込む.
  o.out = function(txt) {
    if(_debugMode) {
      _append(txt);
    }
  }

  // デバッグモードがONかチェック.
  o.isDebug = function() {
    return _debugMode;
  }
  
  // IEかチェック.
  var isMSIE = ( /*@cc_on!@*/false ) ;// IE10まで.
  if( !isMSIE ) {
    // IE11用.
    try {
        new XDomainRequest() ;
        isMSIE = true ;
    } catch( e ) {
      try {
        new ActiveXObject("Msxml2.XMLHTTP") ;
        isMSIE = true ;
      } catch( ee ) {}
    }
    // Microsoft Edge.
    if(!isMSIE) {
      if(window.navigator.userAgent.toLowerCase().indexOf("edge") != -1) {
        isMSIE = true;
      }
    }
  }
  
  // IE以外場合.
  if(!isMSIE) {
    if(_g.console != undefined && _g.console != null) {
      // trace.
      var srcConsoleTrace = _g.console.trace;
      _g.console.trace = function(e) {
        if(e.trace) {
          try { srcConsoleTrace(e); } catch(t){};
          if(_debugMode) _append("[trace]\n" + e.stack);
        } else {
          try { srcConsoleTrace(e); } catch(t){};
          if(_debugMode) _append("[trace]\n" + e);
        }
      }
      // log.
      var srcConsoleLog = _g.console.log;
      _g.console.log = function(text) {
        try { srcConsoleLog(text); } catch(t){}
        if(_debugMode) _append(text);
      }
      // debug.
      var srcConsoleDebug = _g.console.debug;
      _g.console.debug = function(text) {
        try { srcConsoleDebug(text); } catch(t){}
        if(_debugMode) _append("[debug]" + text);
      }
      // info.
      var srcConsoleInfo = _g.console.info;
      _g.console.info = function(text) {
        try { srcConsoleInfo(text); } catch(t){}
        if(_debugMode) _append("[info ]" + text);
      }
      // warn.
      var srcConsoleWarn = _g.console.warn;
      _g.console.warn = function(text) {
        try { srcConsoleWarn(text); } catch(t){}
        if(_debugMode) _append("[warn ]" + text);
      }
      // error.
      var srcConsoleError = _g.console.error;
      _g.console.error = function(text) {
        try { srcConsoleError(text); } catch(t){}
        if(_debugMode) _append("[error]" + text);
      }
    }
    var srcAlert = _g.alert;
    _g.alert = function(n) {
      if(_debugMode) {
        console.log("[alert]"+n);
        // 例外情報が設定されている場合.
        if(arguments.length == 2) {
          var err = arguments[1];
          if(err != undefined && err.stack) {
            console.trace(err);
          }
        }
      }
      srcAlert(n);
    }
  }
  _g["debug"] = o;
  })(this);
  