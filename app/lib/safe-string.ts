export default class SafeString {
  public string: string;

  constructor(string: string) {
    this.string = string;
  }

  toString(): string {
    return `${this.string}`;
  }

  toHTML(): string {
    return this.toString();
  }
}
