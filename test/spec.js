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

  describe('#getPositionInfo', function() {

    it('should return AcctName, Security, and Value', function() {
      var fakeData = [
        {
          gains: { unrealized_longterm: 123, unrealized_shortterm: 234, realized_shortterm: 345, realized_longterm: 456 },
          dividends: { total: 22 },
          shares: 123,
          value: 2985,
          security: { ticker: 'AAPL', name: 'Apple' }
        },
        {
          gains: { unrealized_longterm: 55, unrealized_shortterm: 66, realized_shortterm: 77, realized_longterm: 88 },
          dividends: { total: 22 },
          shares: 234,
          value: 1984,
          security: { ticker: 'FB', name: 'Facebook' }
        },
      ];
      var positionInfo = DecipherParser.getPositionInfo(fakeData);
      var aapl = {
        unrealized: 357,
        realized: 801,
        shortterm: 579,
        longterm: 579,
        dividends: 22,
        shares: 123,
        value: 2985,
        name: 'Apple',
        ticker: 'AAPL'
      };
      var fb = {
        unrealized: 121,
        realized: 165,
        shortterm: 143,
        longterm: 143,
        dividends: 22,
        shares: 234,
        value: 1984,
        name: 'Facebook',
        ticker: 'FB'
      };

      expect(positionInfo.length).toEqual(2);
      expect(positionInfo[0]).toEqual(aapl);
      expect(positionInfo[1]).toEqual(fb);
    });

  });

});
