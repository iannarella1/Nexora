type RouteHandler = () => void;

const routes = new Map<string, RouteHandler>();
let notFoundHandler: RouteHandler = () => {};

export function registerRoute(path: string, handler: RouteHandler): void {
  routes.set(path, handler);
}

export function setNotFoundHandler(handler: RouteHandler): void {
  notFoundHandler = handler;
}

export function navigate(path: string): void {
  if (location.hash === `#${path}`) {
    resolveRoute();
  } else {
    location.hash = path;
  }
}

export function currentPath(): string {
  return location.hash.replace(/^#/, '') || '/login';
}

function resolveRoute(): void {
  const path = currentPath();
  const handler = routes.get(path);
  window.scrollTo({ top: 0 });
  if (handler) {
    handler();
  } else {
    notFoundHandler();
  }
}

export function startRouter(): void {
  window.addEventListener('hashchange', resolveRoute);
  resolveRoute();
}
