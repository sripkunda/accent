# Minify built versions of Accent.js

# Navigate
cd src
cd core

# Renderer
cd renderer
uglifyjs renderer.js -o renderer.min.js

cd .. 
# Router
cd router
uglifyjs router.js -o router.min.js

cd ..
# Components
cd components
uglifyjs components.js -o components.min.js

cd ..
# Animations
cd animate
uglifyjs animate.js -o animate.min.js