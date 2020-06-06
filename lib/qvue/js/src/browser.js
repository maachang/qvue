// ブラウザ os 判定.
//
//

(function(_g) {
var _u = undefined;

/////////////////
// os判別関連.
/////////////////

var _ua = window.navigator.userAgent ;
var _uaLow = _ua.toLowerCase() ;
var _dms = ( document.documentElement.style.msInterpolationMode || "" ).toLowerCase() ;

var isIPHONE = _ua.match(/iPhone|iPod/) != null ;         // iphone/ipod.
var isIPAD = _ua.match(/iPad/) != null ;                  // ipad.
var isAndroid = _ua.match(/Android/) != null ;            // Android.
var isWindowsPhone = _ua.match(/Windows Phone/) != null ; // Windows Phone.

// OS取得.
var os = (function() {
  var o = {};
  // [ios]機器種別.
  o.isIOS = function() {
    return isIPHONE || isIPAD;
  }

  // [iphone]機種判別.
  o.isIphone = function() {
    return isIPHONE;
  }

  // [ipad]機種判別.
  o.isIpad = function() {
    return isIPAD;
  }
  
  // [android]機器種別.
  o.isAndroid = function() {
    return isAndroid;
  }

  // [windowsPhone]機器種別.
  o.isWindowsPhone = function() {
    return isWindowsPhone;
  }

  // タブレット情報.
  o.isTablet = function() {
    return (isIPHONE || isIPAD || isAndroid || isWindowsPhone);
  }
  
  // [PC]機器種別.
  o.isPC = function() {
    return !o.isTablet();
  }

  // OS名を取得.
  o.toString = function() {
    if(isIPHONE) {
      return "iphone";
    }
    if(isIPAD) {
      return "ipad";
    }
    if(isAndroid) {
      return "android";
    }
    if(isWindowsPhone) {
      return "windowsPhone";
    }
    return "pc";
  }
  return o;
})();

/////////////////
// ブラウザ判別.
/////////////////

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
    if(_uaLow.indexOf("edge") != -1) {
      isMSIE = true;
    }
  }
}

// ブラウザ判別.
var isOPERA = _ua.indexOf("Opera") != -1 || _ua.indexOf("OPR") != -1 ;
var isCHROME = !isOPERA && _ua.indexOf("Chrome/") != -1 ;
var isSAFARI = !isOPERA && !isCHROME && _ua.indexOf("Safari") != -1 ;
var isFIREFOX = _ua.indexOf("Mozilla/") != -1 && _uaLow.indexOf("firefox") != -1 &&
    isSAFARI == false ;

// IEのバージョンを取得.
var IE_VERSION = ( function() {
  if( isMSIE ) {
    if(typeof(_dms) == _u) {
      return 6 ;
    }
    var array = /(msie|rv:?)\s?([\d\.]+)/.exec(_uaLow);
    return (array) ? array[2]|0 : -1 ;
  }
  return -1 ;
})() ;

// iphone.ipadの場合は、ブラウザはすべてsafari設定とする.
if( isIPHONE || isIPAD ) {
  isSAFARI = true ;
  isOPERA = false ;
  isFIREFOX = false ;
  isCHROME = false ;
}
// androidの場合、chromeとsafariの両方が検知された場合は
// safariをOFFにする.
else if( isAndroid && isCHROME && isSAFARI ) {
  isSAFARI = false ;
}

var browser = (function() {
  var o = {};
  o.isMSIE = function() {
    return isMSIE;
  }
  o.ieVersion = function() {
    return IE_VERSION();
  }
  o.isOPERA = function() {
    return isOPERA;
  }
  o.isCHROME = function() {
    return isCHROME;
  }
  o.isSAFARI = function() {
    return isSAFARI;
  }
  o.isFIREFOX = function() {
    return isFIREFOX;
  }
  o.toString = function() {
    if(isMSIE) {
      return "msie(" + ieVersion() + ")";
    }
    if(isOPERA) {
      return "opera";
    }
    if(isCHROME) {
      return "chrome";
    }
    if(isSAFARI) {
      return "safari";
    }
    if(isFIREFOX) {
      return "firefox";
    }
    return "unknonw";
  }
  return o;
})();

_g.os = os;
_g.browser = browser;
})(this);