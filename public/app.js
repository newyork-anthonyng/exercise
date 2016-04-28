'use strict';

var DecipherParser = (function() {
  var test = 'Hello World';

  var testFunction = function() {
    return test;
  }

  return {
    test: testFunction
  };
})();
