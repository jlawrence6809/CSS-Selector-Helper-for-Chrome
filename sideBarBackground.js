//debug the debugger:
//stackoverflow.com/questions/12291138/how-do-you-inspect-the-web-inspector-in-chrome
//location.reload(true)
var debug = true;

window.onload = function() {
  if (debug) console.log("Starting Css Selector");

  var curMatchRef = document.getElementById("curMatch");
  var numMatchRef = document.getElementById("numMatches");
  var buttonLoc = document.getElementById("buttonLoc");
  var onlyVisible = false;
  var currentMatch = 0;

  function getAttributesFromElemsUpdatePageAndUpdateSelector(){
    if (debug) console.log("Getting selectors");
    selectorBuilder.clearSelector();
    runHelperScript(HELPERS.GETSELECTORS, [], function(attributesAndFrames){
      if (debug) console.log(JSON.stringify(attributesAndFrames));
      updatePage(attributesAndFrames, buttonLoc, /*button callback*/ function(selectorFragment, checked, rowIdx, precedenceAsc){
        if(checked){
          selectorBuilder.addSelectorFragment(selectorFragment, rowIdx, precedenceAsc); 
        }else{
          selectorBuilder.removeSelectorFragment(selectorFragment, rowIdx, precedenceAsc);
        }
        currentMatch = 0;
        updateMatches(false);
      });
    });
  }

  function updateMatches(inspectCurrentMatch){
    runHelperScript(HELPERS.SELECT, [selectorBuilder.getSelector(), currentMatch, onlyVisible, inspectCurrentMatch], function(curAndNumMatches){
      if(debug) console.log("Results of updateMatches: " + JSON.stringify(curAndNumMatches));
      currentMatch = curAndNumMatches.curMatch;
      curMatchRef.innerHTML = (currentMatch == 0)?"-":currentMatch;
      numMatchRef.innerHTML = curAndNumMatches.numMatch;
    });
  }

  getAttributesFromElemsUpdatePageAndUpdateSelector();

  document.getElementById("getSelectorsButton").onclick = function() {
    getAttributesFromElemsUpdatePageAndUpdateSelector();
    currentMatch = 0;
    updateMatches(false);
  };

  document.getElementById("lastMatch").onclick = function() {
    currentMatch--;
    if (debug) console.log("Getting previous match (" + currentMatch + ")");
    updateMatches(true);
  };

  document.getElementById("nextMatch").onclick = function() {
    currentMatch++;
    if (debug) console.log("Getting next match (" + currentMatch + ")");
    updateMatches(true);
  };

  document.getElementById("copySel").onclick = function() {
    if (debug) console.log("Copying selectors to clipboard");
    chrome.devtools.inspectedWindow.eval('copy("' + selectorBuilder.getSelector() + '")');
  };

  document.getElementById("onlyVis").onclick = function() {
    if (debug) console.log("Toggling only visible");
    if (this.checked){
      onlyVisible = true;
    }else{
      onlyVisible = false;
    }
    currentMatch = 0;
    updateMatches(false);
  };
}

var selectorBuilder = {
  /*
  //TEST:
    selectorBuilder.addSelectorFragment('overwrite me', 0, 0);
    selectorBuilder.addSelectorFragment('b', 0, 1); 
    selectorBuilder.addSelectorFragment('c', 0, 2); 
    selectorBuilder.addSelectorFragment('d', 1, 1); 
    selectorBuilder.addSelectorFragment('e', 3, 0); 
    selectorBuilder.addSelectorFragment('a', 0, 0);
    selectorBuilder.addSelectorFragment('erase me', 3, 1); 
    selectorBuilder.removeSelectorFragment(3, 1);
    selectorBuilder.getSelector();
  */
  checkedSelectorFragments: [],
  computedSelector: "",
  addSelectorFragment: function(selectorFragment, rowIdx, precedenceAsc){
    this.defineIfNotAlready(rowIdx, precedenceAsc);
    this.checkedSelectorFragments[rowIdx][precedenceAsc].push(selectorFragment);
    this.recomputeSelector();
  },
  removeSelectorFragment: function(selectorFragment, rowIdx, precedenceAsc){
    this.defineIfNotAlready(rowIdx, precedenceAsc);
    var curFrags = this.checkedSelectorFragments[rowIdx][precedenceAsc];
    curFrags = curFrags.filter(function(val){
      return val != selectorFragment;
    });
    this.checkedSelectorFragments[rowIdx][precedenceAsc] = curFrags;
    this.recomputeSelector();
  },
  defineIfNotAlready: function(rowIdx, precedenceAsc){
    if(this.checkedSelectorFragments[rowIdx] == undefined){
      this.checkedSelectorFragments[rowIdx] = [];
    }
    if(this.checkedSelectorFragments[rowIdx][precedenceAsc] == undefined){
      this.checkedSelectorFragments[rowIdx][precedenceAsc] = [];
    }
  },
  clearSelector: function(){
    this.checkedSelectorFragments = [];
    this.computedSelector = "";
  },
  recomputeSelector: function(){
    function computeSelectorGivenFragments(checkedSelectorFragments){
      //test: computeSelectorGivenFragments([['a','b'],['c',undefined,'d'], undefined, [undefined, undefined, 'e','f',undefined], [undefined, undefined]])
      var computedSelector = "";
      checkedSelectorFragments.forEach(function(rowPrecedences){
        if(rowPrecedences != undefined){
          var addedAtLeastOne = false;
          rowPrecedences.reverse();
          rowPrecedences.forEach(function(selectorFragments){
            selectorFragments.forEach(function(selectorFragment){
              if(selectorFragment != undefined){
                computedSelector += selectorFragment;
                addedAtLeastOne = true;
              }
            });
          });
          rowPrecedences.reverse();
          if(addedAtLeastOne){
            computedSelector += " ";
          }
        }
      });
      return computedSelector.trim();
    }
    this.computedSelector = computeSelectorGivenFragments(this.checkedSelectorFragments);
  },
  getSelector: function(){
    return this.computedSelector;
  }
};

