export function set(name, value) {
  window.localStorage.setItem(name, value);
}

export function get(name) {
  return (window.localStorage.getItem(name) || null);
}
