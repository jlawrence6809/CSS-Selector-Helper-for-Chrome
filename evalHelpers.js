// The function below is executed in the context of the inspected page!!!!!!
//CAREFUL about comments!!!

function getAttributesFromElems() {
  function isBlank(o){
    return (o == undefined || o == null || o == "");
  }

  var attributesAndFrames = {
    attributes: [],
    frames: []
  };

  function getAttributesOfElemAndAncestors(elem) {
    function getElemAndAncestorsList(elem){
      var elemAndAncestors = [];
      while (elem !== undefined && elem !== null && elem.nodeName !== 'HTML') {
        elemAndAncestors.push(elem);
        elem = elem.parentNode;
      }
      elemAndAncestors.reverse();
      return elemAndAncestors;
    }

    function getAttributes(elems){
      var tagAndAttributes = [];
      for(var i = 0; i < elems.length; i++){
        var elem = elems[i];
        var tagAndAttribute = [];
        /*attributes*/
        var attrs = elem.attributes;
        for(var j = 0; j < attrs.length; j++){
          var attr = attrs[j];
          var attrName = attr.nodeName;
          var attrValue = attr.nodeValue;
          if(attrName != "class" && attrName != "classname"){
            tagAndAttribute.push({name: attrName, value: attrValue});
          }
        }
        /*clazzes*/
        var clazzList = Array.prototype.slice.call(elem.classList);
        for(var j = 0; j < clazzList.length; j++){
          tagAndAttribute.push({name: "class", value: clazzList[j]});
        }
        
        /*tag*/
        if(!isBlank(elem.tagName)){
          tagAndAttribute.push({name: "tagName", value: elem.tagName.toLowerCase()});
        }
        /*add*/
        tagAndAttributes.push(tagAndAttribute);
      }
      tagAndAttributes.reverse();
      return tagAndAttributes;
    }

    var elemAndAncestors = getElemAndAncestorsList(elem);
    var attributesOfElemAndAncestors = getAttributes(elemAndAncestors);

    return attributesOfElemAndAncestors;
  }

  attributesAndFrames.attributes = getAttributesOfElemAndAncestors(lastSelectedElem);
  return attributesAndFrames;
}

function selectElem(query, desiredMatch, visibleOnly, inspectCurrentMatch) {
  var out = {
    curMatch: 0,
    numMatch: 0
  };
  if(query != undefined && query != null && query.trim() != ""){
    out.curMatch = parseInt(desiredMatch);
    inspectCurrentMatch = inspectCurrentMatch == 'true';
    visibleOnly = visibleOnly == 'true';
    var thisDoc = lastSelectedElem.ownerDocument;
    var matches = thisDoc.querySelectorAll(query);
    matches = Array.prototype.slice.call(matches);
    if(visibleOnly){
      matches = matches.filter(function(match){
        return isElemVisible(match);
      });
    }
    out.numMatch = matches.length;
    if(inspectCurrentMatch){
      if(out.numMatch == 0){
        out.curMatch = 0;
      }else if(out.numMatch < out.curMatch){
        out.curMatch = 1;
      }else if(out.curMatch <= 0){
        out.curMatch = out.numMatch;
      }
      if(out.curMatch > 0){
        var match = matches[out.curMatch-1];
        myInspect(match);
        match.scrollIntoViewIfNeeded();
      }
    }
  }
  return out;
}

//eval methods


