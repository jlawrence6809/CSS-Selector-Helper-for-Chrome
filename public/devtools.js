chrome.devtools.panels.elements.createSidebarPane(
    "CSS Selector",
    function(sidebar) {
	  	sidebar.setPage("index.html");
	  	//resize
  		// sidebar.onShown.addListener(function(panelWindow){
			// Im not sure any of this is necessary anymore
  			// var resizeFunc = function(){
		    // 	var newh = (this.document.body.getBoundingClientRect().height + 60) + "px";
		    // 	sidebar.setHeight(newh);
			// }
			// var resizeListener = function(event){
			// 	if(event.data === "resize panel"){
			// 		resizeFunc();
			// 	}
			// }
			// resizeFunc();
  			// panelWindow.onresize = resizeFunc; // causes cross origin error/warning
  			// panelWindow.addEventListener("message", resizeListener, false);
  		// });
	}
);
