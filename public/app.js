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

  return {
    requestInfo: requestInfo,
    getPositionInfo: getPositionInfo
  };
})();
