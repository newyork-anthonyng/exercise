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
    var positionInfo;

    beforeEach(function() {
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
      positionInfo = DecipherParser.getPositionInfo(fakeData);

    });

    it('should return an array', function() {
      expect(Array.isArray(positionInfo)).toBe(true);
      expect(positionInfo.length).toEqual(2);
    });

    it('should calculate info for each position', function() {
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

      expect(positionInfo[0]).toEqual(aapl);
      expect(positionInfo[1]).toEqual(fb);
    });
  });

  describe('#getDailyInfo', function() {
    var dailyInfo;

    beforeEach(function() {
      var fakeData = [
        { pnl_unrealized: -123, pnl_realized: 0, date: '2013-01-08' },
        { pnl_unrealized: 0, pnl_realized: 1, date: '2013-01-09' },
        { pnl_unrealized: 0, pnl_realized: 12, date: '2013-01-10' },
        { pnl_unrealized: 0, pnl_realized: 13, date: '2013-01-11' },
        { pnl_unrealized: 0, pnl_realized: 14, date: '2013-01-12' },
        { pnl_unrealized: 0, pnl_realized: 15, date: '2013-01-13' },
        { pnl_unrealized: 0, pnl_realized: 16, date: '2013-01-14' },
        { pnl_unrealized: 0, pnl_realized: 17, date: '2013-01-15' },
      ];
      dailyInfo = DecipherParser.getDailyInfo(fakeData);
    });

    it('should return an array of daily information', function() {
      expect(Array.isArray(dailyInfo['data'])).toBe(true);
      expect(dailyInfo['data'].length).toEqual(8);
    });

    it('should have total_pnl_unrealized', function() {
      expect(dailyInfo['total_pnl_unrealized']).toEqual(-123);
    });

    it('should have total_pnl_realized', function() {
      expect(dailyInfo['total_pnl_realized']).toEqual(88);
    });

    it('should have pnl_unrealized, pnl_realized, and date info for each date', function() {
      expect(Object.keys(dailyInfo['data'][0])).toEqual(['pnl_unrealized', 'pnl_realized', 'date']);
    });
  });

});
