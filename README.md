State Manager
=============

With this library you can keep track of state changes and register actions to be performed when leaving/entering certain states.

State Change Flow
-----------------
(* Return false to abort the change.)

>> BeforeLeave* --> BeforeEnter* --> AfterLeave --> AfterEnter --> Monitor

Example
-------

```JavaScript
// Suppose we have states A, B, C, D which form the following graph.
// A -> C
// |    |
// v    v
// B -> D
//
// A can only transit to B and C but nothing else.
// B and C can only transit to D.
// D can't transit to any other states.

var stateMan = STATEMAN('graph');

// Set initial state.
stateMan.setState('A');

// Register actions to regulate state transitions.
// Prevent leaving state A for any state other than B and C.
stateMan.registerActionBeforeLeavingState('A', function (nextState, currState) {
  if (['B', 'C'].indexOf(nextState) === -1) {
    // Return false to prevent state change.
    return false;
  }
});
// Prevent leaving state B for any state other than D.
stateMan.registerActionBeforeLeavingState('B', function (nextState, currState) {
  if (['D'].indexOf(nextState) === -1) {
    // Return false to prevent state change.
    return false;
  }
});
// Prevent leaving state C for any state other than D.
stateMan.registerActionBeforeLeavingState('C', function (nextState, currState) {
  if (['D'].indexOf(nextState) === -1) {
    // Return false to prevent state change.
    return false;
  }
});
// Prevent leaving state D.
stateMan.registerActionBeforeLeavingState('D', function (nextState, currState) {
  // Return false to prevent state change.
  return false;
});

console.log(stateMan.getState()); //'A'
stateMan.setState('D');
console.log(stateMan.getState()); //'A'
stateMan.setState('B');
console.log(stateMan.getState()); //'B'
stateMan.setState('A');
console.log(stateMan.getState()); //'B'
stateMan.setState('C');
console.log(stateMan.getState()); //'B'
stateMan.setState('D');
console.log(stateMan.getState()); //'D'
```

API Reference
-------------

See [api.md](stateman/api.md).
