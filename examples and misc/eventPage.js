// //~~~~~~~~~~~~~~~~~~~~~~~Devtools Injection~~~~~~~~~~~~~~~~~~~~~~~~~~

// Background page -- background.js
// chrome.runtime.onConnect.addListener(function(devToolsConnection) {
// 	console.log(devToolsConnection.name);
//     // assign the listener function to a variable so we can remove it later
//     var devToolsListener = function(message, sender, sendResponse) {
//         // Inject a content script into the identified tab
//         console.log("excecuting script... " + message.scriptToInject);
//         chrome.tabs.executeScript(message.tabId,
//             { file: message.scriptToInject }, 
//             function(result){
// 		        devToolsConnection.postMessage("sent: " + message.scriptToInject);
// 		        console.log("got: " + result);
// 		        console.log("disconnecting...");
// 		        devToolsConnection.onMessage.removeListener(devToolsListener);
//             });
//     }
//     // add the listener
//     console.log("adding listener");
//     devToolsConnection.onMessage.addListener(devToolsListener);
// });
//~~~~~~~~~~~~~~~~~~~~~~~Content Script Comm~~~~~~~~~~~~~~~~~~~~~~~~~~
//get tabs
// function getCurrentTab(callback){
// 	chrome.tabs.query({
// 			active:true,
// 			//currentWindow:true
// 		},
// 		function(tabs){
// 			var thisTab;
// 			if(tabs.length === 0){
// 				thisTab = null;
// 				console.log("No active, current tabs found.");
// 			}else{
// 				if(tabs.length !== 1){
// 					console.log("More than one active, current tab found.");
// 				}
// 				thisTab = tabs[0];
// 			}
// 			callback(thisTab);
// 	});
// }
// //Setup outgoing connection, callback
// getCurrentTab(function(thisTab){
// 	var csPort = chrome.tabs.connect(thisTab.id,{name: "ep2cs"});
// 	console.log("sending...");
// 	csPort.postMessage("hello world2");

// 	csPort.onMessage.addListener(function(msg){
// 		console.log(msg);
// 	});
// });

// //listen for incoming connection
// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name == "cs2ep");
//   port.onMessage.addListener(function(msg) {
//   	port.postMessage("hi");
//     console.log(msg);
//   });
// });

