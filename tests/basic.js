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
var EzTest = require(path.join(__dirname, '/lib/eztest.js'));
var STATEMAN = require(path.join(__dirname, '../src/stateman.js'));
var testSet = new EzTest();
// Write test cases down below.

testSet.addTest('Instantiation', function () {
  var sman = STATEMAN('test');
  return true;
});
testSet.addTest('Instances are cached', function () {
  var sman1 = STATEMAN('test');
  var sman2 = STATEMAN('test');
  return (sman1 === sman2);
});
testSet.addTest('Detaching removes the cached instance', function () {
  var sman1 = STATEMAN('test');
  sman1.detach();
  var sman2 = STATEMAN('test');
  return (sman1 !== sman2);
});
testSet.addTest('Caching is case-sensitive', function () {
  var sman1 = STATEMAN('test');
  var sman2 = STATEMAN('Test');
  sman1.detach();
  sman2.detach();
  return (sman1 !== sman2);
});
testSet.addTest('Default state is `None`', function () {
  var sman = STATEMAN('test');
  sman.detach();
  return sman.getState() === 'None';
});
testSet.addTest('Can switch states', function () {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-';
  sman.setState(nextStateName);
  if (sman.getState() !== nextStateName) {
    return false;
  }
  return true;
});
testSet.addAsyncTest('Can register action - before leave', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      isTriggered = false;
  sman.registerActionBeforeLeavingState(prevStateName, function (nextState, currState, data) {
    isTriggered = true;
  });
  sman.setState(nextStateName, null, function () {
    if (isTriggered === true) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addAsyncTest('Can register action - before enter', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      isTriggered = false;
  sman.registerActionBeforeEnteringState(nextStateName, function (nextState, currState, data) {
    isTriggered = true;
  });
  sman.setState(nextStateName, null, function () {
    if (isTriggered === true) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addAsyncTest('Can register action - after leave', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      isTriggered = false;
  sman.registerActionAfterLeavingState(prevStateName, function (prevState, currState, data) {
    isTriggered = true;
  });
  sman.setState(nextStateName, null, function () {
    if (isTriggered === true) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addAsyncTest('Can register action - after enter', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      isTriggered = false;
  sman.registerActionAfterEnteringState(nextStateName, function (prevState, currState, data) {
    isTriggered = true;
  });
  sman.setState(nextStateName, null, function () {
    if (isTriggered === true) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addAsyncTest('Can register action - monitor', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      isTriggered = false;
  sman.registerMonitor(function (currState, prevState, data) {
    isTriggered = true;
  });
  sman.setState(nextStateName, null, function () {
    if (isTriggered === true) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addAsyncTest('Action parameter - before leave', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      actionData = {};
  sman.registerActionBeforeLeavingState(prevStateName, function (nextState, currState, data) {
    if (this === sman &&
        currState === prevStateName &&
        nextState === nextStateName &&
        data === actionData) {
      pass();
    } else {
      fail();
    }
  });
  sman.setState(nextStateName, actionData);
});
testSet.addAsyncTest('Action parameter - before enter', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      actionData = {};
  sman.registerActionBeforeEnteringState(nextStateName, function (nextState, currState, data) {
    if (this === sman &&
        currState === prevStateName &&
        nextState === nextStateName &&
        data === actionData) {
      pass();
    } else {
      fail();
    }
  });
  sman.setState(nextStateName, actionData);
});
testSet.addAsyncTest('Action parameter - after leave', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      actionData = {};
  sman.registerActionAfterLeavingState(prevStateName, function (prevState, currState, data) {
    if (this === sman &&
        currState === nextStateName &&
        prevState === prevStateName &&
        data === actionData) {
      pass();
    } else {
      fail();
    }
  });
  sman.setState(nextStateName, actionData);
});
testSet.addAsyncTest('Action parameter - after enter', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      actionData = {};
  sman.registerActionAfterEnteringState(nextStateName, function (prevState, currState, data) {
    if (this === sman &&
        currState === nextStateName &&
        prevState === prevStateName &&
        data === actionData) {
      pass();
    } else {
      fail();
    }
  });
  sman.setState(nextStateName, actionData);
});
testSet.addAsyncTest('Action parameter - monitor', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      actionData = {};
  sman.registerMonitor(function (currState, prevState, data) {
    if (this === sman &&
        currState === nextStateName &&
        prevState === prevStateName &&
        data === actionData) {
      pass();
    } else {
      fail();
    }
  });
  sman.setState(nextStateName, actionData);
});
testSet.addAsyncTest('Action order', function (pass, fail) {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-',
      startValue = 0,
      operations = [
        function (input) {
          return 0;
        },
        function (input) {
          return input + 1;
        },
        function (input) {
          return input * 3;
        },
        function (input) {
          return input + 5;
        },
        function (input) {
          return input * 7;
        }
      ],
      expectedResult = startValue,
      testResult = startValue;
  operations.forEach(function (op, index) {
    expectedResult = op(expectedResult);
  });
  sman.registerActionBeforeLeavingState(prevStateName, function (nextState, currState, data) {
    testResult = operations[0](testResult);
  });
  sman.registerActionBeforeEnteringState(nextStateName, function (nextState, currState, data) {
    testResult = operations[1](testResult);
  });
  sman.registerActionAfterLeavingState(prevStateName, function (prevState, currState, data) {
    testResult = operations[2](testResult);
  });
  sman.registerActionAfterEnteringState(nextStateName, function (prevState, currState, data) {
    testResult = operations[3](testResult);
  });
  sman.registerMonitor(function (currState, prevState, data) {
    testResult = operations[4](testResult);
  });
  sman.setState(nextStateName, null, function () {
    if (testResult === expectedResult) {
      pass();
    } else {
      fail();
    }
  });
});
testSet.addTest('Before leave action can stop state change', function () {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-';
  sman.registerActionBeforeLeavingState(prevStateName, function (nextState, currState, data) {
    return false;
  });
  var changeResult = sman.setState(nextStateName);
  // changeResult should be false, indicating the change is not effective.
  if (changeResult === true) {
    return false;
  }
  return (sman.getState() === prevStateName);
});
testSet.addTest('Before enter action can stop state change', function () {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName = prevStateName + '-';
  sman.registerActionBeforeEnteringState(nextStateName, function (nextState, currState, data) {
    return false;
  });
  var changeResult = sman.setState(nextStateName);
  // changeResult should be false, indicating the change is not effective.
  if (changeResult === true) {
    return false;
  }
  return (sman.getState() === prevStateName);
});
testSet.addTest('Successful state change sequence', function () {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName1 = prevStateName + '-',
      nextStateName2 = prevStateName + '--';
  sman.setState(nextStateName1);
  if (sman.getState() !== nextStateName1) {
    return false;
  }
  sman.setState(nextStateName2);
  if (sman.getState() !== nextStateName2) {
    return false;
  }
  return true;
});
testSet.addTest('Interrupted state change sequence', function () {
  var sman = STATEMAN('test');
  sman.detach();
  var prevStateName = sman.getState(),
      nextStateName1 = prevStateName + '-',
      nextStateName2 = prevStateName + '--';
  sman.registerActionBeforeLeavingState(prevStateName, function (nextState, currState, data) {
    return false;
  });
  sman.setState(nextStateName1);
  if (sman.getState() !== prevStateName) {
    return false;
  }
  sman.setState(nextStateName2);
  if (sman.getState() !== prevStateName) {
    return false;
  }
  return true;
});

// Do not modify anything below.
var testCount = testSet.runTests(function (passed, totalRun) {
  console.log('Test result:', passed, 'of', totalRun, 'passed.');
  if (passed === totalRun) {
    process.exit();
  } else {
    process.exit(1);
  }
}, function (title, passed, duration, async, timeout) {
  console.log(title, '- ' + (passed ? 'passed' : (timeout ? 'timeout' : (duration === -1 ? 'exception' : 'failed'))), duration + 'ms');
});
console.log('Running', testCount, 'test(s).');
