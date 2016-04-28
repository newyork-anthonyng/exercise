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

  return {
    requestInfo: requestInfo
  };
})();
