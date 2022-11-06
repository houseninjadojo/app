export default function compact(
  obj: Record<string, unknown>
): Record<string, string> {
  return Object.keys(obj).reduce((acc: any, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
