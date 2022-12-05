const { Disposable, using } = require("../");

class Test extends Disposable {
  constructor() {
    super();

    this.foo = ["bar"];
  }

  onDispose() {
    this.foo.length = 0;
  }
}

test("manual dispose", () => {
  const t = new Test();

  expect(t.foo.length).toBe(1);

  t.dispose();

  expect(t.foo.length).toBe(0);
});

test("using auto construct", () => {
  using(Test, (test) => {
    expect(test.foo.length).toBe(1);
  });
});

test("using object", () => {
  const t = new Test();

  using(t, (test) => {
    expect(test.foo.length).toBe(1);
  });

  expect(t.foo.length).toBe(0);
});
