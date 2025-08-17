// data-da="selector,breakpoint,place[,scopeSelector]"
// place: "first" | "last" | <number>
// type: 'max' | 'min' — как у тебя (по умолчанию 'max')
// Example: <div data-da=".target,991,2,.scope"></div>

function parseDA(value) {
  const [sel, bp, place, scope] = value
    .split(",")
    .map((s) => s?.trim())
    .filter(Boolean);
  return {
    selector: sel,
    breakpoint: Number(bp || 767),
    place: place ?? "last",
    scope: scope || null,
  };
}

function indexInParent(parent, el) {
  return Array.prototype.indexOf.call(parent.children, el);
}

function sortObjects(arr, type) {
  arr.sort((a, b) => {
    if (a.breakpoint === b.breakpoint) {
      const pa = a.place,
        pb = b.place;
      if (pa === pb) return 0;
      if (pa === "first" || pb === "last") return type === "min" ? -1 : 1;
      if (pa === "last" || pb === "first") return type === "min" ? 1 : -1;
      // числовое место
      return type === "min" ? Number(pa) - Number(pb) : Number(pb) - Number(pa);
    }
    return type === "min"
      ? a.breakpoint - b.breakpoint
      : b.breakpoint - a.breakpoint;
  });
}

function resolveDestination({ selector, scope }) {
  if (!selector) return null;
  if (scope) {
    const host = document.querySelector(scope);
    return host ? host.querySelector(selector) : null;
  }
  return document.querySelector(selector);
}

function moveTo(place, el, dest) {
  el.classList.add("dynamic-adaptiv");
  if (!dest) return;
  const count = dest.children.length;
  if (place === "last" || Number(place) >= count) {
    dest.insertAdjacentElement("beforeend", el);
    return;
  }
  if (place === "first") {
    dest.insertAdjacentElement("afterbegin", el);
    return;
  }
  dest.children[Number(place)]?.insertAdjacentElement("beforebegin", el);
}

function moveBack(parent, el, index) {
  el.classList.remove("dynamic-adaptiv");
  if (!parent) return;
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement("beforebegin", el);
  } else {
    parent.insertAdjacentElement("beforeend", el);
  }
}

export function init(root = document, type = "max") {
  const nodes = root.querySelectorAll("[data-da]");
  if (!nodes.length) return;

  // собираем объекты
  const objects = [];
  nodes.forEach((node) => {
    const conf = parseDA(node.dataset.da || "");
    if (!conf.selector) return;

    const parent = node.parentNode;
    const destination = resolveDestination(conf);

    if (!destination) {
      // защитимся от битых селекторов — просто игнор
      return;
    }

    objects.push({
      element: node,
      parent,
      destination,
      breakpoint: conf.breakpoint,
      place: conf.place,
      index: indexInParent(parent, node),
    });
  });

  if (!objects.length) return;
  sortObjects(objects, type);

  // уникальные MQ
  const mqList = Array.from(
    new Set(
      objects.map((o) => `(${type}-width: ${o.breakpoint}px),${o.breakpoint}`),
    ),
  );

  const handler = (mq, items) => {
    if (mq.matches) {
      items.forEach((o) => moveTo(o.place, o.element, o.destination));
    } else {
      items.forEach((o) => {
        if (o.element.classList.contains("dynamic-adaptiv")) {
          moveBack(o.parent, o.element, o.index);
        }
      });
    }
  };

  mqList.forEach((str) => {
    const [query, bp] = str.split(",");
    const mm = window.matchMedia(query);
    const subset = objects.filter((o) => String(o.breakpoint) === bp);
    // сразу обработать
    handler(mm, subset);
    // и слушать изменения
    mm.addEventListener?.("change", () => handler(mm, subset));
  });
}
