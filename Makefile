# ========================
# Project Makefile
# ========================

# Установка зависимостей
install:
	npm install

# -------- Development --------
dev:
	npm run dev

# -------- Production Build --------
build:
	npm run build

# -------- WordPress Build --------
wp:
	MODE=wp npm run wp

# -------- Assets Optimization --------
fonts:
	node tools/convert-fonts.js

images:
	node tools/optimize-images.js

optimize: fonts images

# -------- Cleanup --------
clean:
	rm -rf dist theme/assets
