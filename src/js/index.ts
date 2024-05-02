export class DB<T> {
  #key: string;

  constructor(key: string) {
    this.#key = key;
  }

  find(partial: Partial<T>): T | undefined {
    return this.all.find((x) =>
      Object.entries(partial).every(([key, value]) => {
        // @ts-expect-error I'm not sure.
        return x[key] === value;
      }),
    );
  }

  remove(partial: Partial<T>) {
    const filtered = this.all.filter(
      (x) =>
        !Object.entries(partial).every(([key, value]) => {
          // @ts-expect-error I'm not sure.
          return x[key] === value;
        }),
    );
    this.#save(filtered);
  }

  insert(item: T) {
    this.#save([...this.all, item]);
  }

  #save(items: T[]) {
    const encoded = JSON.stringify(items);
    window.localStorage.setItem(this.#key, encoded);
  }

  removeAll() {
    window.localStorage.setItem(this.#key, '[]');
  }

  get all(): T[] {
    return JSON.parse(window.localStorage.getItem(this.#key) || '[]').sort();
  }
}
