// The function below is executed in the context of the inspected page!!!!!!
//CAREFUL about comments!!!

function getAttributesFromElems() {
  function isBlank(o) {
    return typeof o === "undefined" || o === null || o === "";
  }

  var attributesAndFrames = {
    attributes: [],
    frames: [],
  };

  function getAttributesOfElemAndAncestors(elem) {
    function getElemAndAncestorsList(elem) {
      var elemAndAncestors = [];
      while (elem !== undefined && elem !== null && elem.nodeName !== "HTML") {
        elemAndAncestors.push(elem);
        elem = elem.parentNode;
      }
      elemAndAncestors.reverse();
      return elemAndAncestors;
    }

    function getAttributes(elems) {
      var tagAndAttributes = [];
      for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        var tagAndAttribute = [];
        /*attributes*/
        var attrs = elem.attributes;
        for (let j = 0; j < attrs.length; j++) {
          var attr = attrs[j];
          var attrName = attr.nodeName;
          var attrValue = attr.nodeValue;
          if (attrName !== "class" && attrName !== "classname") {
            tagAndAttribute.push({ name: attrName, value: attrValue });
          }
        }
        /*clazzes*/
        var clazzList = Array.prototype.slice.call(elem.classList);
        for (let j = 0; j < clazzList.length; j++) {
          tagAndAttribute.push({ name: "class", value: clazzList[j] });
        }

        /*tag*/
        if (!isBlank(elem.tagName)) {
          tagAndAttribute.push({
            name: "tagName",
            value: elem.tagName.toLowerCase(),
          });
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

  attributesAndFrames.attributes = getAttributesOfElemAndAncestors(
    window.lastSelectedElem
  );
  return attributesAndFrames;
}

function selectElem(query, desiredMatch, visibleOnly, inspectCurrentMatch) {
  var out = {
    curMatch: 0,
    numMatch: 0,
  };
  if (query !== undefined && query != null && query.trim() !== "") {
    out.curMatch = parseInt(desiredMatch);
    inspectCurrentMatch = inspectCurrentMatch == "true";
    visibleOnly = visibleOnly == "true";
    var thisDoc = window.lastSelectedElem.ownerDocument;
    var matches = thisDoc.querySelectorAll(query);
    matches = Array.prototype.slice.call(matches);
    if (visibleOnly) {
      matches = matches.filter(function (match) {
        return isElemVisible(match);
      });
    }
    out.numMatch = matches.length;
    if (inspectCurrentMatch) {
      if (out.numMatch == 0) {
        out.curMatch = 0;
      } else if (out.numMatch < out.curMatch) {
        out.curMatch = 1;
      } else if (out.curMatch <= 0) {
        out.curMatch = out.numMatch;
      }
      if (out.curMatch > 0) {
        var match = matches[out.curMatch - 1];
        window.myInspect(match);
        match.scrollIntoViewIfNeeded();
      }
    }
  }
  return out;
}

/*
  my partial implementation (+ = implemented, - = unimplemented) of:
  http://www.w3.org/TR/webdriver/#determining-visibility
  https://github.com/SeleniumHQ/selenium/blob/34a7aee63973dc586caffe9dcd1e76a4c6701ee9/javascript/atoms/dom.js#L460
  
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
  var name = curElem.nodeName.toUpperCase();

  // todo: bug, this should halt when we get to an ancestor that is a SELECT node (or body?)
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
    rect.right + scrollX < 0 ||
    rect.bottom + scrollY < 0 ||
    rect.left + scrollX > document.documentElement.scrollWidth ||
    rect.top + scrollY > document.documentElement.scrollHeight
  ) {
    return false;
  }
  if (name === "INPUT") {
    if (curElem.getAttribute("type").toUpperCase() === "HIDDEN") {
      return false;
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

// the current build process ruins the stringification of the above functions. Let's do the stringification by hand with an online js minifier.
const getAttributesFromElemsMini =
  'function getAttributesFromElems(){var e={attributes:[],frames:[]};return e.attributes=function(e){for(var a,t=[],r=0;r<e.length;r++){for(var s=e[r],n=[],l=s.attributes,u=0;u<l.length;u++){var o=l[u],m=o.nodeName,v=o.nodeValue;"class"!==m&&"classname"!==m&&n.push({name:m,value:v})}var i=Array.prototype.slice.call(s.classList);for(u=0;u<i.length;u++)n.push({name:"class",value:i[u]});void 0!==(a=s.tagName)&&null!=a&&""!==a&&n.push({name:"tagName",value:s.tagName.toLowerCase()}),t.push(n)}return t.reverse(),t}(function(e){for(var a=[];null!=e&&"HTML"!==e.nodeName;)a.push(e),e=e.parentNode;return a.reverse(),a}(window.lastSelectedElem)),e}';
const selectElemMini =
  'function selectElem(c,t,e,r){var u={curMatch:0,numMatch:0};if(null!=c&&null!=c&&""!=c.trim()){u.curMatch=parseInt(t),r="true"==r,e="true"==e;var a=lastSelectedElem.ownerDocument.querySelectorAll(c);if(a=Array.prototype.slice.call(a),e&&(a=a.filter(function(c){return isElemVisible(c)})),u.numMatch=a.length,r&&(0==u.numMatch?u.curMatch=0:u.numMatch<u.curMatch?u.curMatch=1:u.curMatch<=0&&(u.curMatch=u.numMatch),u.curMatch>0)){var l=a[u.curMatch-1];myInspect(l),l.scrollIntoViewIfNeeded()}}return u}';
const isElemVisibleMini =
  'function isElemVisible(e){for(var t=e.nodeName.toUpperCase();"OPTION"===t||"OPTGROUP"===t;)e=e.parentNode,t=e.nodeName.toUpperCase();var o=e.getBoundingClientRect();if(o.width<=0||o.height<=0)return!1;var r=window.scrollX,n=window.scrollY;if(o.right+r<0||o.bottom+n<0||o.left+r>document.documentElement.scrollWidth||o.top+n>document.documentElement.scrollHeight)return!1;if("INPUT"===t&&"HIDDEN"===e.getAttribute("type").toUpperCase())return!1;for(;null!==e&&void 0!==e&&"HTML"!==t;){if("HIDDEN"===e.style.visibility.toUpperCase()||"NONE"===e.style.display.toUpperCase())return!1;e=e.parentNode,o=e.getBoundingClientRect(),t=e.nodeName.toUpperCase()}return!0}';

const injectStrings = [
  "var lastSelectedElem = $0; var myInspect = inspect;",
  getAttributesFromElemsMini,
  selectElemMini,
  isElemVisibleMini,
];
const InjectString = injectStrings.join(" ");
export default InjectString;
