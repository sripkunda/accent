"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[612],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=i,h=d["".concat(c,".").concat(m)]||d[m]||u[m]||a;return n?r.createElement(h,o(o({ref:t},p),{},{components:n})):r.createElement(h,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5481:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return p},default:function(){return d}});var r=n(2122),i=n(9756),a=(n(7294),n(3905)),o=["components"],l={sidebar_position:5},c="Text Interpolation",s={unversionedId:"renderer/text-interpolation",id:"renderer/text-interpolation",isDocsHomePage:!1,title:"Text Interpolation",description:"Text interpolation allows you to execute JavaScript logic in your HTML with access to local units (contexts, for groups, etc.). You can use this to enable reactivity in your DOM, or to conveniently execute inline JavaScript logic.",source:"@site/docs/renderer/text-interpolation.md",sourceDirName:"renderer",slug:"/renderer/text-interpolation",permalink:"/docs/renderer/text-interpolation",editUrl:"https://github.com/sripkunda/accent/tree/master/docs/docs/renderer/text-interpolation.md",version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Units",permalink:"/docs/renderer/units"},next:{title:"$observable",permalink:"/docs/renderer/reference/$observable"}},p=[{value:"Displaying Values",id:"displaying-values",children:[{value:"Introduction",id:"introduction",children:[]},{value:"Displaying Values From Contexts",id:"displaying-values-from-contexts",children:[]},{value:"Displaying Values From <code>ac-for</code>",id:"displaying-values-from-ac-for",children:[]},{value:"Using <code>@subscribe</code> to Listen for Changes",id:"using-subscribe-to-listen-for-changes",children:[]},{value:"<code>ac</code> Attribute",id:"ac-attribute",children:[]}]}],u={toc:p};function d(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"text-interpolation"},"Text Interpolation"),(0,a.kt)("p",null,"Text interpolation allows you to execute JavaScript logic in your HTML with access to local units (contexts, for groups, etc.). You can use this to enable reactivity in your DOM, or to conveniently execute inline JavaScript logic."),(0,a.kt)("h2",{id:"displaying-values"},"Displaying Values"),(0,a.kt)("h3",{id:"introduction"},"Introduction"),(0,a.kt)("p",null,"Interpolation will automatically execute content inside of the ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"</ac>")," delimiters. Text interpolation accepts any type of JavaScript expression. In the example below, we are evaluating the sum of ",(0,a.kt)("inlineCode",{parentName:"p"},"1 + 2")," in our expression."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},"<h3>One plus two is <ac>1 + 2</ac></h3>\n")),(0,a.kt)("p",null,"Accent will replace ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>1 + 2</ac>")," with ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>3</ac>")," when the interpolation is resolved."),(0,a.kt)("h3",{id:"displaying-values-from-contexts"},"Displaying Values From Contexts"),(0,a.kt)("p",null,"Accent ensures that you have full control over your interpolation, including when it is executed or re-executed. This means that you can manually decide whether or not interpolation is reactive."),(0,a.kt)("p",null,"When accessing members in the local context, use the ",(0,a.kt)("inlineCode",{parentName:"p"},"this")," keyword."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},"<body ac-context=\"{ foo: 'bar' }\">\n  <ac>this.foo</ac>\n</body>\n")),(0,a.kt)("p",null,"In the example above, Accent will replace ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>this.foo</ac>")," with ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>bar</ac>"),"."),(0,a.kt)("h3",{id:"displaying-values-from-ac-for"},"Displaying Values From ",(0,a.kt)("inlineCode",{parentName:"h3"},"ac-for")),(0,a.kt)("p",null,"Displaying values from ",(0,a.kt)("inlineCode",{parentName:"p"},"ac-for")," loops is similar to displaying values from local contexts, except that the ",(0,a.kt)("inlineCode",{parentName:"p"},"this")," keyword can be omitted."),(0,a.kt)("h3",{id:"using-subscribe-to-listen-for-changes"},"Using ",(0,a.kt)("inlineCode",{parentName:"h3"},"@subscribe")," to Listen for Changes"),(0,a.kt)("p",null,"By default, interpolation will be executed once and ignored by the compiler forever. To add reactivity to your logic, you can use the ",(0,a.kt)("inlineCode",{parentName:"p"},"@subscribe")," helper directive. ",(0,a.kt)("inlineCode",{parentName:"p"},"@subscribe")," accepts any variables in the local context and re-executes the content in your interpolation every time one of those variables change."),(0,a.kt)("p",null,"Let's say we have a context defined with the below variables:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{ first: 1, second: 2 }\n")),(0,a.kt)("p",null,"Now, let's try to find the sum of the two numbers. Every time the value of ",(0,a.kt)("inlineCode",{parentName:"p"},"first")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"second")," changes, we need to re-execute the interpolation to display the updated sum."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},'<ac @subscribe="first, second">this.first + this.second</ac>\n')),(0,a.kt)("p",null,"Here, we separated each variable in the ",(0,a.kt)("inlineCode",{parentName:"p"},"@subscribe")," helper directive with a ",(0,a.kt)("inlineCode",{parentName:"p"},","),". To only include one variable, we would simply do:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},'<ac @subscribe="first">this.first + this.second</ac>\n')),(0,a.kt)("p",null,"Now, the interpolation will only be re-executed every time the value of ",(0,a.kt)("inlineCode",{parentName:"p"},"first")," changes. A change in the value of ",(0,a.kt)("inlineCode",{parentName:"p"},"second")," will not be reflected in the DOM."),(0,a.kt)("h3",{id:"ac-attribute"},(0,a.kt)("inlineCode",{parentName:"h3"},"ac")," Attribute"),(0,a.kt)("p",null,"As an alternative to the ",(0,a.kt)("inlineCode",{parentName:"p"},"<ac>")," tag, the ",(0,a.kt)("inlineCode",{parentName:"p"},"ac")," attribute allows for text interpolation within a specific element."),(0,a.kt)("p",null,"For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},"<p><ac>1 + 2</ac></p>\n")),(0,a.kt)("p",null,"This can be rewritten as:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html"},"<p ac>1 + 2</p>\n")),(0,a.kt)("p",null,"This shortcut helps with specific scenarios in regards to selectors and may slightly increase the speed of the DOM, especially when interpolation is commonly used throughout an application."))}d.isMDXComponent=!0}}]);