import { expect } from '@open-wc/testing';
import { faker } from '@faker-js/faker';
import { DB } from '../src/js/index';

interface TestDatum {
  name: string;
  url: string;
}

function id() {
  return faker.string.alphanumeric(5);
}

function datum() {
  return {
    name: faker.person.fullName(),
    url: faker.internet.url({ protocol: 'https' }),
  };
}

describe('the db', () => {
  let db: DB<TestDatum>;
  beforeEach(() => {
    db = new DB(id());
  });

  afterEach(() => {
    db.removeAll();
  });

  it('starts off empty', () => {
    expect(db.all).to.be.empty;
  });

  it('can insert datum', () => {
    const item = datum();
    db.insert(item);
    expect(db.all).to.deep.equal([item]);
  });

  it('can insert data', () => {
    const items = [datum(), datum(), datum()];
    db.insert(...items);
    expect(db.all).to.deep.equal(items);
  });

  it('can find specific datum', () => {
    const items = [datum(), datum(), datum()];
    db.insert(items[0]);
    db.insert(items[1]);
    db.insert(items[2]);
    expect(db.all).to.deep.equal(items);
    const found = db.find({ name: items[1].name });
    expect(found).to.deep.equal(items[1]);
  });

  it('can remove specific datum', () => {
    const items = [datum(), datum(), datum()];
    db.insert(items[0]);
    db.insert(items[1]);
    db.insert(items[2]);
    expect(db.all).to.deep.equal(items);
    db.remove({ name: items[1].name });
    expect(db.all).to.deep.equal([items[0], items[2]]);
  });

  it('can remove all data', () => {
    const items = [datum(), datum(), datum()];
    db.insert(items[0]);
    db.insert(items[1]);
    db.insert(items[2]);
    expect(db.all).to.deep.equal(items);
    db.removeAll();
    expect(db.all).to.be.empty;
  });

  describe('fires a change event', () => {
    it('when data is inserted', async () => {
      const oneEvent = new Promise<void>((resolve) => {
        db.addEventListener('change', () => resolve(), { once: true });
      });
      db.insert(datum());
      await oneEvent;
    });

    it('when data is removed', async () => {
      const items = [datum(), datum(), datum()];
      db.insert(items[0]);
      db.insert(items[1]);
      db.insert(items[2]);
      expect(db.all).to.deep.equal(items);

      const oneEvent = new Promise<void>((resolve) => {
        db.addEventListener('change', () => resolve(), { once: true });
      });
      db.remove(items[2]);
      await oneEvent;
    });
  });
});
