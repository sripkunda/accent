"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[394],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return f}});var t=r(7294);function c(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){c(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,c=function(e,n){if(null==e)return{};var r,t,c={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(c[r]=e[r]);return c}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(c[r]=e[r])}return c}var l=t.createContext({}),s=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},u=function(e){var n=s(e.components);return t.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,c=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=s(r),f=c,m=d["".concat(l,".").concat(f)]||d[f]||p[f]||o;return r?t.createElement(m,a(a({ref:n},u),{},{components:r})):t.createElement(m,a({ref:n},u))}));function f(e,n){var r=arguments,c=n&&n.mdxType;if("string"==typeof e||c){var o=r.length,a=new Array(o);a[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:c,a[1]=i;for(var s=2;s<o;s++)a[s]=r[s];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},1247:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return u},default:function(){return d}});var t=r(2122),c=r(9756),o=(r(7294),r(3905)),a=["components"],i={sidebar_position:10},l="ac-click",s={unversionedId:"renderer/reference/ac-click",id:"renderer/reference/ac-click",isDocsHomePage:!1,title:"ac-click",description:"ac-click is simply an extension of the ac-on and serves as an alias to the ac-on *onclick identifier.",source:"@site/docs/renderer/reference/ac-click.md",sourceDirName:"renderer/reference",slug:"/renderer/reference/ac-click",permalink:"/docs/renderer/reference/ac-click",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/reference/ac-click.md",version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"tutorialSidebar",previous:{title:"ac-on",permalink:"/docs/renderer/reference/ac-on"},next:{title:"ac-submit",permalink:"/docs/renderer/reference/ac-submit"}},u=[{value:"Usage",id:"usage",children:[]}],p={toc:u};function d(e){var n=e.components,r=(0,c.Z)(e,a);return(0,o.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"ac-click"},"ac-click"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"ac-click")," is simply an extension of the ",(0,o.kt)("inlineCode",{parentName:"p"},"ac-on")," and serves as an alias to the ",(0,o.kt)("inlineCode",{parentName:"p"},"ac-on *onclick")," identifier."),(0,o.kt)("h3",{id:"usage"},"Usage"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Using ",(0,o.kt)("inlineCode",{parentName:"strong"},"ac-click"),":")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},"<button ac-click=\"console.log('Clicked!');\">Click Me</button>\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"strong"},"ac-on")," Equivalent:")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},"<button ac-on *onclick=\"console.log('Clicked!');\">Click Me</button>\n")))}d.isMDXComponent=!0}}]);