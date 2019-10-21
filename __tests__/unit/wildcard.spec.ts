import EE from '../../src';

describe('wildcard', () => {
  const ee = new EE();

  const fnOther = jest.fn();
  const fnOn = jest.fn();
  const fnOnce = jest.fn();

  it('on', () => {

    ee.on('click', fnOther);
    ee.on('*', fnOn);

    expect(ee.getEvents()['*'].length).toBe(1);
  });

  it('once', () => {
    ee.once('mousemove', fnOther);
    ee.once('*', fnOnce);

    expect(ee.getEvents()['*'].length).toBe(2);
  });

  it('emit', () => {
    ee.emit('click', 'click');

    expect(fnOn).toBeCalledWith('click');
    expect(fnOn).toBeCalledTimes(1);
    expect(fnOnce).toBeCalledWith('click');
    expect(fnOnce).toBeCalledTimes(1);

    ee.emit('xxx', 'xxx');
    expect(fnOn).toBeCalledWith('xxx');
    expect(fnOn).toBeCalledTimes(2);
    expect(fnOnce).toBeCalledTimes(1);
  });

  it('off', () => {
    ee.off('*');

    expect(ee.getEvents()['*']).toBe(undefined);
  });
});
