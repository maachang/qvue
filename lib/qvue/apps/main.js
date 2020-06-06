// main.js
//

// setting default title.
var _DEFAULT_TITLE = "start";

// setting debug-mode.
var _DEBUG_MODE = false;

// Debug condition initialization.
if(window["debug"]) {
  debug.mode(_DEBUG_MODE);
  debug.init();
}

// initialize nowloading.
qvue.nowLoading.init();

// Load initial page.
qvue.movePage(_DEFAULT_TITLE, "");