function updatePage(attributesAndFrames, buttonLoc, buttonCallbackA) {
  function createButtonFieldForAttrsFromElems(attrsFromElems, buttonCallbackB) {
   /*{"attributes":[[{"name":"id","value":"body_wrapper"},{"name":"tagName","value":"div"}],[{"name":"class","value":"agent-tools"},{"name":"class","value":"full"},{"name":"class","value":"3261424"},{"name":"class","value":"redfin"},{"name":"tagName","value":"body"}]],"frames":[]}*/
    function createToggleButtonsForAttrsFromElem(attrsFromElem, rowIdx, buttonCallbackC){
        function selectorFragmentFromAttr(attrName, attrVal){
          var selectorFragment;
          switch(attrName){
            case "tagName":
              selectorFragment = attrVal;
            break;
            case "id":
              selectorFragment = "#" + attrVal;
            break;
            case "class":
              selectorFragment = "." + attrVal;
            break;
            default:
              selectorFragment = "[" + attrName + "='" + attrVal + "']";
          }
          return selectorFragment;
        }
        function selectorFragmentPrecedenceAscFromAttrName(attrName){
          switch(attrName){
            case "tagName":
              return 3;
            break;
            case "id":
              return 2;
            break;
            case "class":
              return 1;
            break;
          }
          return 0;
        }
      function createToggleButtonForAttr(attr, roxIdx, buttonCallbackD){
        function createToggleButton(lableText, clickedCallback) {
          var input = document.createElement("input");
          var inputId = lableText + Math.round(Math.random()*100000);
          input.setAttribute("id", inputId);
          input.setAttribute("type", "checkbox");

          var label = document.createElement("label");
          label.setAttribute("for", inputId);
          label.setAttribute("unselectable", "");
          label.innerHTML = lableText;

          var button = document.createElement("td");
          button.setAttribute("class", "toggle-button");
          button.appendChild(input);
          button.appendChild(label);

          input.onclick = function(event) {
            clickedCallback(event, input, label);//.checked, event.metaKey);
          };
          // button.onmouseover = function(event){
          //   if(label.offsetWidth)
          //   console.log("hover");
          // };
          return button;
        }

        //add a "checked" field to the attr
        attr.checked = false;
        attr.metaPressed = false;

        return createToggleButton(attr.selectorFragment, function(event, input, label){
          var checked = input.checked;
          var metaPressed = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
          if(checked){
            var fragmentToAdd = attr.selectorFragment;
            if(metaPressed){
              fragmentToAdd = ":not(" + fragmentToAdd + ")";
              label.className += " notted";
            }
            label.innerHTML = fragmentToAdd;
            buttonCallbackC(fragmentToAdd, checked, rowIdx, attr.precedenceAsc);
          }else{
            var fragmentToRemove = attr.selectorFragment;
            var lastMetaPressed = attr.metaPressed;
            if(lastMetaPressed){
              fragmentToRemove = ":not(" + fragmentToRemove + ")";
              var labelClass = label.className;
              var newClass = labelClass.replace(" notted", "");
              label.setAttribute("class", newClass);
            }
            label.innerHTML = attr.selectorFragment;
            buttonCallbackC(fragmentToRemove, checked, rowIdx, attr.precedenceAsc);
          }

          attr.checked = checked;
          attr.metaPressed = metaPressed;
        });
      }

      var buttonsForAttrsWithPrecedence = [];
      attrsFromElem.forEach(function(attr){
        var attrName = attr.name;
        var attrVal = attr.value;
        var selectorFragment = selectorFragmentFromAttr(attrName, attrVal);
        var precedenceAsc = selectorFragmentPrecedenceAscFromAttrName(attrName);

        attr.selectorFragment = selectorFragment;
        attr.precedenceAsc = precedenceAsc;

        var toggleButton = createToggleButtonForAttr(attr, rowIdx, buttonCallbackC);
        buttonsForAttrsWithPrecedence.push({'precedence': precedenceAsc, 'toggleButton': toggleButton});
      });

      //lets sort by precedence to make things more visually appealing:
      buttonsForAttrsWithPrecedence.sort(function(a, b){
        return a.precedence < b.precedence;
      });

      buttonsForAttrs = [];
      buttonsForAttrsWithPrecedence.forEach(function(buttonForAttrWithPrecedence){
        buttonsForAttrs.push(buttonForAttrWithPrecedence.toggleButton);
      });

      return buttonsForAttrs;
    }

    var buttonField = document.createElement("span");

    attrsFromElems.reverse();
    attrsFromElems.forEach(function(attrsFromElem, index){
      var buttonsForAttrs = createToggleButtonsForAttrsFromElem(attrsFromElem, index, buttonCallbackB);

      //MAKE A TABLE
      var table = document.createElement('table');
      table.setAttribute('border', 1);
      var row = document.createElement('tr');

      //ADD BUTTONS
      buttonsForAttrs.forEach(function(buttonForAttr){
        row.appendChild(buttonForAttr);
      });

      //ADD ROW IF THERE WERE ANY BUTTONS CREATED
      if (row.childElementCount > 0) {
        table.appendChild(row);
        buttonField.appendChild(table);
      }
    });
    return buttonField;
  }

  if (debug) console.log("Updating page");
  var attrsFromElems = attributesAndFrames.attributes;
  var buttonField = createButtonFieldForAttrsFromElems(attrsFromElems, buttonCallbackA);

  //WRITE THE UPDATES
  buttonLoc.innerHTML = "";
  buttonLoc.appendChild(buttonField);
  tellDevtoolsToResizePanel();
}

