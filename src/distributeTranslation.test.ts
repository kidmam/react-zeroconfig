const sampleData: object = {
  a: {
    b: {
      c: {
        d: 'hello',
      },
    },
  },
};

const keys: string[] = ['a', 'b', 'c', 'd'];

describe('distributeTranslation', () => {
  it('Should get the value by getValue()', () => {
    const v: string = keys.reduce((data, k) => data[k], sampleData);
    
    expect(v).toEqual('hello');
  });
  
  it('Should set the value by setValue()', () => {
    const c: object = keys.slice(0, keys.length - 1).reduce((data, k) => data[k], sampleData);
    
    c['d'] = 'fuck';
    
    const v: string = keys.reduce((data, k) => data[k], sampleData);
    
    expect(v).toEqual('fuck');
  });
});