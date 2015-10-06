//~~~~~~~~~~~~~~~~~~~~~~~Devtools Injection~~~~~~~~~~~~~~~~~~~~~~~~~~
//Rx element from devtools:
function custInj() {
    // do something with the selected element
}

//~~~~~~~~~~~~~~~~~~~~~~~Content Script Comm~~~~~~~~~~~~~~~~~~~~~~~~~~
// var epPort = chrome.runtime.connect({name: "cs2ep"});

// epPort.postMessage("hello world");

// epPort.onMessage.addListener(function(msg) {
//   console.log(msg);
// });

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === "ep2cs");
//   port.onMessage.addListener(function(msg) {
//     console.log("sending...");
//     port.postMessage("hi2");
//     console.log(msg);
//   });
// });