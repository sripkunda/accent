"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[678],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=s(n),m=a,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5048:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return d}});var r=n(2122),a=n(9756),o=(n(7294),n(3905)),i=["components"],c={sidebar_position:1},l="Modularity",s={unversionedId:"fundamentals/modularity",id:"fundamentals/modularity",isDocsHomePage:!1,title:"Modularity",description:'Accent.js is made to be modular, meaning that, unlike other frameworks, it has no true "core." It is made up of many different standalone libraries that, when put together, work together as a framework.',source:"@site/docs/fundamentals/modularity.md",sourceDirName:"fundamentals",slug:"/fundamentals/modularity",permalink:"/docs/fundamentals/modularity",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/fundamentals/modularity.md",version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Introduction",permalink:"/docs/intro"},next:{title:"Accent Syntax",permalink:"/docs/fundamentals/accent-syntax"}},p=[{value:"List of Libraries",id:"list-of-libraries",children:[]},{value:"Adding Libraries",id:"adding-libraries",children:[{value:"Using One Library",id:"using-one-library",children:[]},{value:"Adding Multiple Libraries",id:"adding-multiple-libraries",children:[]},{value:"Usage Through Modules",id:"usage-through-modules",children:[]}]}],u={toc:p};function d(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"modularity"},"Modularity"),(0,o.kt)("p",null,'Accent.js is made to be modular, meaning that, unlike other frameworks, it has no true "core." It is made up of many different standalone libraries that, when put together, work together as a framework.'),(0,o.kt)("p",null,"If you wish to only use a certain set of features for your application, you can do so by only including those libaries in your application."),(0,o.kt)("h2",{id:"list-of-libraries"},"List of Libraries"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/renderer/intro"},(0,o.kt)("strong",{parentName:"a"},"Renderer:"))," Implement reactive, state-based JavaScript logic in your application. The Renderer library also provides built-in directives (custom HTML attributes) that allow for complex JavaScript logic in your HTML code."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/router/intro"},(0,o.kt)("strong",{parentName:"a"},"Router:"))," Add client-side routing to your application to create fast single-page-applications."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/components/intro"},(0,o.kt)("strong",{parentName:"a"},"Components:"))," Create reusable components in your HTML code (compartmentalization)."),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/docs/animations/intro"},(0,o.kt)("strong",{parentName:"a"},"Animations:"))," Add state-based CSS transitions in your HTML code."),(0,o.kt)("h2",{id:"adding-libraries"},"Adding Libraries"),(0,o.kt)("h3",{id:"using-one-library"},"Using One Library"),(0,o.kt)("p",null,"Here, we are adding only the ",(0,o.kt)("strong",{parentName:"p"},"router")," library into our application."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Accent App</title>\n  </head>\n\n  <body>\n    ...\n    <script src="https://unpkg.com/@accent/router"><\/script>\n  </body>\n</html>\n')),(0,o.kt)("h3",{id:"adding-multiple-libraries"},"Adding Multiple Libraries"),(0,o.kt)("p",null,"Here, we are adding both the ",(0,o.kt)("strong",{parentName:"p"},"router")," and ",(0,o.kt)("strong",{parentName:"p"},"renderer")," libraries into our application."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Accent App</title>\n  </head>\n\n  <body>\n    ...\n    <script src="https://unpkg.com/@accent/router"><\/script>\n    <script src="https://unpkg.com/@accent/renderer"><\/script>\n  </body>\n</html>\n')),(0,o.kt)("h3",{id:"usage-through-modules"},"Usage Through Modules"),(0,o.kt)("p",null,"Accent creates one global object for all functionality across all libraries to maintain consistency and simplicity. Because of this, importing specific exports from each each library is currently not supported."),(0,o.kt)("p",null,"To use Accent through JS modules, import each library globally as shown below."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import "@accent/renderer";\nimport "@accent/router";\nimport "@accent/components";\n')),(0,o.kt)("p",null,"To access specific methods and functionality, use the global ",(0,o.kt)("inlineCode",{parentName:"p"},"Accent")," object."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import "@accent/renderer";\nimport "@accent/router";\nimport "@accent/components";\n\nAccent.$context(document.body, {\n  foo: "bar",\n});\n\n// More code ...\n')),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("strong",{parentName:"p"},"Note:")," You must use a module bundler such as ",(0,o.kt)("a",{parentName:"p",href:"https://webpack.js.org/"},"Webpack")," or ",(0,o.kt)("a",{parentName:"p",href:"https://rollupjs.org/"},"Rollup")," to import Accent.js as shown above.")),(0,o.kt)("p",null,"You can also do this in ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"},"supported browsers"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<script type="module">\n  import "https://unpkg.com/@accent/renderer";\n  import "https://unpkg.com/@accent/router";\n  import "https://unpkg.com/@accent/components";\n\n  Accent.$context(document.body, {\n    foo: "bar",\n  });\n\n  // More code ...\n<\/script>\n')))}d.isMDXComponent=!0}}]);