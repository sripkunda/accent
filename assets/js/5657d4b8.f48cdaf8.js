"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[112],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return n?r.createElement(f,c(c({ref:t},p),{},{components:n})):r.createElement(f,c({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,c=new Array(i);c[0]=d;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var s=2;s<i;s++)c[s]=n[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8057:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return d}});var r=n(2122),a=n(9756),i=(n(7294),n(3905)),c=["components"],o={sidebar_position:2},l="Accent Syntax",s={unversionedId:"fundamentals/accent-syntax",id:"fundamentals/accent-syntax",isDocsHomePage:!1,title:"Accent Syntax",description:"Accent tries to be as simple as possible by using familiar, predictable, and consistent syntax styles throughout all libraries. The syntax style for different parts of Accent.js is outlined below.",source:"@site/docs/fundamentals/accent-syntax.md",sourceDirName:"fundamentals",slug:"/fundamentals/accent-syntax",permalink:"/docs/fundamentals/accent-syntax",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/fundamentals/accent-syntax.md",version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Modularity",permalink:"/docs/fundamentals/modularity"},next:{title:"Accent CLI",permalink:"/docs/fundamentals/accent-cli"}},p=[{value:"Directives",id:"directives",children:[{value:"Prefix",id:"prefix",children:[]},{value:"Secondary Prefix",id:"secondary-prefix",children:[]},{value:"Helper Directive",id:"helper-directive",children:[]}]},{value:"JavaScript Logic",id:"javascript-logic",children:[]},{value:"Custom HTML Tags",id:"custom-html-tags",children:[]}],u={toc:p};function d(e){var t=e.components,n=(0,a.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"accent-syntax"},"Accent Syntax"),(0,i.kt)("p",null,"Accent tries to be as simple as possible by using familiar, predictable, and consistent syntax styles throughout all libraries. The syntax style for different parts of Accent.js is outlined below."),(0,i.kt)("h2",{id:"directives"},"Directives"),(0,i.kt)("p",null,"Directives are custom attributes that can be added to HTML elements for adding complex JavaScript functionality with less code."),(0,i.kt)("h3",{id:"prefix"},"Prefix"),(0,i.kt)("p",null,"A directive prefix is the first half of an Accent directive. To avoid conflicting keywords and confusion, some libraries have different prefixes."),(0,i.kt)("p",null,"Usually, the prefix for Accent is ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-"),", with the exception of the Accent Router, which uses the ",(0,i.kt)("inlineCode",{parentName:"p"},"router-")," prefix."),(0,i.kt)("p",null,"Here is an example of an element that uses a directive. You can see the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-")," prefix in the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-bind")," directive that is being used."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<h1 ac-bind="title"></h1>\n')),(0,i.kt)("h3",{id:"secondary-prefix"},"Secondary Prefix"),(0,i.kt)("p",null,"A helper prefix adds functionality to existing directives. The prefix for secondary prefixes may vary, but usually are ",(0,i.kt)("inlineCode",{parentName:"p"},":")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"*"),". An example of this is provided below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<button ac-on *onmouseover="doSomething();" *onclick="doSomething();">\n  Click Me\n</button>\n')),(0,i.kt)("p",null,"or:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<span ac-bind :style="myStyles" :class="myClassNames">...</button>\n')),(0,i.kt)("h3",{id:"helper-directive"},"Helper Directive"),(0,i.kt)("p",null,"Helper directives add functionality to certain elements specific to Accent.js. An example of this is the ",(0,i.kt)("inlineCode",{parentName:"p"},"@subscribe")," directive, which you can read more about ",(0,i.kt)("a",{parentName:"p",href:"/docs/renderer/directives"},"here"),"."),(0,i.kt)("p",null,"The helper prefix for Accent is ",(0,i.kt)("inlineCode",{parentName:"p"},"@"),". This is generally consistent throughout all libraries."),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<ac @subscribe="myVar">...</ac>\n')),(0,i.kt)("h2",{id:"javascript-logic"},"JavaScript Logic"),(0,i.kt)("p",null,"Accent's JavaScript always uses the ",(0,i.kt)("inlineCode",{parentName:"p"},"$")," identifier to denote the start of an accent-related action. Some examples of this include ",(0,i.kt)("inlineCode",{parentName:"p"},"$router"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"$context"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"$anim"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"$directive"),", etc."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Example:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'// Initialize Accent Router\nAccent.$router({\n  home: {\n    path: "/",\n    src: "/pages/home.html",\n  },\n});\n\n// Set a variable in the body\'s context.\nAccent.$context(document.body).foo = "bar";\nconsole.log(Accent.$context(document.body).foo); // bar;\n')),(0,i.kt)("h2",{id:"custom-html-tags"},"Custom HTML Tags"),(0,i.kt)("p",null,"The syntax for Accent's custom tags maintain consistency relative to each library. For example, all Accent Components are to be denoted with ",(0,i.kt)("inlineCode",{parentName:"p"},"<component>")," and router-related tags begin with ",(0,i.kt)("inlineCode",{parentName:"p"},"router-"),"."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Example:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Accent App</title>\n  </head>\n\n  <body>\n    <my-component></my-component>\n    <router-target></router-target>\n    \x3c!-- <router-[something]> --\x3e\n    <component ref="my-component">This is Accent!</component>\n    \x3c!-- <component> --\x3e\n\n    \x3c!-- Accent.js --\x3e\n    <script src="https://unpkg.com/@accent/router"><\/script>\n    <script src="https://unpkg.com/@accent/components"><\/script>\n    <script src="https://unpkg.com/@accent/renderer"><\/script>\n  </body>\n</html>\n')))}d.isMDXComponent=!0}}]);