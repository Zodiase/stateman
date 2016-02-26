/**
 * @author Xingchen Hong
 * @version 0.0.1
 * @summary This is a state manager.
 * @module STATEMAN
**/

/* global exports */

/**
 * State change flow: (*Return false to stop)
 * >> BeforeLeave* - BeforeEnter* - AfterLeave - AfterEnter - Monitor ||
 */

/**
 * Callback to be executed before leaving a state.
 * @callback StateManClass~stateBeforeLeaveCallback
 * @param {String} nextState The state leaving for.
 * @param {String} currState The state leaving from.
 * @returns {Boolean} `false` to prevent the change.
 */

/**
 * Callback to be executed before entering a state.
 * @callback StateManClass~stateBeforeEnterCallback
 * @param {String} nextState The state entering.
 * @param {String} currState The state entering from.
 * @returns {Boolean} `false` to prevent the change.
 */

/**
 * Callback to be executed after leaving a state.
 * @callback StateManClass~stateAfterLeaveCallback
 * @param {String} prevState The state left from.
 * @param {String} currState The state left for.
 */

/**
 * Callback to be executed after entering a state.
 * @callback StateManClass~stateAfterEnterCallback
 * @param {String} prevState The state entered from.
 * @param {String} currState The state entered.
 */

/**
 * Callback to be executed when a state change has occurred.
 * @callback StateManClass~stateChangeCallback
 * @param {String} currState The current state.
 * @param {String} prevState The previous state.
 */

// Use @alias to expose members inside IIFE.
;(function (exports) {
  // function wrapped inside
  "use strict";

  var stateMachines = {};

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
   * Executes the actions associated with the specified key, with the altering state.
   * @function
   * @static
   * @param {Object.<String, Array.<Function>>} actionSet
   * @param {String} key
   * @param {Boolean} haltForFalse
   * @param {Array.<*>} actionArgs
   */
  StateManClass.executeActions = function (actionSet, key, haltForFalse, actionArgs) {
    if (typeof actionSet !== 'object') {
      throw new TypeError('Expecting an object.');
    }
    // else

    var actions = actionSet[key];
    if (typeof actions === 'undefined') {
      return true;
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
   * Signals the monitors about the state change.
   * @function
   * @static
   * @param {Array.<Function>} monitors
   * @param {String} currState
   * @param {String} prevState
   */
  StateManClass.signalMonitors = function (monitors, currState, prevState) {
    for (var i = 0, n = monitors.length, monitor; i < n; i++) {
      monitor = monitors[i];

      // Safeguard for function call.
      if (typeof monitor !== 'function') {
        // Ignore non-functions. Although there shouldn't be one.
        continue;
      }
      // else

      monitor(currState, prevState);
    }
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
   * @returns {Boolean} `true` if the change is effective, `false` otherwise.
   */
  StateManClass.prototype.setState = function (newStateName, forceTrigger) {
    if (this._stateLock) {
      return false;
    }
    // else

    newStateName = String(newStateName);
    forceTrigger = Boolean(forceTrigger);

    // Only trigger when state changes, unless force trigger is requested.
    if (newStateName === this._currentState && !forceTrigger) {
      return true;
    }
    // else

    var previousState = this._currentState;

    // Perform leaving actions.
    if (StateManClass.executeActions(this._actionsAfterLeaving, previousState, newStateName) === false) {
      // If any of the actions returns false, the state transition will fail.
      return false;
    }
    // else

    this._stateLock = true;
    this._currentState = newStateName;
    StateManClass.signalMonitors(this._stateMonitors, this._currentState, previousState);
    this._stateLock = false;
    StateManClass.executeActions(this._actionsAfterEntering, this._currentState, previousState);

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

  /**
   * Registers a callback that will be called after entering the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateEnterCallback} action
   */
  StateManClass.prototype.registerEnteringAction = function (stateName, action) {
    if (typeof this._actionsAfterEntering[stateName] === 'undefined') {
      this._actionsAfterEntering[stateName] = [];
    }

    this._actionsAfterEntering[stateName].push(action);
  };

  /**
   * Registers a callback that will be called after leaving the specified state.
   * @function
   * @param {String} stateName
   * @param {StateManClass~stateEnterCallback} action
   */
  StateManClass.prototype.registerLeavingAction = function (stateName, action) {
    if (typeof this._actionsAfterLeaving[stateName] === 'undefined') {
      this._actionsAfterLeaving[stateName] = [];
    }

    this._actionsAfterLeaving[stateName].push(action);
  };

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

    return newStateMachine;
  };

  if (typeof exports === "object" && exports !== null) {
    exports.STATEMAN = STATEMAN;
  }
})(typeof exports === 'undefined' ? window : exports);
