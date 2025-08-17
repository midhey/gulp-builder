document.documentElement.classList.add("js");

// Анти-спам чекбоксов
(() => {
  document
    .querySelectorAll(".form-checkbox-none")
    .forEach((el) => (el.checked = false));
})();

const features = {
  dynamicAdapt: {
    selector: "[data-da]",
    import: () => import("./modules/dynamic-adapt.js"),
    init: (m, root) => m.init?.(root),
  },

  //
  // burger:       { selector: '[data-burger]',       import: () => import('./modules/burger.js'),       init: (m,r)=>m.init?.(r) },
  // modal:        { selector: '[data-modal-open]',   import: () => import('./modules/modal.js'),        init: (m,r)=>m.init?.(r) },
  // tabs:         { selector: '[data-tabs]',         import: () => import('./modules/tabs.js'),         init: (m,r)=>m.init?.(r) },
  // fixedHeader:  { selector: '[data-fixed-header]', import: () => import('./modules/fixed-header.js'), init: (m,r)=>m.init?.(r) },
  // form:         { selector: 'form[data-validate], form[data-ajax]', import: () => import('./modules/form.js'), init: (m,r)=>m.init?.(r) },
};

document.addEventListener("DOMContentLoaded", async () => {
  const root = document;

  for (const [name, feature] of Object.entries(features)) {
    if (root.querySelector(feature.selector)) {
      try {
        const module = await feature.import();
        feature.init?.(module, root);
      } catch (err) {
        console.error(`[Init] ${name} failed`, err);
      }
    }
  }
});
