# ========================
# Project Makefile
# ========================

.PHONY: install dev build wp wp-build images fonts clean clean-deep audit help
SHELL := /bin/sh

# ---------- Help ----------
help:
	@echo "Targets:"
	@echo "  install     - npm install"
	@echo "  dev         - run dev server (gulp)"
	@echo "  build       - production build"
	@echo "  wp          - dev build for WordPress (assets only)"
	@echo "  wp-build    - production build for WordPress (assets only)"
	@echo "  images      - optimize images via gulp"
	@echo "  fonts       - convert fonts via tools/convert-fonts.js"
	@echo "  clean       - remove dist/theme assets"
	@echo "  clean-deep  - remove node_modules + lock + dist"
	@echo "  audit       - npm audit (optional)"

# ---------- Install ----------
install:
	npm install

# ---------- Development ----------
dev:
	npm run dev

# ---------- Production Build ----------
build:
	npm run build

# ---------- WordPress ----------
wp:
	npm run dev:wp

wp-build:
	npm run build:wp

# ---------- Assets ----------
fonts:
	npm run fonts:convert

# ---------- Cleanup ----------
clean:
	rm -rf dist theme/assets

# Полная чистка проекта
clean-deep:
	rm -rf node_modules package-lock.json dist theme/assets

# ---------- Misc ----------
audit:
	npm audit || true