/*
my partial implementation (+ = implemented, - = unimplemented) of:
http://www.w3.org/TR/webdriver/#determining-visibility

+OPTIONs and OPTGROUP elements are treated as special cases, they are
  considered shown if and only if the enclosing select element is visible.

+The element must have a height and width greater than 0px.

+The element must not be visible if there is a CSS3 Transform property that
  moves the element out of the viewport and can not be scrolled to.

+Any INPUT elements of "type=hidden" are not visible

+The element must not be visible if that element, or any of its ancestors,
  is hidden or has a CSS display property that is none.

-MAP elements are shown if and only if the image it uses is visible. Areas
  within a map are shown if the enclosing MAP is visible.

-Any NOSCRIPT elements must not be visible if Javascript is enabled.

-The element must not be visible if any ancestor in the element's transitive
  closure of offsetParents has a fixed size, and has the CSS style of "overflow:hidden",
  and the element's location is not within the fixed size of the parent.

*/
function isElemVisible(curElem) {
  /*
  Minified:
  function isElemVisible(e){for(var t=e.nodeName.toUpperCase();"OPTION"===t||"OPTGROUP"===t;)e=e.parentNode,t=e.nodeName.toUpperCase();var o=e.getBoundingClientRect();if(o.width<=0||o.height<=0)return!1;var r=window.scrollX,n=window.scrollY;if(o.right+r<0||o.bottom+n<0||o.left+r>document.documentElement.scrollWidth||o.top+n>document.documentElement.scrollHeight)return!1;if("INPUT"===t&&"HIDDEN"===e.getAttribute("type").toUpperCase())return!1;for(;null!==e&&void 0!==e&&"HTML"!==t;){if("HIDDEN"===e.style.visibility.toUpperCase()||"NONE"===e.style.display.toUpperCase())return!1;e=e.parentNode,o=e.getBoundingClientRect(),t=e.nodeName.toUpperCase()}return!0}
  */
  var name = curElem.nodeName.toUpperCase();

  while (name === "OPTION" || name === "OPTGROUP") {
    curElem = curElem.parentNode;
    name = curElem.nodeName.toUpperCase();
  }
  var rect = curElem.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return false;
  }
  var scrollX = window.scrollX;
  var scrollY = window.scrollY;
  if (
    (rect.right + scrollX) < 0 || (rect.bottom + scrollY) < 0 || (rect.left + scrollX) > document.documentElement.scrollWidth || (rect.top + scrollY) > document.documentElement.scrollHeight
  ) {
    return false;
  }
  if (name === "INPUT") {
    if (curElem.getAttribute("type").toUpperCase() === "HIDDEN") {
      return false
    }
  }
  while (curElem !== null && curElem !== undefined && name !== "HTML") {
    if (
      curElem.style.visibility.toUpperCase() === "HIDDEN" ||
      curElem.style.display.toUpperCase() === "NONE"
    ) {
      return false;
    }
    curElem = curElem.parentNode;
    rect = curElem.getBoundingClientRect();
    name = curElem.nodeName.toUpperCase();
  }
  return true;
}

var injectString = "var lastSelectedElem = $0; var myInspect = inspect; ";
injectString = injectString + getAttributesFromElems + " ";
injectString = injectString + selectElem + " ";
injectString = injectString + isElemVisible + " ";


//OLD STUFF FOR IFRAMES:
/*
  var thisView = lastSelectedElem.ownerDocument.defaultView;
  var i = 0;
  while (thisView !== window) {
    var frameElemInfo = {
      "frameElemId": null,
      "frameElemclazzLists": [],
      "crossDomainError": false,
      "elemNotFound": false
    };
    out.frameElemInfoArray[i] = frameElemInfo;

    var parentView = null;
    var parentIframes = null;

    var noError = false;
    try {
      parentView = thisView.parent;
      parentIframes = parentView.document.getElementsByTagName("IFRAME");
      noError = true;
    } catch (err) {}

    if (noError === false) {
      frameElemInfo.crossDomainError = true;
      frameElemInfo.elemNotFound = null;
      break;
    }

    var thisFramesElem = null;
    for (var j = 0; j < parentIframes.length; j++) {
      noError = false;
      var tmpDoc;
      try {
        tmpDoc = parentIframes[j].contentDocument;
        noError = true;
      } catch (err) {}

      if (noError && tmpDoc.defaultView === thisView) {
        thisFramesElem = parentIframes[j];
        break;
      }
    }

    if (thisFramesElem === null) {
      frameElemInfo.elemNotFound = true;
      break;
    } else {
      frameElemInfo.frameElemId = thisFramesElem.id;
      frameElemInfo.frameElemclazzLists = getSelectorListsForElem(thisFramesElem);
    }

    thisView = parentView;
    i++;
  }

  function getFrameAndAncestorsList(elem){
    var frameAndAncestors = [];
    var thisView = elem.ownerDocument.defaultView;
    while (thisView !== window) {
      frameAndAncestors.push(thisView);
      thisView = thisView.parent;
    }
    frameAndAncestors.push(thisView);
    frameAndAncestors.reverse();
    return frameAndAncestors;
  }
  */