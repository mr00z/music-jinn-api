export function getRandomIndexForAnArray(array: any[]): number {
  const max: number = array.length;
  const index: number = Math.floor(Math.random() * (+max - +0)) + +0;

  return index;
}

export function isDateLaterThan(days: number, date: Date): boolean {
  const today = new Date();
  return date.getDate() < today.getDate() - days;
}
