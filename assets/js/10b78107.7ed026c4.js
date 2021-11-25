"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[772],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),d=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=d(e.components);return r.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},s=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),s=d(t),m=a,f=s["".concat(l,".").concat(m)]||s[m]||u[m]||i;return t?r.createElement(f,o(o({ref:n},p),{},{components:t})):r.createElement(f,o({ref:n},p))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=s;var c={};for(var l in n)hasOwnProperty.call(n,l)&&(c[l]=n[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var d=2;d<i;d++)o[d]=t[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}s.displayName="MDXCreateElement"},5898:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return p},default:function(){return s}});var r=t(2122),a=t(9756),i=(t(7294),t(3905)),o=["components"],c={sidebar_position:8},l="ac-model",d={unversionedId:"renderer/reference/ac-model",id:"renderer/reference/ac-model",isDocsHomePage:!1,title:"ac-model",description:"Create a two-way binding to an element in the local context.",source:"@site/docs/renderer/reference/ac-model.md",sourceDirName:"renderer/reference",slug:"/renderer/reference/ac-model",permalink:"/docs/renderer/reference/ac-model",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/reference/ac-model.md",version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"ac-bind",permalink:"/docs/renderer/reference/ac-bind"},next:{title:"ac-on",permalink:"/docs/renderer/reference/ac-on"}},p=[{value:"Usage",id:"usage",children:[{value:"What is a Two-Way Binding?",id:"what-is-a-two-way-binding",children:[]},{value:"Creating a Two-Way Binding",id:"creating-a-two-way-binding",children:[]}]}],u={toc:p};function s(e){var n=e.components,t=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"ac-model"},"ac-model"),(0,i.kt)("p",null,"Create a two-way binding to an element in the local context."),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("h3",{id:"what-is-a-two-way-binding"},"What is a Two-Way Binding?"),(0,i.kt)("p",null,"Simply put, a two-way binding creates an equally dependent relationship between an element in the DOM and a variable in the local context group. Unlike ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-bind"),", which is a one-way binding, ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-model")," ensures that when the content of your DOM changes, the variable in the context also changes. When the variable in the context changes, the value of the attributed element changes. The data is in-sync at all times."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("strong",{parentName:"p"},"Note:")," It is important to keep in mind that ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-model")," is only activated by user input. Changing an element's value dynamically will not trigger the binding. Currently, the only elements with the ",(0,i.kt)("inlineCode",{parentName:"p"},"oninput")," event are supported.")),(0,i.kt)("h3",{id:"creating-a-two-way-binding"},"Creating a Two-Way Binding"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Usage:")," ",(0,i.kt)("inlineCode",{parentName:"p"},'<element ac-model="name of variable in context..."></element>')),(0,i.kt)("p",null,"Let's use the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-model")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-html"},'<div ac-context="{ name: \'\' }">\n  <input type="text" ac-model="name" />\n  Hello\n  <p ac-bind="name"></p>\n  !\n</div>\n')),(0,i.kt)("p",null,"In the example above, we are displaying ",(0,i.kt)("inlineCode",{parentName:"p"},"Hello [name]")," reactively, meaning that every time the ",(0,i.kt)("inlineCode",{parentName:"p"},"name")," variable in the context changes (in this case because of the ",(0,i.kt)("inlineCode",{parentName:"p"},"ac-model"),"), the ",(0,i.kt)("inlineCode",{parentName:"p"},"<p>")," tag's content will also be changed."))}s.isMDXComponent=!0}}]);