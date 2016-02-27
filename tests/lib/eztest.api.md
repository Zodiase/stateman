## Modules

<dl>
<dt><a href="#module_EzTest">EzTest</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#EzTest">EzTest</a></dt>
<dd></dd>
</dl>

<a name="module_EzTest"></a>
## EzTest
**Summary**: This is a light weight tester for NPM.  
**Version**: 0.0.1  
**Author:** Xingchen Hong  
<a name="EzTest"></a>
## EzTest
**Kind**: global class  
**Since**: 0.0.1  

* [EzTest](#EzTest)
    * [new EzTest()](#new_EzTest_new)
    * _instance_
        * [.addTest(title, func)](#EzTest+addTest)
        * [.addAsyncTest(title, func, [timeout])](#EzTest+addAsyncTest)
        * [.runTests(finalResultCallback, [singleResultCallback], [haltWhenFailed])](#EzTest+runTests) ⇒ <code>integer</code>
    * _inner_
        * [~SyncTest](#EzTest..SyncTest) ⇒ <code>boolean</code>
        * [~AsyncTest](#EzTest..AsyncTest) : <code>function</code>
        * [~TestSetResultCallback](#EzTest..TestSetResultCallback) : <code>function</code>
        * [~SingleTestResultCallback](#EzTest..SingleTestResultCallback) : <code>function</code>

<a name="new_EzTest_new"></a>
### new EzTest()
Creates a new test set.

<a name="EzTest+addTest"></a>
### ezTest.addTest(title, func)
Adds a sync test.

**Kind**: instance method of <code>[EzTest](#EzTest)</code>  
**Since**: 0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | The title of the test. Keep it shorter than 80 characters. |
| func | <code>[SyncTest](#EzTest..SyncTest)</code> | The test function to be executed. It should return `true` to mark the test as passed. |

<a name="EzTest+addAsyncTest"></a>
### ezTest.addAsyncTest(title, func, [timeout])
Adds an async test.

**Kind**: instance method of <code>[EzTest](#EzTest)</code>  
**Since**: 0.0.1  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| title | <code>string</code> |  | The title of the test. Keep it shorter than 80 characters. |
| func | <code>[AsyncTest](#EzTest..AsyncTest)</code> |  | The test function to be executed. |
| [timeout] | <code>number</code> | <code>0</code> | Time in milliseconds to wait until failing the test. 0 means no timeout. |

<a name="EzTest+runTests"></a>
### ezTest.runTests(finalResultCallback, [singleResultCallback], [haltWhenFailed]) ⇒ <code>integer</code>
Starts all the tests.

**Kind**: instance method of <code>[EzTest](#EzTest)</code>  
**Returns**: <code>integer</code> - Test count.  
**Since**: 0.0.1  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| finalResultCallback | <code>[TestSetResultCallback](#EzTest..TestSetResultCallback)</code> |  |  |
| [singleResultCallback] | <code>[SingleTestResultCallback](#EzTest..SingleTestResultCallback)</code> | <code>NOOP</code> |  |
| [haltWhenFailed] | <code>boolean</code> | <code>false</code> | Pass `true` to stop the test set when any test fails. |

<a name="EzTest..SyncTest"></a>
### EzTest~SyncTest ⇒ <code>boolean</code>
Sync test function.

**Kind**: inner typedef of <code>[EzTest](#EzTest)</code>  
**Returns**: <code>boolean</code> - `true` to pass the test. Otherwise the test is failed.  
**Since**: 0.0.1  
<a name="EzTest..AsyncTest"></a>
### EzTest~AsyncTest : <code>function</code>
Async test function.

**Kind**: inner typedef of <code>[EzTest](#EzTest)</code>  
**Since**: 0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| pass | <code>function</code> | Call this to mark the test as passed. |
| fail | <code>function</code> | Call this to mark the test as failed. |

<a name="EzTest..TestSetResultCallback"></a>
### EzTest~TestSetResultCallback : <code>function</code>
Callback when all tests are run.

**Kind**: inner typedef of <code>[EzTest](#EzTest)</code>  
**Since**: 0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| passed | <code>integer</code> | How many tests are passed. |
| total | <code>integer</code> | How many tests are run. This will be smaller than the total test count if the test run stopped for an exception. |

<a name="EzTest..SingleTestResultCallback"></a>
### EzTest~SingleTestResultCallback : <code>function</code>
Callback when a single test is run.

**Kind**: inner typedef of <code>[EzTest](#EzTest)</code>  
**Since**: 0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Title of the test. |
| passed | <code>boolean</code> | `true` if the test is passed. |
| duration | <code>number</code> | Time in milliseconds spent in the test. `-1` when test throws. |
| async | <code>boolean</code> | `true` if the test is async. |
| timeout | <code>boolean</code> | `true` if the test failed due to timeout. |

