# Build Accent.js with rollup

# Navigate
cd src
cd core

# Renderer
cd renderer
rollup renderer.accent.js --file renderer.js -f umd -n "Accent"

cd .. 
# Router
cd router
rollup router.accent.js --file router.js -f umd -n "Accent"

cd ..
# Components
cd components
rollup components.accent.js --file components.js -f umd -n "Accent"

cd ..
# Animations
cd animate
rollup animate.accent.js --file animations.js -f umd -n "Accent"