//http://stackoverflow.com/questions/448981/what-characters-are-valid-in-css-clazz-selectors
function isValidSelector(selector) {
  if (typeof(selector) != "string")
    return false;
  if (selector.length < 2)
    return false;
  var pattern = new RegExp("^\-?[_a-zA-Z]+[_a-zA-Z0-9-]*$");

  var firstChar = selector.charAt(0);
  if (firstChar == '#' || firstChar == '.') {
    selector = selector.substring(1);
  }

  return pattern.test(selector);
}

function tellDevtoolsToResizePanel() {
  window.postMessage("resize panel", "*");
}


//HELPER SCRIPT STUFF
var HELPERS = {
  GETSELECTORS: "getAttributesFromElems",
  SELECT: "selectElem",
  GETNUMMATCHES: "getNumCssMatches"
};

function runHelperScript(script, args, callback) {
  var evalStr = "(function(){return (typeof " + script + " !== 'undefined');}());";

  chrome.devtools.inspectedWindow.eval(evalStr, function(alreadyInjected, isException) {
    if (isException) {
      if (debug) console.log("Exception when checking if " + script + " is defined:")
      if (debug) console.log(isException);
    }

    //unroll args into script
    var evalStr = "var lastSelectedElem = $0; var myInspect = inspect;";
    if (!alreadyInjected) {
      evalStr += injectString;
    }

    evalStr += script + '(';
    if (args.length > 0) evalStr += '"' + args[0] + '"';
    for (var i = 1; i < args.length; i++) {
      evalStr += ', "' + args[i] + '"';
    }
    evalStr += ');';

    console.log(evalStr);
    chrome.devtools.inspectedWindow.eval(evalStr, function(result, isException) {
      if (isException) {
        if (debug) console.log("Exception when running " + script + ":")
        if (debug) console.log(isException);
      }
      if (typeof callback === "function") {
        callback(result);
      }
    });
  });
}

//HELPFUL FUNCTIONS
function removeFromArray(arr, obj){
  var index = arr.indexOf(obj);
  if (index > -1) {
      arr.splice(index, 1);
  }
}

function isBlank(o){
  return (o == undefined || o == null || o == "");
}

function isValidSelector(selector) {
  if (typeof(selector) != "string" || selector.length < 2){
    return false;
  }
  var isValidSelectorPattern = new RegExp("^\-?[_a-zA-Z]+[_a-zA-Z0-9-]*$");
  var firstChar = selector.charAt(0);
  if (firstChar == '#' || firstChar == '.') {
    selector = selector.substring(1);
  }
  return isValidSelectorPattern.test(selector);
}