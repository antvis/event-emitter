import EE from "../../src";

describe("EE", () => {
  it("instance", () => {
    expect(typeof EE).toEqual("function");
    expect(typeof new EE().on).toEqual("function");
    expect(typeof new EE().once).toEqual("function");
    expect(typeof new EE().emit).toEqual("function");
    expect(typeof new EE().off).toEqual("function");
  });

  it("on", () => {
    const ee = new EE();

    const fn = () => {};

    ee.on("click", fn);
    ee.on("click", fn);

    ee.on("mouseover", fn);

    expect(ee.getEvents()).toEqual({
      click: [
        { callback: fn, once: false },
        { callback: fn, once: false }
      ],
      mouseover: [{ callback: fn, once: false }]
    });
  });

  it("once", () => {
    const ee = new EE();

    const fn = () => {};

    ee.once("click", fn);
    // will skip
    ee.once("click", fn);
    ee.once("mouseover", fn);

    expect(ee.getEvents()).toEqual({
      click: [
        { callback: fn, once: true },
        { callback: fn, once: true }
      ],
      mouseover: [{ callback: fn, once: true }]
    });
  });

  it("once should breack loop", () => {
    const ee = new EE();
    let count = 0;

    const fn = () => {
      count += 1;
      ee.emit("click");
    };

    ee.once("click", fn);
    ee.emit("click");
    expect(count).toEqual(1);
  });

  it("emit", () => {
    const ee = new EE();

    let cnt = 100;
    const fn = (...args: any[]) => {
      cnt = args.reduce((r, c) => {
        return r + c;
      }, cnt);
    };

    // always
    ee.on("click", fn);

    // once
    ee.once("click", fn);
    ee.once("mouseover", fn);

    ee.emit("click", 10, 20, 30);
    ee.emit("click", 10, 20, 30);

    expect(cnt).toEqual(100 + 60 * 2 + 60);

    expect(ee.getEvents()).toEqual({
      click: [{ callback: fn, once: false }],
      mouseover: [{ callback: fn, once: true }]
    });
  });

  it("off", () => {
    const ee = new EE();

    const fn = () => {};

    ee.on("click", fn);
    ee.on("test-event", fn);
    // will skip
    ee.once("click", fn);
    ee.once("mouseover", fn);

    ee.emit("click", 1, 2, 3);
    expect(ee.getEvents().click.length).toEqual(1);

    ee.off("click", () => {});
    expect(ee.getEvents().click.length).toEqual(1);

    ee.off("click", fn);

    expect(ee.getEvents().click).toEqual(undefined);

    ee.off("mouseover");
    expect(ee.getEvents().mouseover).toEqual(undefined);
    ee.off("mouseover", fn);

    expect(Object.keys(ee.getEvents())).toEqual(["test-event"]);

    ee.off();

    expect(ee.getEvents()).toEqual({});

    ee.emit("click");
    ee.emit("hello");
  });

  it("remove empty", () => {
    const ee = new EE();

    const fn = () => {};

    ee.once("click", fn);
    expect(ee.getEvents().click.length).toEqual(1);

    ee.emit("click", 1, 2, 3);
    expect(ee.getEvents()).toEqual({});
  });

  it("emit where off", () => {
    const ee = new EE();
    let cnt = 0;
    const callback1 = () => {
      cnt += 1;
    };
    const callback2 = () => {
      cnt += 3;
      ee.off("click", callback3);
    };
    const callback3 = () => {
      cnt += 5;
    };

    ee.on("click", callback1);
    ee.on("click", callback2);
    ee.on("click", callback3);

    ee.emit("click");
    expect(cnt).toBe(4);
  });
});
