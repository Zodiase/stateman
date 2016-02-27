## Modules

<dl>
<dt><a href="#module_STATEMAN">STATEMAN</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#StateManClass">StateManClass</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#STATEMAN">STATEMAN(stateMachineName)</a></dt>
<dd><p>Finds or creates a state manager with the specified name.</p>
</dd>
</dl>

<a name="module_STATEMAN"></a>
## STATEMAN
**Summary**: This is a state manager.  
**Version**: 0.0.1  
**Author:** Xingchen Hong  
<a name="StateManClass"></a>
## StateManClass
**Kind**: global class  
**Access:** public  

* [StateManClass](#StateManClass)
    * [new StateManClass()](#new_StateManClass_new)
    * _instance_
        * [.getState()](#StateManClass+getState) ⇒ <code>String</code>
        * [.setState()](#StateManClass+setState) ⇒ <code>Boolean</code>
        * [.registerMonitor(monitors)](#StateManClass+registerMonitor)
        * [.registerActionBeforeLeavingState(stateName, action)](#StateManClass+registerActionBeforeLeavingState)
        * [.registerActionBeforeEnteringState(stateName, action)](#StateManClass+registerActionBeforeEnteringState)
        * [.registerActionAfterLeavingState(stateName, action)](#StateManClass+registerActionAfterLeavingState)
        * [.registerActionAfterEnteringState(stateName, action)](#StateManClass+registerActionAfterEnteringState)
        * [.#detach()](#StateManClass+detach)
    * _static_
        * [.executeActions(actions, haltForFalse, actionArgs)](#StateManClass.executeActions) ⇒ <code>Boolean</code>
    * _inner_
        * [~stateBeforeLeaveCallback](#StateManClass..stateBeforeLeaveCallback) ⇒ <code>Boolean</code>
        * [~stateBeforeEnterCallback](#StateManClass..stateBeforeEnterCallback) ⇒ <code>Boolean</code>
        * [~stateAfterLeaveCallback](#StateManClass..stateAfterLeaveCallback) : <code>function</code>
        * [~stateAfterEnterCallback](#StateManClass..stateAfterEnterCallback) : <code>function</code>
        * [~stateChangeCallback](#StateManClass..stateChangeCallback) : <code>function</code>

<a name="new_StateManClass_new"></a>
### new StateManClass()
Creates a new StateManager.

<a name="StateManClass+getState"></a>
### stateManClass.getState() ⇒ <code>String</code>
Returns the current state.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>String</code> - The current state.  
<a name="StateManClass+setState"></a>
### stateManClass.setState() ⇒ <code>Boolean</code>
Sets the current state.State actions and monitors will be called if the new state is different from the current one, or `forceTrigger` is set.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>Boolean</code> - `true` if the change is effective, `false` otherwise.  
<a name="StateManClass+registerMonitor"></a>
### stateManClass.registerMonitor(monitors)
Registers a callback that will be called when the state changes.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| monitors | <code>[stateChangeCallback](#StateManClass..stateChangeCallback)</code> | 

<a name="StateManClass+registerActionBeforeLeavingState"></a>
### stateManClass.registerActionBeforeLeavingState(stateName, action)
Registers a callback that will be called before leaving the specified state.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| stateName | <code>String</code> | 
| action | <code>[stateBeforeLeaveCallback](#StateManClass..stateBeforeLeaveCallback)</code> | 

<a name="StateManClass+registerActionBeforeEnteringState"></a>
### stateManClass.registerActionBeforeEnteringState(stateName, action)
Registers a callback that will be called before entering the specified state.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| stateName | <code>String</code> | 
| action | <code>[stateBeforeEnterCallback](#StateManClass..stateBeforeEnterCallback)</code> | 

<a name="StateManClass+registerActionAfterLeavingState"></a>
### stateManClass.registerActionAfterLeavingState(stateName, action)
Registers a callback that will be called after leaving the specified state.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| stateName | <code>String</code> | 
| action | <code>[stateAfterLeaveCallback](#StateManClass..stateAfterLeaveCallback)</code> | 

<a name="StateManClass+registerActionAfterEnteringState"></a>
### stateManClass.registerActionAfterEnteringState(stateName, action)
Registers a callback that will be called after entering the specified state.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| stateName | <code>String</code> | 
| action | <code>[stateAfterEnterCallback](#StateManClass..stateAfterEnterCallback)</code> | 

<a name="StateManClass+detach"></a>
### stateManClass.#detach()
Removes the cached reference so it can be GCed.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  
<a name="StateManClass.executeActions"></a>
### StateManClass.executeActions(actions, haltForFalse, actionArgs) ⇒ <code>Boolean</code>
Executes the actions with the specified arguments.

**Kind**: static method of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>Boolean</code> - `true` if all actions are performed. `false` otherwise.  

| Param | Type |
| --- | --- |
| actions | <code>Array.&lt;function()&gt;</code> | 
| haltForFalse | <code>Boolean</code> | 
| actionArgs | <code>Array.&lt;\*&gt;</code> | 

<a name="StateManClass..stateBeforeLeaveCallback"></a>
### StateManClass~stateBeforeLeaveCallback ⇒ <code>Boolean</code>
Callback to be executed before leaving a state.

**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>Boolean</code> - `false` to prevent the change.  

| Param | Type | Description |
| --- | --- | --- |
| nextState | <code>String</code> | The state leaving for. |
| currState | <code>String</code> | The state leaving from. |

<a name="StateManClass..stateBeforeEnterCallback"></a>
### StateManClass~stateBeforeEnterCallback ⇒ <code>Boolean</code>
Callback to be executed before entering a state.

**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>Boolean</code> - `false` to prevent the change.  

| Param | Type | Description |
| --- | --- | --- |
| nextState | <code>String</code> | The state entering. |
| currState | <code>String</code> | The state entering from. |

<a name="StateManClass..stateAfterLeaveCallback"></a>
### StateManClass~stateAfterLeaveCallback : <code>function</code>
Callback to be executed after leaving a state.

**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| prevState | <code>String</code> | The state left from. |
| currState | <code>String</code> | The state left for. |

<a name="StateManClass..stateAfterEnterCallback"></a>
### StateManClass~stateAfterEnterCallback : <code>function</code>
Callback to be executed after entering a state.

**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| prevState | <code>String</code> | The state entered from. |
| currState | <code>String</code> | The state entered. |

<a name="StateManClass..stateChangeCallback"></a>
### StateManClass~stateChangeCallback : <code>function</code>
Callback to be executed when a state change has occurred.

**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  

| Param | Type | Description |
| --- | --- | --- |
| currState | <code>String</code> | The current state. |
| prevState | <code>String</code> | The previous state. |

<a name="STATEMAN"></a>
## STATEMAN(stateMachineName)
Finds or creates a state manager with the specified name.

**Kind**: global function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| stateMachineName | <code>String</code> | The name of the state manager. Case-sensitive. |

