const { DIContainer } = require("../");

test("singleton", () => {
  class S {
    foo = "foo";
  }

  const c = new DIContainer().addSingleton(S, "S");

  const s1 = c.resolve("S");
  s1.foo = "bar";

  const s2 = c.resolve("S");

  expect(s1.foo).toBe(s2.foo);
  expect(s1.foo).toBe("bar");
});

test("transient", () => {
  class T {
    foo = "foo";
  }

  const c = new DIContainer().addTransient(T, "T");

  const t1 = c.resolve("T");
  t1.foo = "bar";

  const t2 = c.resolve("T");

  expect(t1.foo).not.toBe(t2.foo);
  expect(t1.foo).toBe("bar");
  expect(t2.foo).toBe("foo");
});
