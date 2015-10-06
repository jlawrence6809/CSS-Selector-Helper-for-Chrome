var sidebarG;
chrome.devtools.panels.elements.createSidebarPane(
    "CSS Selector",
    function(sidebar) {
	  	sidebar.setPage("sideBarBackground.html");
	  	sidebarG = sidebar;
	  	//resize
  		sidebar.onShown.addListener(function(panelWindow){

  			var resizeFunc = function(){
  				debugger;
		    	var newh = (this.document.body.getBoundingClientRect().height + 60) + "px";
		    	console.log(this.document.body.getBoundingClientRect().height);
		    	sidebar.setHeight(newh);
			}
			var resizeListener = function(event){
				console.log(event.data);
				if(event.data == "resize panel"){
					resizeFunc();
				}
			}

			resizeFunc();
  			panelWindow.onresize = resizeFunc;
  			panelWindow.addEventListener("message", resizeListener, false);
  		});
	}
);


//~~~~~~~~~~~~~~~~~~~~~~~Devtools Injection~~~~~~~~~~~~~~~~~~~~~~~~~~
// DevTools page -- devtools.js
// Create a connection to the background page
// console.log("starting...");
// var backgroundPageConnection = chrome.runtime.connect({
//     name: "devtools-page"
// });

// backgroundPageConnection.onMessage.addListener(function (msg) {
//     // Handle responses from the background page, if any
//     console.log("response: '" + msg + "'");
// 	console.log("invoking myFunc...");
// 	chrome.devtools.inspectedWindow.eval("myFunc();",{ useContentScriptContext: true });
// });

// // Relay the tab ID to the background page
// //chrome.runtime.sendMessage({
// console.log("posting message... to tab: " + chrome.devtools.inspectedWindow.tabId);
// backgroundPageConnection.postMessage({
//     tabId: chrome.devtools.inspectedWindow.tabId,
//     scriptToInject: "injectFromDevTools.js"
// });



