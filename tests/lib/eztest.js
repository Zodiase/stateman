/**
 * @author Xingchen Hong
 * @version 0.0.1
 * @summary This is a light weight tester for NPM.
 * @module EzTest
**/

/**
 * Creates a new test set.
 * @class
 * @alias EzTest
 * @since 0.0.1
 */
var EzTest = function () {
  this._testCount = 0;
  this._passCount = 0;
  this._runCount = 0;
  this._tests = [];
  this._running = false;
  this._testIndex = -1;
};
EzTest._CONST = {
  NOOP: function () {},
  TitleTypeErrorMsg: 'Title has to be a string.',
  TitleEmptyErrorMsg: 'Title can not be empty.',
  TitleMaxLength: 80,
  TitleSizeOverflowErrorMsg: 'Keep title within 80 characters.',
  TestTypeErrorMsg: 'Test function has to be a function.',
  TimeoutTypeErrorMsg: 'Timeout has to be a number.',
  TimeoutRangeErrorMsg: 'Timeout has to be a positive number.',
  NoResultCallbackErrorMsg: 'Final result callback is required.',
  CallbackTypeErrorMsg: 'Expecting a function.',
  AlreadyRunErrorMsg: 'Tests are already running.',
  AddTestWhileRunningErrorMsg: 'Can not add test while running.'
};

/**
 * Adds a sync test.
 * @function
 * @param {string} title The title of the test. Keep it shorter than 80 characters.
 * @param {EzTest~SyncTest} func The test function to be executed. It should return `true` to mark the test as passed.
 * @since 0.0.1
 */
EzTest.prototype.addTest = function (title, func) {
  if (typeof title !== 'string') {
    throw new TypeError(EzTest._CONST.TitleTypeErrorMsg);
  }
  if (title.length <= 0) {
    throw new RangeError(EzTest._CONST.TitleEmptyErrorMsg);
  }
  if (title.length > EzTest._CONST.TitleMaxLength) {
    throw new RangeError(EzTest._CONST.TitleSizeOverflowErrorMsg);
  }
  if (typeof func !== 'function') {
    throw new TypeError(EzTest._CONST.TestTypeErrorMsg);
  }
  if (this._running) {
    throw new Error(EzTest._CONST.AddTestWhileRunningErrorMsg);
  }

  this._tests.push({
    title: title,
    func: func
  });
  this._testCount++;
};

/**
 * Sync test function.
 * @callback EzTest~SyncTest
 * @returns {boolean} `true` to pass the test. Otherwise the test is failed.
 * @since 0.0.1
 */

/**
 * Adds an async test.
 * @function
 * @param {string} title The title of the test. Keep it shorter than 80 characters.
 * @param {EzTest~AsyncTest} func The test function to be executed.
 * @param {number} [timeout=0] Time in milliseconds to wait until failing the test. 0 means no timeout.
 * @since 0.0.1
 */
EzTest.prototype.addAsyncTest = function (title, func, timeout) {
  if (typeof title !== 'string') {
    throw new TypeError(EzTest._CONST.TitleTypeErrorMsg);
  }
  if (title.length <= 0) {
    throw new RangeError(EzTest._CONST.TitleEmptyErrorMsg);
  }
  if (title.length > EzTest._CONST.TitleMaxLength) {
    throw new RangeError(EzTest._CONST.TitleSizeOverflowErrorMsg);
  }
  if (typeof func !== 'function') {
    throw new TypeError(EzTest._CONST.TestTypeErrorMsg);
  }
  if (typeof timeout === 'undefined') {
    timeout = 0;
  }
  if (typeof timeout !== 'number') {
    throw new TypeError(EzTest._CONST.TimeoutTypeErrorMsg);
  }
  if (timeout < 0) {
    throw new RangeError(EzTest._CONST.TimeoutRangeErrorMsg);
  }
  if (this._running) {
    throw new Error(EzTest._CONST.AddTestWhileRunningErrorMsg);
  }

  this._tests.push({
    title: title,
    async: true,
    timeout: timeout,
    func: func
  });
  this._testCount++;
};

/**
 * Async test function.
 * @callback EzTest~AsyncTest
 * @param {function} pass Call this to mark the test as passed.
 * @param {function} fail Call this to mark the test as failed.
 * @since 0.0.1
 */

/**
 * Starts all the tests.
 * @function
 * @param {EzTest~TestSetResultCallback} finalResultCallback
 * @param {EzTest~SingleTestResultCallback} [singleResultCallback=NOOP]
 * @param {boolean} [haltWhenFailed=false] Pass `true` to stop the test set when any test fails.
 * @returns {integer} Test count.
 * @since 0.0.1
 */
