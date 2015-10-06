
//~~~~~~~~~~~~~~~~~~~~~~~Devtools Injection~~~~~~~~~~~~~~~~~~~~~~~~~~
// chrome.runtime.onConnect.addListener(function(devToolsConnection) {
//     // assign the listener function to a variable so we can remove it later
//     var devToolsListener = function(message, sender, sendResponse) {
//         // Inject a content script into the identified tab
//         chrome.tabs.executeScript(message.tabId,
//             { file: message.scriptToInject });
//     }
//     // add the listener
//     devToolsConnection.onMessage.addListener(devToolsListener);

//     devToolsConnection.onDisconnect(function() {
//          devToolsConnection.onMessage.removeListener(devToolsListener);
//     });
// }

//~~~~~~~~~~~~~~~~~~~~~~~Content Script Comm~~~~~~~~~~~~~~~~~~~~~~~~~~
// var tabId = 
// var csPort = chrome.tabs.connect(tabId,{name: "popupToContentScript"});

// csPort.postMessage({joke: "init from content script"});

// csPort.onMessage.addListener(function(msg) {
//   console.log("Response from content script: " + msg);
// });
// console.log("setting up");

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "port1");
//   port.onMessage.addListener(function(msg) {
//     port.postMessage({aText: "got it"});
//     console.log("From content script: " + msg.aText);
//     return true;
//   });
// });

//window.setInterval(updateSched,3000);

function updateSched(){
	var req = new XMLHttpRequest();
	req.open("GET", "http://pugetsound.onebusaway.org/where/standard/stop.action?id=1_1121", true);
	req.onload = function(e){
		var res74 = [];
		var res73 = [];
		var res72 = [];
		var res71 = [];
		var page = (new window.DOMParser()).parseFromString(e.target.response, "text/xml");
		var rows = page.querySelectorAll(".arrivalsRow");
		for(var i = 0; i < rows.length; i++){
			r = rows[i];
			var route = r.querySelector(".arrivalsRouteEntry").textContent.trim();
			var time = r.querySelector(".arrivalsStatusEntry").textContent.trim();
			if(route === "74E")
				res74.push(time);
			else if(route == "73E")
				res73.push(time);
			else if(route == "72E")
				res72.push(time);
			else if(route == "71E")
				res71.push(time);
		}
		document.getElementById("74").innerHTML = "74->{" + resStrBuild(res74) + "}";
		document.getElementById("73").innerHTML = "73->{" + resStrBuild(res73) + "}";
		document.getElementById("72").innerHTML = "72->{" + resStrBuild(res72) + "}";
		document.getElementById("71").innerHTML = "71->{" + resStrBuild(res71) + "}";
	}
	req.send(null);
}
function resStrBuild(res){
	var str = "";
	if(res.length > 0)
		str = str + res[0];
	for(var i = 1 ; i < res.length; i++)
		str = str + "," + res[i];
	return str;
}

updateSched();