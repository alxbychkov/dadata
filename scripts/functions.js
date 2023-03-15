export function IsJsonString(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return [];
  }
}