EzTest.prototype.runTests = function (finalResultCallback, singleResultCallback, haltWhenFailed) {
  if (typeof finalResultCallback !== 'function') {
    throw new TypeError(EzTest._CONST.NoResultCallbackErrorMsg);
  }
  if (typeof singleResultCallback === 'undefined') {
    singleResultCallback = EzTest._CONST.NOOP;
  }
  if (typeof singleResultCallback !== 'function') {
    throw new TypeError(EzTest._CONST.CallbackTypeErrorMsg);
  }
  haltWhenFailed = Boolean(haltWhenFailed || false);

  if (this._running) {
    throw new Error(EzTest._CONST.AlreadyRunErrorMsg);
  }

  this._running = true;

  // Reset.
  this._passCount = 0;
  this._runCount = 0;
  this._testIndex = -1;

  setTimeout(this._runNext.bind(this, finalResultCallback, singleResultCallback, haltWhenFailed), 0);
  return this._testCount;
};

/**
 * Callback when all tests are run.
 * @callback EzTest~TestSetResultCallback
 * @param {integer} passed How many tests are passed.
 * @param {integer} total How many tests are run. This will be smaller than the total test count if the test run stopped for an exception.
 * @since 0.0.1
 */

/**
 * Callback when a single test is run.
 * @callback EzTest~SingleTestResultCallback
 * @param {string} title Title of the test.
 * @param {boolean} passed `true` if the test is passed.
 * @param {number} duration Time in milliseconds spent in the test. `-1` when test throws.
 * @param {boolean} async `true` if the test is async.
 * @param {boolean} timeout `true` if the test failed due to timeout.
 * @since 0.0.1
 */

EzTest.prototype._runNext = function (finalResultCallback, singleResultCallback, haltWhenFailed) {
  this._testIndex++;
  // Check exit condition.
  if (this._testIndex >= this._tests.length) {
    // All tests are run.
    this._running = false;
    finalResultCallback(this._passCount, this._runCount);
    return;
  }
  // else

  this._runCount++;

  var testCase = this._tests[this._testIndex],
      testState = {
        result: null,
        passed: false,
        startTime: 0,
        endTime: 0,
        timerId: null,
        timedout: false,
        asyncPass: null,
        asyncFail: null,
        asyncActionIgnored: false,
        asyncResultCallback: null
      };
  if (testCase.async) {
    // Async test.
    testState.asyncResultCallback = function (testSet, testCase, singleResultCallback, haltWhenFailed, next) {
      if (this.passed === true) {
        testSet._passCount++;
      }
      singleResultCallback(testCase.title, this.passed, this.endTime - this.startTime, true, this.timedout);
      if (haltWhenFailed && this.passed === false) {
        // Move pointer to the end so the tests will end.
        testSet._testIndex = testSet._tests.length;
      }
      setTimeout(next, 0);
    }.bind(testState, this, testCase, singleResultCallback, haltWhenFailed, this._runNext.bind(this, finalResultCallback, singleResultCallback, haltWhenFailed));
    testState.asyncPass = function () {
      var callTime = Date.now();
      // Cancel timer if present.
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.asyncActionIgnored) {
        return;
      }
      // else

      // Passed without timeout.
      this.endTime = callTime;
      this.passed = true;
      this.asyncResultCallback();
    }.bind(testState);
    testState.asyncFail = function () {
      var callTime = Date.now();
      // Cancel timer if present.
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.asyncActionIgnored) {
        return;
      }
      // else

      // Failed without timeout.
      this.endTime = callTime;
      this.passed = false;
      this.asyncResultCallback();
    }.bind(testState);
    try {
      testState.startTime = Date.now();
      if (testCase.timeout > 0) {
        // Start timeout.
        testState.timerId = setTimeout(function (testCase) {
          // Timeout.
          this.endTime = Date.now();
          this.asyncActionIgnored = true;
          this.passed = false;
          this.timedout = true;
          this.timerId = null;
          this.asyncResultCallback();
        }.bind(testState, testCase), testCase.timeout);
      }
      testState.result = testCase.func(testState.asyncPass, testState.asyncFail);
    } catch(e) {
      if (testState.timerId) {
        clearTimeout(testState.timerId);
        testState.timerId = null;
      }
      console.log(e);
      testState.asyncActionIgnored = true;
      testState.endTime = testState.startTime - 1;
      testState.passed = false;
      testState.result = null;
      testState.asyncResultCallback();
    }
    //!

  } else {
    // Sync test.
    try {
      testState.startTime = Date.now();
      testState.result = testCase.func();
      testState.endTime = Date.now();
    } catch(e) {
      testState.endTime = testState.startTime - 1;
      console.log(e);
      testState.result = null;
    }
    if (testState.result === true) {
      testState.passed = true;
      this._passCount++;
    }
    singleResultCallback(testCase.title, testState.passed, testState.endTime - testState.startTime, false, false);
    if (haltWhenFailed && testState.passed === false) {
      // Move pointer to the end so the tests will end.
      this._testIndex = this._tests.length;
    }
    setTimeout(this._runNext.bind(this, finalResultCallback, singleResultCallback, haltWhenFailed), 0);
  }
};

if (require.main !== module) {
  // Loaded by another script.
  module.exports = EzTest;
}
