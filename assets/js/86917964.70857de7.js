"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[419],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),m=s(n),d=a,f=m["".concat(l,".").concat(d)]||m[d]||u[d]||o;return n?r.createElement(f,i(i({ref:t},p),{},{components:n})):r.createElement(f,i({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2401:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var r=n(2122),a=n(9756),o=(n(7294),n(3905)),i=["components"],c={sidebar_position:1},l="Introduction",s={unversionedId:"animations/intro",id:"animations/intro",isDocsHomePage:!1,title:"Introduction",description:"Getting Started",source:"@site/docs/animations/intro.md",sourceDirName:"animations",slug:"/animations/intro",permalink:"/docs/animations/intro",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/animations/intro.md",version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Paths",permalink:"/docs/router/paths"},next:{title:"Creating Animations",permalink:"/docs/animations/creating-animations"}},p=[{value:"Getting Started",id:"getting-started",children:[{value:"What is an Accent Animate?",id:"what-is-an-accent-animate",children:[]}]},{value:"Installation",id:"installation",children:[]}],u={toc:p};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"introduction"},"Introduction"),(0,o.kt)("h2",{id:"getting-started"},"Getting Started"),(0,o.kt)("h3",{id:"what-is-an-accent-animate"},"What is an Accent Animate?"),(0,o.kt)("p",null,"Accent animations can be used to create state-based CSS logic for a set of elements. This means that CSS properties of multiple elements can be managed at once to create a manageable set of stylistic attributes for your web elements. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<p id="p1">make me red</p>\n<p id="p2">and me too!</p>\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'// ... \n\nconst p1 = document.getElementById("p1"); \nconst p2 = document.getElementById("p2")\n\nconst Red = Accent.$animate(p1, "red", {\n    red: {\n        color: "red"\n    }, \n    none: {\n        color: "",\n    }\n}); \n\nRed.apply(p2);\n')),(0,o.kt)("p",null,"The library integrates seamlessly with all other Accent modules. "),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"Install the animate library with NPM or by CDN:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npm install @accent/animate\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<script src="https://unpkg.com/@accent/animate"><\/script>\n')))}m.isMDXComponent=!0}}]);