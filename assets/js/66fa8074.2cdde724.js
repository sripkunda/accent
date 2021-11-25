"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[845],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(n),m=a,f=u["".concat(c,".").concat(m)]||u[m]||s[m]||i;return n?r.createElement(f,o(o({ref:t},p),{},{components:n})):r.createElement(f,o({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var d=2;d<i;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1805:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return p},default:function(){return u}});var r=n(2122),a=n(9756),i=(n(7294),n(3905)),o=["components"],l={sidebar_position:3},c="Directives",d={unversionedId:"renderer/directives",id:"renderer/directives",isDocsHomePage:!1,title:"Directives",description:"Directives are HTML attributes that allow you to control the behavior of the DOM with underlying JavaScript logic.",source:"@site/docs/renderer/directives.md",sourceDirName:"renderer",slug:"/renderer/directives",permalink:"/docs/renderer/directives",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/directives.md",version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Observables",permalink:"/docs/renderer/observables"},next:{title:"Units",permalink:"/docs/renderer/units"}},p=[{value:"Accent Directives",id:"accent-directives",children:[]},{value:"Using Directives",id:"using-directives",children:[{value:"Basic Usage",id:"basic-usage",children:[]},{value:"The Secondary Prefix",id:"the-secondary-prefix",children:[]},{value:"Helper Directives",id:"helper-directives",children:[]}]}],s={toc:p};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"directives"},"Directives"),(0,i.kt)("p",null,"Directives are HTML attributes that allow you to control the behavior of the DOM with underlying JavaScript logic."),(0,i.kt)("p",null,"Accent comes with pre-made directives that solve common problems of web applications, but custom directives with custom prefixes, behavior, and logic can be created to suit your use case."),(0,i.kt)("h2",{id:"accent-directives"},"Accent Directives"),(0,i.kt)("p",null,"Accent currently comes with a total of 10 directives. A brief overview of each directive can be found below."),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Directive"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-context"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-context"))),(0,i.kt)("td",{parentName:"tr",align:null},"Create a context group from the attributed element")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-ref"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-ref"))),(0,i.kt)("td",{parentName:"tr",align:null},"Add a reference to the attributed element in the local context group")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-bind"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-bind"))),(0,i.kt)("td",{parentName:"tr",align:null},"Create a one-way binding between the attributed element and a key in the local context group.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-model"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-model"))),(0,i.kt)("td",{parentName:"tr",align:null},"Create a two-way binding between the attributed element and a key in the local context group.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-if"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-if"))),(0,i.kt)("td",{parentName:"tr",align:null},"Hide/show the attributed element based on a boolean expression")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-show"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-show"))),(0,i.kt)("td",{parentName:"tr",align:null},"Hide/show the attributed element based on a boolean key in the local context group")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-for"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-for"))),(0,i.kt)("td",{parentName:"tr",align:null},"Render the inner content of the attributed element reactively for every key in a given iterable.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-on"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-on"))),(0,i.kt)("td",{parentName:"tr",align:null},"Add an event listener to an element with awareness of the local context.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-click"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-click"))),(0,i.kt)("td",{parentName:"tr",align:null},"Add an ",(0,i.kt)("inlineCode",{parentName:"td"},"onclick")," event listener to an element with awareness of the local context.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},(0,i.kt)("a",{parentName:"td",href:"reference/ac-submit"},(0,i.kt)("inlineCode",{parentName:"a"},"ac-submit"))),(0,i.kt)("td",{parentName:"tr",align:null},"Add an ",(0,i.kt)("inlineCode",{parentName:"td"},"onsubmit")," event listener to an element with awareness of the local context.")))),(0,i.kt)("p",null,"Click on any directive in the table above for a full reference of its functionality and syntax."),(0,i.kt)("h2",{id:"using-directives"},"Using Directives"),(0,i.kt)("h3",{id:"basic-usage"},"Basic Usage"),(0,i.kt)("p",null,"Directives are to be used on an element in your HTML code as shown below."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<body ac-context="{ foo: \'bar\' }">\n  <h1 ac-bind="foo"></h1>\n</body>\n')),(0,i.kt)("p",null,"In the example above, the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-context")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-bind")," directives were used to modify the behavior of the ",(0,i.kt)("inlineCode",{parentName:"p"},"<body>")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"<div>")," tags."),(0,i.kt)("h3",{id:"the-secondary-prefix"},"The Secondary Prefix"),(0,i.kt)("p",null,"Some directives in Accent may have a secondary prefix. These are additional attributes added to your HTML element that affects the behavior of the parent directive. A good example of this is the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-bind")," directive."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<body ac-context="{ myStyle: `background-color: \'red\';` }">\n  <h1 ac-bind :style="foo"></h1>\n</body>\n')),(0,i.kt)("p",null,"In the above example, the ",(0,i.kt)("inlineCode",{parentName:"p"},":")," functions as a secondary prefix for the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-bind")," directive."),(0,i.kt)("h3",{id:"helper-directives"},"Helper Directives"),(0,i.kt)("p",null,"Helper directives add specific functionality to particular HTML elements."),(0,i.kt)("p",null,"A good example of this is the ",(0,i.kt)("inlineCode",{parentName:"p"},"@subscribe")," directive. (The example below uses text interpolation, which you can read more about ",(0,i.kt)("a",{parentName:"p",href:"text-interpolation"},"here"),".)"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Note:")," The prefix for helper directives is ",(0,i.kt)("inlineCode",{parentName:"p"},"@"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<body ac-context="{ foo: \'bar\' }">\n  <ac @subscribe="foo">this.foo</ac>\n</body>\n')),(0,i.kt)("p",null,"Here, the ",(0,i.kt)("inlineCode",{parentName:"p"},"@subscribe")," helper directive indicates that this ",(0,i.kt)("inlineCode",{parentName:"p"},"<ac>")," tag should be recompiled by Accent every time the value of ",(0,i.kt)("inlineCode",{parentName:"p"},"foo")," in the local context changes."),(0,i.kt)("p",null,"Many directives require a conceptual understanding of ",(0,i.kt)("a",{parentName:"p",href:"units"},"units")," in Accent. For more information about a specific directive, see the reference."))}u.isMDXComponent=!0}}]);