"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[443],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,c=e.originalType,l=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),u=p(n),m=a,f=u["".concat(l,".").concat(m)]||u[m]||s[m]||c;return n?r.createElement(f,o(o({ref:t},d),{},{components:n})):r.createElement(f,o({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var c=n.length,o=new Array(c);o[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var p=2;p<c;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},135:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return d},default:function(){return u}});var r=n(2122),a=n(9756),c=(n(7294),n(3905)),o=["components"],i={sidebar_position:4},l="$context",p={unversionedId:"renderer/reference/$context",id:"renderer/reference/$context",isDocsHomePage:!1,title:"$context",description:"Create and access Accent Contexts through JavaScript.",source:"@site/docs/renderer/reference/$context.md",sourceDirName:"renderer/reference",slug:"/renderer/reference/$context",permalink:"/docs/renderer/reference/$context",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/reference/$context.md",version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"$clean",permalink:"/docs/renderer/reference/$clean"},next:{title:"$directive",permalink:"/docs/renderer/reference/$directive"}},d=[{value:"Parameters",id:"parameters",children:[]},{value:"Example",id:"example",children:[{value:"Creating Accent Contexts",id:"creating-accent-contexts",children:[]},{value:"Accessing Accent Contexts",id:"accessing-accent-contexts",children:[]}]}],s={toc:d};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,c.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h1",{id:"context"},"$context"),(0,c.kt)("p",null,"Create and access Accent Contexts through JavaScript."),(0,c.kt)("h2",{id:"parameters"},"Parameters"),(0,c.kt)("table",null,(0,c.kt)("thead",{parentName:"table"},(0,c.kt)("tr",{parentName:"thead"},(0,c.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,c.kt)("th",{parentName:"tr",align:null},"Type"),(0,c.kt)("th",{parentName:"tr",align:null},"Description"))),(0,c.kt)("tbody",{parentName:"table"},(0,c.kt)("tr",{parentName:"tbody"},(0,c.kt)("td",{parentName:"tr",align:null},"selector"),(0,c.kt)("td",{parentName:"tr",align:null},(0,c.kt)("inlineCode",{parentName:"td"},"HTMLElement")," ",(0,c.kt)("inlineCode",{parentName:"td"},"string")),(0,c.kt)("td",{parentName:"tr",align:null},"The ID of an existing Accent context or an HTML element reference of a new or existing context.")),(0,c.kt)("tr",{parentName:"tbody"},(0,c.kt)("td",{parentName:"tr",align:null},"scope"),(0,c.kt)("td",{parentName:"tr",align:null},(0,c.kt)("inlineCode",{parentName:"td"},"Object")),(0,c.kt)("td",{parentName:"tr",align:null},"The data that will be stored in the new Accent context.")),(0,c.kt)("tr",{parentName:"tbody"},(0,c.kt)("td",{parentName:"tr",align:null},"id"),(0,c.kt)("td",{parentName:"tr",align:null},(0,c.kt)("inlineCode",{parentName:"td"},"string")),(0,c.kt)("td",{parentName:"tr",align:null},"The ID of the new Accent context.")))),(0,c.kt)("h2",{id:"example"},"Example"),(0,c.kt)("h3",{id:"creating-accent-contexts"},"Creating Accent Contexts"),(0,c.kt)("p",null,"Let's create an Accent context on the ",(0,c.kt)("inlineCode",{parentName:"p"},"<body>")," element with the data ",(0,c.kt)("inlineCode",{parentName:"p"},"{ foo: 'bar' }"),". We will call this context."),(0,c.kt)("blockquote",null,(0,c.kt)("p",{parentName:"blockquote"},(0,c.kt)("strong",{parentName:"p"},"Note:")," The ",(0,c.kt)("inlineCode",{parentName:"p"},"id")," parameter is optional, even while creating Accent contexts.")),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'Accent.$context(\n  document.body,\n  {\n    foo: "bar",\n  },\n  "bodyContext"\n);\n')),(0,c.kt)("h3",{id:"accessing-accent-contexts"},"Accessing Accent Contexts"),(0,c.kt)("p",null,"To access existing Accent contexts, we will omit the ",(0,c.kt)("inlineCode",{parentName:"p"},"scope")," and ",(0,c.kt)("inlineCode",{parentName:"p"},"id")," parameters. Once accessed, the data of the context will be returned."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"Accent.$context(document.body); // { foo: 'bar' }\nAccent.$context(\"bodyContext\"); // { foo: 'bar' }\n")))}u.isMDXComponent=!0}}]);