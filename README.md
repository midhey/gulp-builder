# Gulp Builder (Gulp 5 + Webpack)

Минимальная сборка для статических сайтов и тем WordPress:  
SCSS → CSS, ES6 → bundle, HTML include’ы, копирование и конвертация изображений в WebP, генерация `@font-face`, live-reload через BrowserSync.

## Требования

- Node.js ≥ 18.x
- npm (входит в Node.js)

## Установка

```bash
npm install
```

Или через Makefile:

```
make install
```

## **Быстрый старт**

Основные команды запускаются через **Makefile**:

```
make dev        # dev-сервер для статического сайта (BrowserSync, автообновление)
make build      # production-сборка в dist/

make wp         # dev-сборка ассетов для WordPress (theme/assets/)
make wp-build   # production-сборка ассетов для WordPress

make fonts      # конвертация шрифтов ttf/otf → woff/woff2 + генерация SCSS
make clean      # очистка dist/ и theme/assets
make clean-deep # очистка dist/, theme/assets, node_modules и package-lock.json
make audit      # проверка зависимостей npm audit
```

## **Структура проекта**

```
.
├─ gulp/                     # конфигурация и задачи Gulp
│  ├─ config.js              # пути src/build/wp
│  ├─ tasks/
│  │  ├─ clean.js            # очистка выходной директории
│  │  ├─ styles.js           # SCSS → CSS
│  │  ├─ scripts.js          # Webpack + Babel
│  │  ├─ html.js             # include и webp-html
│  │  └─ images.js           # копирование и WebP через sharp
│  └─ utils/bs.js            # BrowserSync instance
├─ src/
│  ├─ index.html             # точка входа HTML
│  ├─ pages/                 # внутренние страницы
│  ├─ components/blocks/     # инклюды HTML
│  ├─ js/
│  │  ├─ main.js             # entry для Webpack
│  │  └─ modules/            # модули JS
│  ├─ styles/
│  │  ├─ main.scss           # entry SCSS
│  │  ├─ base/, core/, blocks/
│  ├─ images/                # исходные изображения
│  └─ fonts/                 # исходные шрифты (ttf/otf, woff/woff2)
├─ dist/                     # результат для статического сайта
├─ theme/assets/             # результат для WordPress режима
├─ gulpfile.js               # точки входа задач
├─ tools/
│  ├─ convert-fonts.js       # конвертация шрифтов + генерация SCSS
│  └─ logger.js              # прогресс-бар
└─ package.json
```

## **Основные задачи**

### **clean**

Очистка целевой директории (dist/ или theme/assets/).

### **styles**

SCSS → CSS, autoprefixer, минификация, sourcemaps.

### **scripts**

Webpack + Babel (@babel/preset-env), alias @ → src/js, output main.min.js.

### **html**

Только для статического режима: file-include, replace, webp-html-nosvg.

В WP-режиме задача пропускается.

### **images**

- Копирование всех изображений (инкрементально).
- Конвертация растров в .webp.

### **fonts**

Копирование готовых woff/woff2.

Конвертация ttf/otf в woff/woff2 + генерация SCSS (npm run fonts:convert или make fonts).

## **Шрифты**

```
make fonts
```

- Конвертирует ttf/otf → woff/woff2
- Создает src/styles/base/\_fonts.scss с декларациями @font-face

## **SCSS структура**

- core/ — переменные, миксины, функции
- base/ — reset, утилиты, шрифты
- blocks/ — компоненты интерфейса
- Точка входа: src/styles/main.scss

## **HTML**

Главная точка: src/index.html.

Инклюды: @@include('components/blocks/header.html').

Страницы: src/pages/.

## **JavaScript**

- Точка входа: src/js/main.js
- Модули: src/js/modules/
- Динамический импорт доступен
- Alias @ → src/js

## **Переменные окружения**

- NODE_ENV=production — минификация, отключение sourcemaps
- MODE=wp — сборка ассетов только для WordPress (theme/assets/)

Примеры:

```
cross-env NODE_ENV=production gulp build
cross-env MODE=wp gulp
```

## **Browserslist**

```
"browserslist": [
  "defaults",
  "not IE 11",
  "maintained node versions"
]
```

## **Лицензия**

ISC
