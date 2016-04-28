'use strict';

var DecipherParser = (function() {

  let requestInfo = function(callback) {
    $.ajax({
      url: '/decipher/test',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        callback(data);
      }
    });
  }

  let getPositionInfo = function(rawData) {
    let myPositions = [];

    for(let i = 0; i < rawData.length; i++) {
      const currentPosition = parsePositionInfo(rawData[i]);
      myPositions.push(currentPosition);
    }

    return myPositions;
  }

  function parsePositionInfo(positionInfo) {
    const myPosition = {};
    const gains = positionInfo['gains'];

    myPosition['unrealized'] = gains['unrealized_longterm'] + gains['unrealized_shortterm'];
    myPosition['realized'] = gains['realized_longterm'] + gains['realized_shortterm'];
    myPosition['shortterm'] = gains['unrealized_shortterm'] + gains['realized_shortterm'];
    myPosition['longterm'] = gains['unrealized_longterm'] + gains['realized_longterm'];
    myPosition['dividends'] = positionInfo['dividends']['total'];
    myPosition['shares'] = positionInfo['shares'];
    myPosition['value'] = positionInfo['value'];
    myPosition['name'] = positionInfo['security']['name'];
    myPosition['ticker'] = positionInfo['security']['ticker'];

    return myPosition;
  }

  let getDailyInfo = function(dailyInfo) {
    const myDailyInfo = {};
    myDailyInfo['data'] = [];
    myDailyInfo['total_pnl_unrealized'] = 0;
    myDailyInfo['total_pnl_realized'] = 0;

    for(let i = 0; i < dailyInfo.length; i++) {
      const currentDay = dailyInfo[i];
      const currentDailyInfo = {};

      currentDailyInfo['pnl_unrealized'] = currentDay['pnl_unrealized'];
      currentDailyInfo['pnl_realized'] = currentDay['pnl_realized'];
      currentDailyInfo['date'] = currentDay['date'];

      myDailyInfo['total_pnl_unrealized'] += currentDailyInfo['pnl_unrealized'];
      myDailyInfo['total_pnl_realized'] += currentDailyInfo['pnl_realized'];
      myDailyInfo['data'].push(currentDailyInfo);
    }

    return myDailyInfo;
  }

  return {
    requestInfo: requestInfo,
    getPositionInfo: getPositionInfo,
    getDailyInfo: getDailyInfo
  };
})();
