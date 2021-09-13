# Publish Accent.js packages

# Navigate
cd src
cd core

# Renderer
cd renderer
npm version patch
npm publish

cd .. 
# Router
cd router
npm version patch
npm publish

cd ..
# Components
cd components
npm version patch
npm publish

cd ..
# Animations
cd animate
npm version patch
npm publish