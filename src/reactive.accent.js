class AccentConstruct extends Object {
  proxy = new Proxy(this, {
    set: (target, prop, value) => {
      this.observers
        .filter((o) => o.key == prop)
        .forEach((o, i, a) => {
          o?.callback(o, o.data, i, a);
        });
    },
  });

  observers = [];

  observe(key, dat, callback) {
    this.observers.push({ key: key, data: dat, callback: callback });
  }
}

const $global = new AccentConstruct({}).proxy;
