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
<dd><p>Find or create a state manager with the specified name.</p>
</dd>
</dl>

<a name="module_STATEMAN"></a>
## STATEMAN
**Summary**: This is a state manager.  
**Version**: 1.0.0  
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
    * _static_
        * [.executeActions(actionSet, key, alteringState)](#StateManClass.executeActions)
        * [.signalMonitors(monitors, newState, oldState)](#StateManClass.signalMonitors)
    * _inner_
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
Set the current state.State actions and monitors will be called if the new state is different from the current one, or `forceTrigger` is set.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  
**Returns**: <code>Boolean</code> - `true` if the change is effective, `false` otherwise.  
<a name="StateManClass+registerMonitor"></a>
### stateManClass.registerMonitor(monitors)
Register a callback that will be called when the state changes.

**Kind**: instance method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| monitors | <code>[stateChangeCallback](#StateManClass..stateChangeCallback)</code> | 

<a name="StateManClass.executeActions"></a>
### StateManClass.executeActions(actionSet, key, alteringState)
Execute the actions associated with the specified key, with the altering state.

**Kind**: static method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| actionSet | <code>Object.&lt;String, Array.&lt;function()&gt;&gt;</code> | 
| key | <code>String</code> | 
| alteringState | <code>String</code> | 

<a name="StateManClass.signalMonitors"></a>
### StateManClass.signalMonitors(monitors, newState, oldState)
Signals the monitors about the state change.

**Kind**: static method of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| monitors | <code>Array.&lt;function()&gt;</code> | 
| newState | <code>String</code> | 
| oldState | <code>String</code> | 

<a name="StateManClass..stateChangeCallback"></a>
### StateManClass~stateChangeCallback : <code>function</code>
**Kind**: inner typedef of <code>[StateManClass](#StateManClass)</code>  

| Param | Type |
| --- | --- |
| newState | <code>String</code> | 
| oldState | <code>String</code> | 

<a name="STATEMAN"></a>
## STATEMAN(stateMachineName)
Find or create a state manager with the specified name.

**Kind**: global function  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| stateMachineName | <code>String</code> | The name of the state manager. Case-sensitive. |

