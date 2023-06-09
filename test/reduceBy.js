var R = require('../source/index.js');
var eq = require('./shared/eq.js');

var byType = R.prop('type');
var sumValues = function(acc, obj) {return acc + obj.val;};

var sumInput = [
  {type: 'A', val: 10},
  {type: 'B', val: 20},
  {type: 'A', val: 30},
  {type: 'A', val: 40},
  {type: 'C', val: 50},
  {type: 'B', val: 60}
];

describe('reduceBy', function() {
  var grade = function(score) {
    return (score < 65) ? 'F' : (score < 70) ? 'D' : (score < 80) ? 'C' : (score < 90) ? 'B' : 'A';
  };
  var students = [
    {name: 'Abby', score: 84},
    {name: 'Brad', score: 73},
    {name: 'Chris', score: 89},
    {name: 'Dianne', score: 99},
    {name: 'Eddy', score: 58},
    {name: 'Fred', score: 67},
    {name: 'Gillian', score: 91},
    {name: 'Hannah', score: 78},
    {name: 'Irene', score: 85},
    {name: 'Jack', score: 69}
  ];
  var byGrade = function(student) {return grade(student.score || 0);};

  it('splits the list into groups according to the grouping function', function() {
    var collectNames = function(acc, student) {return acc.concat(student.name);};
    eq(R.reduceBy(collectNames, [], byGrade, students), {
      A: ['Dianne', 'Gillian'],
      B: ['Abby', 'Chris', 'Irene'],
      C: ['Brad', 'Hannah'],
      D: ['Fred', 'Jack'],
      F: ['Eddy']
    });
  });

  it('splits the list into mutation-free groups', function() {
    var collectNames = function(acc, student) {
      acc.push(student.name);
      return acc;
    };
    eq(R.reduceBy(collectNames, [], byGrade, students), {
      A: ['Dianne', 'Gillian'],
      B: ['Abby', 'Chris', 'Irene'],
      C: ['Brad', 'Hannah'],
      D: ['Fred', 'Jack'],
      F: ['Eddy']
    });
  });

  it('returns an empty object if given an empty array', function() {
    eq(R.reduceBy(sumValues, 0, byType, []), {});
  });

  it('can act as a transducer', function() {
    var reduceToSumsBy = R.reduceBy(sumValues, 0);
    var sumByType = reduceToSumsBy(byType);
    eq(R.into(
      {},
      R.compose(sumByType, R.map(R.adjust(1, R.multiply(10)))),
      sumInput
    ), {A: 800, B: 800, C: 500});
    eq(R.transduce(
      R.compose(sumByType, R.map(R.adjust(1, R.multiply(10)))),
      (result, input) => {result[input[0]] = result[input[0]] ? result[input[0]] : 0 + input[1]; return result;},
      {},
      sumInput
    ), {A: 800, B: 800, C: 500});
  });

  it('short circuits with reduced', function() {
    var collectNames = function(acc, student) { return student.name === 'Fred' ? R.reduced(acc) : acc.concat(student.name); };
    eq(R.reduceBy(collectNames, [], byGrade, students), {
      A: ['Dianne'],
      B: ['Abby', 'Chris'],
      C: ['Brad'],
      F: ['Eddy']
    });
  });
});
