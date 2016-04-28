describe('Test', function() {
  it('should be true', function() {
    expect(true).toBe(true);
  });
});

describe('DecipherParser', function() {
  it('#test', function() {
    var a = DecipherParser.test();

    expect(a).toEqual('Hello World');
  });
});
