export function IsJsonString(json) {
  try {
    return JSON.parse(JSON.stringify(json));
  } catch (e) {
    return [];
  }
}

export function debounce(f, ms) {
  let isCooldown = false;

  return function () {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => (isCooldown = false), ms);
  };
}
