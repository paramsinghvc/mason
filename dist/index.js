!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react")):"function"==typeof define&&define.amd?define(["react"],t):"object"==typeof exports?exports.mason=t(require("react")):e.mason=t(e.react)}(window,(function(e){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==u.return||u.return()}finally{if(o)throw a}}return r}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(t,"__esModule",{value:!0});var o=/(<%[^%>]+%>)/g;t.processValue=function(e,t,r){if(o.test(e)){var a=e.match(o),i=e;return a&&a.forEach((function(e){var o=n(e.match(/^<%([^%>]+)%>$/)||["",""],2),a=o[0],u=o[1],c="SELF"===u?r:t[u]&&t[u].value;i=i.replace(a,"string"!=typeof c?JSON.stringify(c):c)})),i}return"string"!=typeof e?JSON.stringify(e):e},t.capitalize=function(e){return e.charAt(0).toUpperCase()+e.slice(1)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(2),a=function e(t,r,a){switch(t.type){case o.OperationType.ATOMIC:var i=n.processValue(t.leftOperand,r,a),u=n.processValue(t.rightOperand,r,a);return function(e,t,r){switch(e){case o.ComparisonOperators.EQ:return t===r;case o.ComparisonOperators.NOT_EQ:return t!==r;case o.ComparisonOperators.LT:return t<r;case o.ComparisonOperators.LTE:return t<=r;case o.ComparisonOperators.GT:return t>r;case o.ComparisonOperators.GTE:return t>=r}}(t.operator,i,u);case o.OperationType.COMPOUND:var c=e(t.leftOperand,r),s=e(t.rightOperand,r);return function(e,t,r){switch(e){case o.CompoundOperators.AND:return t&&r;case o.CompoundOperators.OR:return t||r}}(t.operator,c,s)}};t.booleanProcessor=function(e,t,r){return"boolean"==typeof e?e:a(e,t,r)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.EQ="=",e.NOT_EQ="!=",e.LT="<",e.LTE="<=",e.GT=">",e.GTE=">="}(t.ComparisonOperators||(t.ComparisonOperators={})),function(e){e.AND="&&",e.OR="||"}(t.CompoundOperators||(t.CompoundOperators={})),function(e){e.ATOMIC="ATOMIC",e.COMPOUND="COMPOUND"}(t.OperationType||(t.OperationType={})),function(e){e.REQUIRED="REQUIRED",e.REGEX="REGEX",e.CUSTOM="CUSTOM",e.RANGE="RANGE",e.LENGTH="LENGTH",e.JSON="JSON"}(t.ValidationTypes||(t.ValidationTypes={}))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){for(var r in e)t.hasOwnProperty(r)||(t[r]=e[r])}(r(4))},function(e,t,r){"use strict";function n(e){return function(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function o(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==u.return||u.return()}finally{if(o)throw a}}return r}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var u=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(t,"__esModule",{value:!0});var c=u(r(5)),s=r(6),l=r(7),p=r(1),d=r(0),f=function(e,t){var r=t.type,n=t.payload;switch(r){case"ADD_ENTRY":return Object.assign(Object.assign({},e),i({},n.id,n.props));case"UPDATE_ENTRY":return Object.assign(Object.assign({},e),i({},n.id,Object.assign(Object.assign({},e[n.id]),n.props)));case"UPDATE_PROP":if(!e[n.id])throw new Error("Invalid component id ".concat(n.id," provided for prop updation"));return Object.assign(Object.assign({},e),i({},n.id,Object.assign(Object.assign({},e[n.id]),i({},n.prop,n.value))));case"REPLACE_STATE_VALUES":for(var o=Object.assign({},e),u=0,c=Object.entries(n);u<c.length;u++){var s=a(c[u],2),l=s[0],p=s[1];o[l].value=p.value}return o;default:return e}},v=c.createContext(null);function y(e,t,r){var n=e.meta,o=e.id,a=e.children;return r&&r.get(o)?t[o]=Object.assign(Object.assign({},t[o]||{}),{value:r.get(o)}):n&&void 0!==n.value&&(t[o]=Object.assign(Object.assign({},t[o]||{}),{value:n.value})),a&&a.forEach((function(e){return y(e,t,r)})),t}var h=c.forwardRef((function(e,t){var r=e.children,n=e.initialState,o=void 0===n?{}:n,i=a(c.useReducer(f,o),2),u=i[0],s=i[1];return c.useImperativeHandle(t,(function(){return{setRootState:function(e,t){var r=y(e,Object.assign({},u),t);s({type:"REPLACE_STATE_VALUES",payload:r})}}}),[u]),c.createElement(v.Provider,{value:{state:u,dispatch:s}},r)}));t.RootComponent=c.memo(h);var O=function(){function e(t,r,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.components=new Map,this.config=t,this.elementsMap=r,this.options=n||{},this.renderConfigNode=this.renderConfigNode.bind(this),this.currentRootStateSnapshot={},this.rootComponentRef=null}var r,i,u;return r=e,(i=[{key:"renderConfigNode",value:function(e){var t=this,r=e.id,o=e.type,i=e.meta,u=void 0===i?{}:i,f=e.data,y=e.events,h=void 0===y?{}:y,O=e.validations,b=e.children,E=e.style,m=e.show,g=this.options.dataProcessors,P=void 0===g?{}:g,T=this.elementsMap.get(o);if(!T)throw new Error("No component exists for type ".concat(o));var j,R=c.memo((function(e){var n=c.useContext(v),o=n.state,i=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return function(r){var n=r.type,o=r.payload;if("UPDATE_PROP"===n&&"value"===o.prop){var a=o.value,i=o.id,u=l.validator(t,a);e({type:"UPDATE_PROP",payload:{id:i,prop:"validations",value:u}})}return e({type:n,payload:o})}}(n.dispatch,O);t.currentRootStateSnapshot=o;var d=c.useMemo((function(){return Object.entries(h).reduce((function(e,t){var n=a(t,2),u=n[0],c=n[1];return e[u]=function(e,t){Array.isArray(c)?c.forEach((function(n){s.handleEvent(n,{id:r,event:e,dataProcessors:P,value:t},i,o)})):s.handleEvent(c,{id:r,event:e,dataProcessors:P,value:t},i,o)},e}),{})}),[h,o]);c.useEffect((function(){i({type:o[r]?"UPDATE_ENTRY":"ADD_ENTRY",payload:{id:r,props:Object.assign(Object.assign(Object.assign({},u),e),{value:o[r]?o[r].value:u.value})}}),f&&s.handleEvent(f,{id:r,dataProcessors:P},i,o)}),[]);var y=c.default.useMemo((function(){return c.createElement(T,Object.assign(Object.assign({},o[r]?o[r]:Object.assign(Object.assign({},u),e)),d),e.children)}),[o[r],d]),b=void 0===m||p.booleanProcessor(m,o);return c.useEffect((function(){!b&&o[r]&&void 0!==o[r].value&&i({type:"UPDATE_PROP",payload:{id:r,prop:"value",value:u.value}})}),[b]),b?c.createElement("section",e,y):null}));return R.displayName=(j=r,"".concat(d.capitalize(j),"MasonWrapper")),c.createElement.apply(c,[R,{key:r,style:E,id:r}].concat(n(b?b.map(this.renderConfigNode):[])))}},{key:"constructInitialState",value:function(e,t){return y(e,t,this.options.initialValues)}},{key:"getCurrentValuesSnapshot",value:function(){return Object.entries(this.currentRootStateSnapshot).reduce((function(e,t){var r=a(t,2),n=r[0],o=r[1];return void 0!==o.value&&(e[n]=o.value),e}),{})}},{key:"setValue",value:function(e){this.rootComponentRef&&this.rootComponentRef.current.setRootState(this.config.config,e)}},{key:"render",value:function(){var e=this.config.config,r=this.constructInitialState(e,{});return this.rootComponentRef=c.useRef(),c.createElement(t.RootComponent,{initialState:r,ref:this.rootComponentRef},[this.renderConfigNode(e)])}}])&&o(r.prototype,i),u&&o(r,u),e}();t.ReactConfigRenderer=O},function(t,r){t.exports=e},function(e,t,r){"use strict";function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(!(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)))return;var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==u.return||u.return()}finally{if(o)throw a}}return r}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),a=r(1);t.handleEvent=function(e,t,r,i){var u=t.id,c=t.event,s=void 0===c?null:c,l=t.dataProcessors,p=t.value,d=void 0===p?void 0:p,f=e.type,v=e.when;if(v&&!1===a.booleanProcessor(v,i,d))return;switch(f){case"AJAX_CALL":var y=e.meta,h=y.endpoint,O=y.queryParams,b=y.dataProcessor,E=y.fieldId,m=y.fieldIds,g=y.credentials,P=void 0===g?"omit":g;r({type:"UPDATE_PROP",payload:{id:E||u,prop:"loading",value:!0}}),i[E||u]&&i[E||u].error&&r({type:"UPDATE_PROP",payload:{id:E||u,prop:"error",value:null}}),fetch("".concat(h,"?").concat(O?function(e,t,r){return Object.entries(e).reduce((function(e,a){var i=n(a,2),u=i[0],c=i[1];return e.push("".concat(u,"=").concat(o.processValue(c,t,r))),e}),[]).join("&")}(O,i,void 0!==d?d:s?s.target.value:null):""),{credentials:P}).then((function(e){if(e.ok)return e.json();throw e})).then((function(e){return b&&l[b]?l[b](e):e})).then((function(e){if(r({type:"UPDATE_PROP",payload:{id:E||u,prop:"loading",value:!1}}),m)for(var t=0,o=Object.entries(m);t<o.length;t++){var a=n(o[t],2),i=a[0],c=a[1];r({type:"UPDATE_PROP",payload:{id:i,prop:"datasource",value:l&&l[c]&&l[c](e)}})}else r({type:"UPDATE_PROP",payload:{id:E||u,prop:"datasource",value:e}})})).catch((function(e){r({type:"UPDATE_PROP",payload:{id:E||u,prop:"loading",value:!1}}),e instanceof Response?e.text().then((function(e){console.error("Error while fetching datasource: ",e),r({type:"UPDATE_PROP",payload:{id:E||u,prop:"error",value:e}})})):(console.error("Error while fetching datasource: ",e),r({type:"UPDATE_PROP",payload:{id:E||u,prop:"error",value:e.message}}))}));break;case"SET_DATASOURCE":var T=e.meta,j=T.data,R=T.fieldId;r({type:"UPDATE_PROP",payload:{id:R||u,prop:"datasource",value:j}});break;case"SET_VALUE":var A=e.meta,_=void 0!==A?A.value:void 0!==d?d:s?s.target.value:null;r({type:"UPDATE_PROP",payload:{id:A.fieldId||u,prop:"value",value:_}});break;default:throw new Error("No valid data type provided in config")}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2);t.validator=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0;return e.reduce((function(e,r){switch(r.type){case n.ValidationTypes.REQUIRED:e[n.ValidationTypes.REQUIRED]=""===t||null==t?"This field is required":"";break;case"REGEX":var o=r.meta.pattern;new RegExp(o).test(t)?e[n.ValidationTypes.REGEX]="":e[n.ValidationTypes.REGEX]="Field value doesn't match the pattern";break;case"LENGTH":var a=r.meta,i=a.min,u=a.max;t.length<i?e[n.ValidationTypes.LENGTH]="Minimum length of ".concat(i," is needed"):t.length>u?e[n.ValidationTypes.LENGTH]="Maximum length of ".concat(u," is allowed"):e[n.ValidationTypes.LENGTH]="";break;case"RANGE":var c=r.meta,s=c.min,l=c.max;e[n.ValidationTypes.RANGE]=t>s&&t<l?"":"The value should be in the range of ".concat(s," and ").concat(l)}return e}),{})}}])}));
//# sourceMappingURL=index.js.map