export function getRandomIndexForAnArray(array: any[]): number {
  const max: number = array.length;
  const index: number = Math.floor(Math.random() * (+max - +0)) + +0;

  return index;
}
