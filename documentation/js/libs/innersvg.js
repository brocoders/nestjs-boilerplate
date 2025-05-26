/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Minor modifications by Chris Price to only polyfill when required.
 */
!function(e){if(e&&!("innerHTML"in e.prototype)){var t=function(e,r){var i=e.nodeType;if(3==i)r.push(e.textContent.replace(/&/,"&amp;").replace(/</,"&lt;").replace(">","&gt;"));else if(1==i){if(r.push("<",e.tagName),e.hasAttributes())for(var n=e.attributes,s=0,o=n.length;s<o;++s){var a=n.item(s);r.push(" ",a.name,"='",a.value,"'")}if(e.hasChildNodes()){r.push(">");for(var h=e.childNodes,s=0,o=h.length;s<o;++s)t(h.item(s),r);r.push("</",e.tagName,">")}else r.push("/>")}else{if(8!=i)throw"Error serializing XML. Unhandled node of type: "+i;r.push("\x3c!--",e.nodeValue,"--\x3e")}};Object.defineProperty(e.prototype,"innerHTML",{get:function(){for(var e=[],r=this.firstChild;r;)t(r,e),r=r.nextSibling;return e.join("")},set:function(e){for(;this.firstChild;)this.removeChild(this.firstChild);try{var t=new DOMParser;t.async=!1,sXML="<svg xmlns='http://www.w3.org/2000/svg'>"+e+"</svg>";for(var r=t.parseFromString(sXML,"text/xml").documentElement.firstChild;r;)this.appendChild(this.ownerDocument.importNode(r,!0)),r=r.nextSibling}catch(e){throw new Error("Error parsing XML string")}}})}}((0,eval)("this").SVGElement);