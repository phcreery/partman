/*
 */
export function filterNodeMethod(value: string, data: string) {
  return data.toLowerCase().includes(value.toLowerCase());
}
