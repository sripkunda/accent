"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[463],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),s=p(n),m=a,f=s["".concat(l,".").concat(m)]||s[m]||u[m]||o;return n?r.createElement(f,c(c({ref:t},d),{},{components:n})):r.createElement(f,c({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=s;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var p=2;p<o;p++)c[p]=n[p];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},3949:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return d},default:function(){return s}});var r=n(2122),a=n(9756),o=(n(7294),n(3905)),c=["components"],i={sidebar_position:6},l="ac-context",p={unversionedId:"renderer/reference/ac-context",id:"renderer/reference/ac-context",isDocsHomePage:!1,title:"ac-context",description:"Create Accent contexts on an HTML element using markup.",source:"@site/docs/renderer/reference/ac-context.md",sourceDirName:"renderer/reference",slug:"/renderer/reference/ac-context",permalink:"/docs/renderer/reference/ac-context",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/reference/ac-context.md",version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"$directive",permalink:"/docs/renderer/reference/$directive"},next:{title:"ac-bind",permalink:"/docs/renderer/reference/ac-bind"}},d=[{value:"Usage",id:"usage",children:[{value:"Basic Usage",id:"basic-usage",children:[]},{value:"Helper Directives",id:"helper-directives",children:[]}]}],u={toc:d};function s(e){var t=e.components,n=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"ac-context"},"ac-context"),(0,o.kt)("p",null,"Create Accent contexts on an HTML element using markup."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("h3",{id:"basic-usage"},"Basic Usage"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},'<element ac-context="{ your data... }"></element>')),(0,o.kt)("p",null,"Let's make an Accent context with the data ",(0,o.kt)("inlineCode",{parentName:"p"},"{ foo: 'bar' }")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},"<body ac-context=\"{ foo: 'bar' }\">\n  \x3c!-- ... --\x3e\n</body>\n")),(0,o.kt)("h3",{id:"helper-directives"},"Helper Directives"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Directive"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"@id")),(0,o.kt)("td",{parentName:"tr",align:null},"The ID of the context")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"@extends")),(0,o.kt)("td",{parentName:"tr",align:null},"The parent context for the newly created context (context inheritance)")))),(0,o.kt)("p",null,"Below is an example of context inheritance with an assigned context ID. This can be done with the helper directives above."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<body ac-context="{ foo: \'bar\' }" @id="bodyContext">\n  <div ac-context="{ bar: \'baz\' }" @extends="bodyContext" @id="secondContext">\n    \x3c!-- ... --\x3e\n  </div>\n</body>\n')),(0,o.kt)("p",null,"In the example above, ",(0,o.kt)("inlineCode",{parentName:"p"},"secondContext")," inherits all properties of ",(0,o.kt)("inlineCode",{parentName:"p"},"bodyContext"),", meaning that the context scope of ",(0,o.kt)("inlineCode",{parentName:"p"},"secondContext")," is now ",(0,o.kt)("inlineCode",{parentName:"p"},"{ foo: 'bar', bar: 'baz' }"),"."))}s.isMDXComponent=!0}}]);