/**
 * @author Xingchen Hong
 * @version 0.0.1
 * @summary This is a state manager.
 * @module STATEMAN
**/

/* global module */

/**
 * State change flow: (*Return false to stop)
 * >> BeforeLeave* - BeforeEnter* - AfterLeave - AfterEnter - Monitor ||
 */

/**
 * Callback to be executed before leaving a state.
 * @callback StateManClass~stateBeforeLeaveCallback
 * @param {String} nextState The state leaving for.
 * @param {String} currState The state leaving from.
 * @param {*} data The data passed from setState, if any.
 * @returns {Boolean} `false` to prevent the change.
 */

/**
 * Callback to be executed before entering a state.
 * @callback StateManClass~stateBeforeEnterCallback
 * @param {String} nextState The state entering.
 * @param {String} currState The state entering from.
 * @param {*} data The data passed from setState, if any.
 * @returns {Boolean} `false` to prevent the change.
 */

/**
 * Callback to be executed after leaving a state.
 * @callback StateManClass~stateAfterLeaveCallback
 * @param {String} prevState The state left from.
 * @param {String} currState The state left for.
 * @param {*} data The data passed from setState, if any.
 */

/**
 * Callback to be executed after entering a state.
 * @callback StateManClass~stateAfterEnterCallback
 * @param {String} prevState The state entered from.
 * @param {String} currState The state entered.
 * @param {*} data The data passed from setState, if any.
 */

/**
 * Callback to be executed when a state change has occurred.
 * @callback StateManClass~stateChangeCallback
 * @param {String} currState The current state.
 * @param {String} prevState The previous state.
 * @param {*} data The data passed from setState, if any.
 */

