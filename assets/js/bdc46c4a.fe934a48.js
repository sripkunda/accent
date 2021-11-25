"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[568],{3905:function(e,t,r){r.d(t,{Zo:function(){return b},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},b=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,b=s(e,["components","mdxType","originalType","parentName"]),p=c(r),d=a,v=p["".concat(l,".").concat(d)]||p[d]||u[d]||o;return r?n.createElement(v,i(i({ref:t},b),{},{components:r})):n.createElement(v,i({ref:t},b))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},2850:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return b},default:function(){return p}});var n=r(2122),a=r(9756),o=(r(7294),r(3905)),i=["components"],s={sidebar_position:2},l="Observables",c={unversionedId:"renderer/observables",id:"renderer/observables",isDocsHomePage:!1,title:"Observables",description:"Introduction to Reactivity",source:"@site/docs/renderer/observables.md",sourceDirName:"renderer",slug:"/renderer/observables",permalink:"/docs/renderer/observables",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/observables.md",version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/docs/renderer/intro"},next:{title:"Directives",permalink:"/docs/renderer/directives"}},b=[{value:"Introduction to Reactivity",id:"introduction-to-reactivity",children:[]},{value:"Structure of Observables",id:"structure-of-observables",children:[]},{value:"Working With Observables",id:"working-with-observables",children:[{value:"Creating an Observable",id:"creating-an-observable",children:[]},{value:"Subscribing to Observable Changes",id:"subscribing-to-observable-changes",children:[]}]}],u={toc:b};function p(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"observables"},"Observables"),(0,o.kt)("h2",{id:"introduction-to-reactivity"},"Introduction to Reactivity"),(0,o.kt)("p",null,"Many of Accent's features are based on the concept of ",(0,o.kt)("strong",{parentName:"p"},"reactivity"),". This means that when the state of your application is changed, the change will be reflected appropriately in the view (or in the DOM)."),(0,o.kt)("p",null,"An observable in Accent is just any variable that triggers another event whenever it is set, whether that is a miscellaneous JavaScript option, or a reactive element that changes in relation to the HTML DOM."),(0,o.kt)("h2",{id:"structure-of-observables"},"Structure of Observables"),(0,o.kt)("p",null,"Observables in Accent are always stored as objects with properties. Subscriptions to an observable are used to listen to changes in observable properties. Multiple subscriptions can be made to a single key in an observable."),(0,o.kt)("p",null,"Subscriptions on observables are currently one-dimensional, meaning that the keys of nested objects cannot have observable listeners linked to the parent object."),(0,o.kt)("h2",{id:"working-with-observables"},"Working With Observables"),(0,o.kt)("h3",{id:"creating-an-observable"},"Creating an Observable"),(0,o.kt)("p",null,"To create an observable, use the ",(0,o.kt)("inlineCode",{parentName:"p"},"$observable")," method."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const myObservable = Accent.$observable({\n  foo: "bar",\n  bar: "foo",\n});\n')),(0,o.kt)("p",null,"We can now access our observable using the ",(0,o.kt)("inlineCode",{parentName:"p"},"myObservable")," identifier."),(0,o.kt)("h3",{id:"subscribing-to-observable-changes"},"Subscribing to Observable Changes"),(0,o.kt)("p",null,"To subscribe to changes on an observable, we need to use the ",(0,o.kt)("inlineCode",{parentName:"p"},"$subscribe")," method. Specify the key that you want to subscribe to, followed by a function that is to be called every time the value of the specified key changes."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'myObservable.$subscribe("foo", (value) => {\n  console.log(value); // The new value of "foo"\n});\n')),(0,o.kt)("p",null,"In the example above, every time the value of ",(0,o.kt)("inlineCode",{parentName:"p"},"foo")," in ",(0,o.kt)("inlineCode",{parentName:"p"},"myObservable")," changes, the new value of ",(0,o.kt)("inlineCode",{parentName:"p"},"foo")," will be logged to the console."),(0,o.kt)("p",null,"You can also add custom data specific to each subscriber. This data can be accessed using the second parameter in your callback function."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'myObservable.$subscribe(\n  "bar",\n  (value, data) => {\n    console.log(data); // { myVariable: true }\n  },\n  {\n    myVariable: true,\n  }\n);\n')),(0,o.kt)("p",null,"Many of Accent's features, such as bindings and contexts, use observables for reactivity. However, they can also be used by themselves to implement custom logic."))}p.isMDXComponent=!0}}]);