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
      const currentData = rawData[i];
      const gains = currentData['gains'];
      const currentPosition = {};

      currentPosition['unrealized'] = gains['unrealized_longterm'] + gains['unrealized_shortterm'];
      currentPosition['realized'] = gains['realized_longterm'] + gains['realized_shortterm'];
      currentPosition['shortterm'] = gains['unrealized_shortterm'] + gains['realized_shortterm'];
      currentPosition['longterm'] = gains['unrealized_longterm'] + gains['realized_longterm'];
      currentPosition['dividends'] = currentData['dividends']['total'];
      currentPosition['shares'] = currentData['shares'];
      currentPosition['value'] = currentData['value'];
      currentPosition['name'] = currentData['security']['name'];
      currentPosition['ticker'] = currentData['security']['ticker'];

      myPositions.push(currentPosition);
    }

    return myPositions;
  }

  return {
    requestInfo: requestInfo,
    getPositionInfo: getPositionInfo
  };
})();
