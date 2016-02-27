#!/usr/bin/env node

// Test node.
try {
  //Expected an assignment or function call and instead saw an expression.
  /*jshint -W030 */
  Object.prototype.toString.call(global.process) === '[object process]';
} catch(e) {
  // Not node. Halt.
  return;
}

var path = require('path');
var STATEMAN = require(path.join(__dirname, '../src/stateman.js'));

console.log(STATEMAN);

(function () {
  "use strict";

  var testCount = 0,
      passCount = 0,
      tests = [],
      addTest = function (title, testCase) {
        testCount++;
        tests.push({
          title: title,
          func: testCase
        });
      },
      runTests = function () {
        console.log('Running', testCount, 'test(s).');
        var testCase, testResult;
        while (tests.length > 0) {
          testCase = tests.shift();
          try {
            testResult = testCase.func();
          } catch(e) {
            console.log(e);
            testResult = null;
          }
          if (testResult === true) {
            passCount++;
            console.log(testCase.title, '- passed');
          } else {
            console.log(testCase.title, '- failed');
          }
        }
      },
      checkScore = function () {
        console.log('Test result:', passCount, 'of', testCount, 'passed.');
        if (testCount === passCount) {
          process.exit();
        } else {
          process.exit(1);
        }
      };
  // Write test cases down below.

  addTest('Instantiation', function () {
    var sman = STATEMAN('test');
    return true;
  });
  addTest('Instances are cached', function () {
    var sman1 = STATEMAN('test');
    var sman2 = STATEMAN('test');
    return (sman1 === sman2);
  });
  addTest('Caching is case-sensitive', function () {
    var sman1 = STATEMAN('test');
    var sman2 = STATEMAN('Test');
    return (sman1 !== sman2);
  });
  addTest('Detaching removes the cached instance', function () {
    var sman1 = STATEMAN('test');
    sman1.detach();
    var sman2 = STATEMAN('test');
    return (sman1 !== sman2);
  });

  // Do not modify anything below.
  runTests();
  checkScore();
})();
