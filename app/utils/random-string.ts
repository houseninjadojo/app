export default function randomString(): string {
  return (Math.random() + 1).toString(36).substring(2);
}
