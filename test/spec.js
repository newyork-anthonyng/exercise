describe('Test', function() {
  it('should be true', function() {
    expect(true).toBe(true);
  });
});

describe('DecipherParser', function() {

  describe('#requestInfo', function() {

    it('should make ajax call', function() {
      spyOn($, 'ajax');
      DecipherParser.requestInfo();

      expect($.ajax).toHaveBeenCalled();
      expect($.ajax.calls.mostRecent().args[0]['url']).toEqual('/decipher/test');
    });

    it('should accept a callback', function() {
      spyOn($, 'ajax').and.callFake(function(e) {
        e.success({});
      });

      var callback = jasmine.createSpy('callback');
      DecipherParser.requestInfo(callback);

      expect(callback.calls.count()).toEqual(1);
    });

  });

});
