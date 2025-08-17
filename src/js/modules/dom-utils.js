export const isCoarsePointer = () =>
  window.matchMedia("(pointer: coarse)").matches;
export const isNoHover = () => window.matchMedia("(hover: none)").matches;

// универсальный лок/анлок скролла (совместим с нашим utilities.scss .lock)
let _scrollY = 0;
export function lockScroll() {
  _scrollY = window.scrollY || document.documentElement.scrollTop;
  document.body.style.position = "fixed";
  document.body.style.top = `-${_scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.documentElement.classList.add("lock");
}
export function unlockScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.documentElement.classList.remove("lock");
  window.scrollTo(0, _scrollY);
}

// slide helpers
export function slideUp(el, duration = 300) {
  if (!el || el.classList.contains("js-slide")) return;
  el.classList.add("js-slide");
  const startHeight = `${el.offsetHeight}px`;
  el.style.overflow = "hidden";
  el.style.height = startHeight;
  el.style.transition = `height ${duration}ms ease`;
  requestAnimationFrame(() => {
    el.style.height = "0px";
  });
  setTimeout(() => {
    el.hidden = true;
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition");
    el.classList.remove("js-slide");
  }, duration);
}

export function slideDown(el, duration = 300) {
  if (!el || el.classList.contains("js-slide")) return;
  el.classList.add("js-slide");
  el.hidden = false;
  el.style.overflow = "hidden";
  el.style.height = "0px";
  const targetHeight = `${el.offsetHeight}px`;
  el.style.transition = `height ${duration}ms ease`;
  requestAnimationFrame(() => {
    el.style.height = targetHeight;
  });
  setTimeout(() => {
    el.style.removeProperty("height");
    el.style.removeProperty("overflow");
    el.style.removeProperty("transition");
    el.classList.remove("js-slide");
  }, duration);
}

export function slideToggle(el, duration = 300) {
  if (!el) return;
  if (el.hidden || el.offsetHeight === 0) slideDown(el, duration);
  else slideUp(el, duration);
}

// wrap
export function wrap(el, wrapper) {
  if (!el || !wrapper || !el.parentNode) return;
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

// соседний элемент
export function getSibling(el, next = true) {
  const sib = next ? el?.nextElementSibling : el?.previousElementSibling;
  return sib || el;
}

// фон яркий?
export function isBackgroundBright(el) {
  const val = getComputedStyle(el).getPropertyValue("background-color");
  // rgb(a)
  const nums = val.match(/[\d.]+/g)?.map(Number) || [255, 255, 255, 1];
  const [r, g, b] = nums;
  return 0.299 * r + 0.587 * g + 0.114 * b > 127.5;
}

// позиция слайдера под табом
export function setSlider(slider, wrapper, item) {
  const wr = wrapper.getBoundingClientRect();
  const it = item.getBoundingClientRect();
  slider.style.left = `${it.left - wr.left}px`;
  slider.style.top = `${it.top - wr.top + item.offsetHeight - 1}px`;
  slider.style.width = `${it.width}px`;
}

// русская множественность через Intl
export function plural(count, forms = { one: "", few: "", many: "" }) {
  const cat = new Intl.PluralRules("ru-RU").select(count);
  switch (cat) {
    case "one":
      return forms.one;
    case "few":
      return forms.few;
    default:
      return forms.many;
  }
}
