var R = require('../source/index.js');
var eq = require('./shared/eq.js');


describe('dropWhile', function() {
  it('skips elements while the function reports `true`', function() {
    eq(R.dropWhile(function(x) {return x < 5;}, [1, 3, 5, 7, 9]), [5, 7, 9]);
  });

  it('returns an empty list for an empty list', function() {
    eq(R.dropWhile(function() { return false; }, []), []);
    eq(R.dropWhile(function() { return true; }, []), []);
  });

  it('starts at the right arg and acknowledges undefined', function() {
    var sublist = R.dropWhile(function(x) {return x !== void 0;}, [1, 3, void 0, 5, 7]);
    eq(sublist.length, 3);
    eq(sublist[0], void 0);
    eq(sublist[1], 5);
    eq(sublist[2], 7);
  });

  it('can operate on strings', function() {
    eq(R.dropWhile(function(x) { return x !== 'd'; }, 'Ramda'), 'da');
  });

  it('can act as a transducer', function() {
    var lteTwo = x => x <= 2;
    var input = [1, 2, 3, 4, 3, 2, 1];
    var expected = [3, 4, 3, 2, 1];
    eq(R.into([], R.dropWhile(lteTwo), input), expected);
    eq(R.transduce(R.dropWhile(lteTwo), R.flip(R.append), [], input), expected);
  });

});
