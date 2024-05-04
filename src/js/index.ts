class DBChangeEvent<T> extends CustomEvent<T> {
  constructor() {
    super('change');
  }
}

export class DB<T> extends EventTarget {
  #key: string;

  constructor(key: string) {
    super();
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

  insert(...items: T[]) {
    this.#save([...this.all, ...items]);
  }

  #save(items: T[]) {
    const encoded = JSON.stringify(items);
    window.localStorage.setItem(this.#key, encoded);
    this.dispatchEvent(new DBChangeEvent());
  }

  removeAll() {
    this.#save([]);
  }

  get all(): T[] {
    return JSON.parse(window.localStorage.getItem(this.#key) || '[]').sort();
  }
}
