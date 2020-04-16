export function generateId(): string {
  return Math.random().toString(32).substr(2, 4);
}