// Use @alias to expose members inside IIFE.
;(function () {
  // function wrapped inside
  "use strict";

  var stateMachines = {};

  var emptyArray = [];

  /**
   * Creates a new StateManager.
   * @alias StateManClass
   * @public
   * @class
   */
  var StateManClass = function () {
    this._currentState = 'None';
    this._stateLock = false;
    this._actionsBeforeLeave = {};
    this._actionsBeforeEnter = {};
    this._actionsAfterLeave = {};
    this._actionsAfterEnter = {};
    this._stateMonitors = [];
  };

  /**
   * Executes the actions with the specified arguments.
   * @private
   * @function
   * @static
   * @param {Array.<Function>} actions
   * @param {Boolean} haltForFalse
   * @param {Array.<*>} actionArgs
   * @returns {Boolean} `true` if all actions are performed. `false` otherwise.
   */
  StateManClass._executeActions = function (actions, haltForFalse, actionArgs) {
    if (!Array.isArray(actions)) {
      throw new TypeError('Expecting an array.');
    }
    // else

    for (var i = 0, n = actions.length, action, result; i < n; i++) {
      action = actions[i];

      // Safeguard for function call.
      if (typeof action !== 'function') {
        // Ignore non-functions. Although there shouldn't be one.
        continue;
      }
      // else

      result = action.apply(this, actionArgs);
      if (haltForFalse && result === false) {
        return false;
      }
      // else
    }
    return true;
  };

  /**
   * Run a sequence of functions with a given time interval.
   * @private
   * @function
   * @static
   * @param {Array.<Function>} funcs
   * @param {Number} timeout
   */
  StateManClass._setTimeouts = function (funcs, timeout) {
    if (funcs.length <= 0) {
      return;
    }

    var wrap = function (funcs, timeout) {
      var func = funcs.shift();
      func();

      if (funcs.length <= 0) {
        return;
      } else {
        setTimeout(wrap.bind(null, funcs, timeout), timeout);
      }
    };
    setTimeout(wrap.bind(null, funcs, timeout), timeout);
  };

  /**
   * Returns the current state.
   * @function
   * @returns {String} The current state.
   */
  StateManClass.prototype.getState = function () {
    return this._currentState;
  };

  /**
   * Sets the current state.
   * State actions and monitors will be called if the new state is different from the current one, or `forceTrigger` is set.
   * @function
   * @param {String} newStateName The name of the new state.
   * @param {*} data Extra data passed to all actions and monitors.
   * @param {Function} [callback=NOOP] Callback when state change is effective.
   * @param {Boolean} [forceTrigger=false] `true` to trigger actions and monitors even when the state doesn't change.
   * @returns {Boolean} `true` if the change is effective, `false` otherwise.
   */
  StateManClass.prototype.setState = function (newStateName, data, callback, forceTrigger) {
    if (this._stateLock) {
      return false;
    }
    // else

    var nextState = String(newStateName);

    // Only trigger when state changes, unless force trigger is requested.
    if (nextState === this._currentState && !forceTrigger) {
      return true;
    }
    // else

    // Activate lock so actions can't change state.
    this._stateLock = true;

    var prevState = this._currentState;

    // Try to leave current state (prevState).
    if (StateManClass._executeActions.call(
          this,
          this._actionsBeforeLeave[prevState] || emptyArray,
          true,
          [nextState, prevState, data]
        ) === false) {
      // If any of the actions returned false, the state transition fails.
      // Deactivate lock.
      this._stateLock = false;
      return false;
    }
    // else

    // Try to enter new state (nextState).
    if (StateManClass._executeActions.call(
          this,
          this._actionsBeforeEnter[nextState] || emptyArray,
          true,
          [nextState, prevState, data]
        ) === false) {
      // If any of the actions returned false, the state transition fails.
      // Deactivate lock.
      this._stateLock = false;
      return false;
    }
    // else

    // State changed.
    this._currentState = nextState;

    // Deactivate lock.
    this._stateLock = false;

    var actionsAfterSuccess = [
      StateManClass._executeActions.bind(
       this,
       this._actionsAfterLeave[prevState] || emptyArray,
       false,
       [prevState, nextState, data]
     ),
     StateManClass._executeActions.bind(
       this,
       this._actionsAfterEnter[nextState] || emptyArray,
       false,
       [prevState, nextState, data]
     ),
     StateManClass._executeActions.bind(
       this,
       this._stateMonitors,
       false,
       [nextState, prevState, data]
     )
    ];

    if (typeof callback === 'function') {
      actionsAfterSuccess.push(callback.bind(this, data));
    }

    StateManClass._setTimeouts(actionsAfterSuccess, 0);

    return true;
  };

  /**
   * Registers a callback that will be called when the state changes.
   * @function
   * @param {StateManClass~stateChangeCallback} monitors
   */
  StateManClass.prototype.registerMonitor = function (monitor) {
    this._stateMonitors.push(monitor);
  };

  var getActionRegister = function (actionSetName) {
    var propName = '_actions' + String(actionSetName);
    return function (stateName, action) {
      if (typeof this[propName] === 'undefined') {
        throw new TypeError('Invalid Action Set name.');
      }
      // else

      if (typeof this[propName][stateName] === 'undefined') {
        this[propName][stateName] = [];
      }

      this[propName][stateName].push(action);
    };
  };

  /**
   * Registers a callback that will be called before leaving the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateBeforeLeaveCallback} action
   */
  StateManClass.prototype.registerActionBeforeLeavingState = getActionRegister('BeforeLeave');

  /**
   * Registers a callback that will be called before entering the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateBeforeEnterCallback} action
   */
  StateManClass.prototype.registerActionBeforeEnteringState = getActionRegister('BeforeEnter');

  /**
   * Registers a callback that will be called after leaving the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateAfterLeaveCallback} action
   */
  StateManClass.prototype.registerActionAfterLeavingState = getActionRegister('AfterLeave');

  /**
   * Registers a callback that will be called after entering the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateAfterEnterCallback} action
   */
  StateManClass.prototype.registerActionAfterEnteringState = getActionRegister('AfterEnter');

  /**
   * Finds or creates a state manager with the specified name.
   * @alias STATEMAN
   * @public
   * @function
   * @param {String} stateMachineName The name of the state manager. Case-sensitive.
   */
  var STATEMAN = function (stateMachineName) {
    // Return existing instances.
    if (typeof stateMachines[stateMachineName] !== 'undefined') {
      return stateMachines[stateMachineName];
    } // if
    // else

    // Create new state machine.
    var newStateMachine = new StateManClass();
    // Cache it.
    stateMachines[stateMachineName] = newStateMachine;

    // Add detach method.
    /**
     * Removes the cached reference so it can be GCed.
     * @memberof! StateManClass#
     * @function detach
     */
    newStateMachine.detach = function (stateMachineName) {
      delete stateMachines[stateMachineName];
    }.bind(newStateMachine, stateMachineName);

    return newStateMachine;
  };

  (function tryExport () {
    try {
      module.exports = STATEMAN;
    } catch(e) {
      window.STATEMAN = STATEMAN;
    }
  })();
})();
