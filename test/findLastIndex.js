var R = require('../source/index.js');
var eq = require('./shared/eq.js');
var listXf = require('./helpers/listXf.js');


describe('findLastIndex', function() {
  var obj1 = {x: 100};
  var obj2 = {x: 200};
  var a = [11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0];
  var even = function(x) { return x % 2 === 0; };
  var gt100 = function(x) { return x > 100; };
  var isStr = function(x) { return typeof x === 'string'; };
  var xGt100 = function(o) { return o && o.x > 100; };

  it('returns the index of the last element that satisfies the predicate', function() {
    eq(R.findLastIndex(even, a), 15);
    eq(R.findLastIndex(gt100, a), 9);
    eq(R.findLastIndex(isStr, a), 3);
    eq(R.findLastIndex(xGt100, a), 10);
  });

  it('returns -1 when no element satisfies the predicate', function() {
    eq(R.findLastIndex(even, ['zing']), -1);
  });

  it('works when the first element matches', function() {
    eq(R.findLastIndex(even, [2, 3, 5]), 0);
  });

  it('does not go into an infinite loop on an empty array', function() {
    eq(R.findLastIndex(even, []), -1);
  });

  it('dispatches to transformer objects', function() {
    eq(R.findLastIndex(R.identity, listXf), {
      f: R.identity,
      idx: -1,
      lastIdx: -1,
      xf: listXf
    });
  });

  it('can act as a transducer', function() {
    eq(R.into([], R.findLastIndex(even), a), [15]);
    eq(R.transduce(R.findLastIndex(even), R.flip(R.append), [], a), [15]);
  });

});
