/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher=function(){};Object.assign(EventDispatcher.prototype,{addEventListener:function(i,t){void 0===this._listeners&&(this._listeners={});var e=this._listeners;void 0===e[i]&&(e[i]=[]),-1===e[i].indexOf(t)&&e[i].push(t)},hasEventListener:function(i,t){if(void 0===this._listeners)return!1;var e=this._listeners;return void 0!==e[i]&&-1!==e[i].indexOf(t)},removeEventListener:function(i,t){if(void 0!==this._listeners){var e=this._listeners[i];if(void 0!==e){var s=e.indexOf(t);-1!==s&&e.splice(s,1)}}},dispatchEvent:function(i){if(void 0!==this._listeners){var t=this._listeners[i.type];if(void 0!==t){i.target=this;var e=[],s=0,n=t.length;for(s=0;s<n;s++)e[s]=t[s];for(s=0;s<n;s++)e[s].call(this,i)}}}});