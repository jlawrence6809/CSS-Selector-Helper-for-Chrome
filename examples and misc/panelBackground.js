

// function init() {

//   addon.port.on("printThis", function(str){
//   	console.log("Told to print: " + str);
//   });


// addon.port.on("classLists", function (classLists){
//   	console.log("hi");
//   	classLists = classListsFixer(classLists);

//   	//delete all children of body
//   	var children = document.body.children;
//   	for(var i = children.length; i > 0; i--){
//   		document.body.removeChild(children[0]);
//   	}

//   	for(var i = classLists.length - 1; i >= 0; i--){
//   		//var tmpA = document.createElement('a');
//   		var tmpA = document.createElement('a');
//   		tmpA.innerHTML = "{";
//   		document.body.appendChild(tmpA);

//   		for(var j = classLists[i].length - 1; j >= 0; j--){

//   			var mxButton = document.createElement("a");
//   			mxButton.setAttribute("class", "mx-button");
//   			var mxInput = document.createElement("input");
//   			mxInput.setAttribute("type", "checkbox");
//   			mxInput.setAttribute("name", "mx");
//   			mxInput.setAttribute("id", classLists[i][j] + "," + i + "," + j);
//   			var mxLabel = document.createElement("label");
//   			mxLabel.setAttribute("for", classLists[i][j] + "," + i + "," + j);
//   			mxLabel.setAttribute("unselectable", "");
//   			mxLabel.innerHTML = "." + classLists[i][j] + " ";
//   			mxButton.appendChild(mxInput);
//   			mxButton.appendChild(mxLabel);
//   			document.body.appendChild(mxButton);


//   			// tmpA.innerHTML = "." + classLists[i][j] + " ";
//   			// tmpA.setAttribute("color","black");
//   			// tmpA.onclick = function(){
//   			// 	if(tmpA.getAttribute("color") == "black"){
//   			// 		tmpA.setAttribute("color","red");
//   			// 	}else{
//   			// 		tmpA.setAttribute("color", "black");
//   			// 	}
//   			// }
//   			// document.body.appendChild(tmpA);
//   		}

//   		tmpA = document.createElement('a');
//   		tmpA.innerHTML = "}";
//   		document.body.appendChild(tmpA);
//   	}
//   });
// }


// //turns funky object into array of arrays
// function classListsFixer(classLists){
// 	var out = [];
// 	for(var i = 0; i < classLists.length; i++){
// 		out[i] = [];
// 		var j = 0;
// 		while(classLists[i][j] != null){
// 			out[i][j] = classLists[i][j];
// 			j++;
// 		}
// 	}
// 	return out;
// }