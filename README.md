# Walker Test Web UI

The walker test ui has not implemented routing.
All routing are done using the `updateScreen` method passed to components.

## Updating Screen with `props.updateScreen` or aliases

To update a screen, you call the `updateScreen` method and pass an object to it.
As in

```js
props.updateScreen({});
```

The object passed is not expected to be empty or null. The expected properties are
Property | Description
---------|------------
`url` | A string representing a url. This url should respond with the data the ChildComponent needs to function. The `ChildComponent` property is rendered pending the url response. This is an optional property. If absent, the Component passed to `ChildComponent` will be rendered immediately.
`props` | an object containing all the properties to be passed to the ChildComponent that updateScreen expects.
`ChildComponent` | The React Component that will be displayed after updateScreen has been processed.
`ChildSkeleton` | A React Component representing the skeleton of the ChildComponent. This will only be used if the `url` property is present. Otherwise, the ChildComponent is displayed immediately.

Example :

```jsx
const XElement = ({ name }) => <div> {name} </div>;

const Refresher = ({ updateScreen }) => {
	const onClick = function () {
		updateScreen({
			ChildComponent: XElement,
			props: {
				name: "XElement1",
			},
		});
	};

	return (
		<div>
			<button onClick={onClick}>Refresh</button>
		</div>
	);
};
```

> ### Note
>
> The updateScreen must be passed down from `Refresher`'s parent who inturn has access to the function. A better way may be to pass the function from context.
> XElement would have it as it will be passed as a prop to it automatically.

## State Modification

This section shows the various mechanisms I have tried to manage this project's state with

### 1. `ObjectModifier`

The ObjectModifier makes the editing of deeply nested objects a little bit easier.

For example, say we have an object `data` as

```js
let data = {
	name: "root",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};
```

then to update `data.branches.mockBranch.name` with the `ObjectModifier`, we do

```js
let objectModifier = new ObjectModifier(data);
let retainmentCommand = objectModifier.getRetainUnchangedValuesCommand;

objectModifier.deepUpdateObject(
	{
		command: retainmentCommand,
		branches: {
			command: retainmentCommand,
			mockBranch: {
				command: retainmentCommand,
				name: "Not a mock branch",
			},
		},
	},
	false
);
```

On the surface, this is a verbose way of modifying properties but imagine if we had to change multiple properties at once, including nested ones. That is where the objectModifier really shines. And its input structure makes the object hierachy obvious.

The `ObjectModifier` works like this :

-   Once created, the modifier creates a special object called the retainment command which can be accessed with `modifier.getRetainUnchangedValuesCommand();`
-   To modify the object passed to the constructor, we call `modifier.deepUpdateObject()`

-   The first argument to `deepUpdateObject` is an object representing the values we want to change. We will call this object mProps
-   If `mProps`'s first property doesn't have the retainment command as a value, it replaces the obj completely
-   If `mProps`'s first property has the retainent command present, it replaces only the values specified. Values not specified will not be altered.
-   If there are nested objects in `mProps`, they should have the retainment command as their first property, if they are not supposed to completely replace the nested object the modifier has.

-   The second parameter is a boolean. It indicates whether `mProps` is allowed to introduce properties not already present in the object the modifier is holding.

Examples

Our data:

```js
let data = {
	name: "root",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};
```

Our modifier constants

```js
const modifier = new ObjectModifier(data);
const retainmentCommand = modifier.getRetainUnchangedValuesCommand();
```

Updating with `shouldCreateMissingKeys` set to `false`

```js
modifier.deepUpdateObject(
	{
		retainmentCommand,
		name: "Base",
	},
	false
);
/*returns {
	name: "Base",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};*/

modifier.deepUpdateObject({ retainmentCommand, creator: "John" }, false);
//throws an error because the property 'creator' does not exist in modifier.obj
```

Updating with `shouldCreateMissingKeys` set to `true`

```js
modifier.deepUpdateObject(
	{
		retainmentCommand,
		name: "Base",
	},
	true
);
/*returns {
	name: "Base",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};*/

modifier.deepUpdateObject({ retainmentCommand, creator: "John" }, true);
/*returns {
	name: "root",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
    creator: "John"
};*/
```

Updating without retainment command

```js
modifier.deepUpdateObject({ name: "Base" }, true); // returns {name: "Base"}
```

Updating with retainment command

```js
modifier.deepUpdateObject({ command: retainmentCommand, name: "Base" }, true);
/*returns {
	name: "Base",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};*/
```

Updating nested values

```js
modifier.deepUpdateObject(
	{
		retainmentCommand,
		name: Base,
		branches: {
			retainmentCommand,
			emptyBranch: { state: "INDETERMINATE" },
		},
	},
	true
);
/*returns {
	name: "Base",
	level: 0,
	branches: {
		emptyBranch: {state: "INDETERMINATE"},
		mockBranch: { name: "Mock Branch" },
	},
};*/
```

To update an array, just make sure that its first entry is the retainmentCommand if you do not want to overwrite the existing values.

#### `modifyProperty`

The `modifyProperty` is an extension to the ObjectModifier. It is designed for updating one value only.

It takes a function and an list of keys(string) and creates an `mProps` like object that update the value of the last key.

You use the modifyProperty like this

```js
//create the modification function to pass to modifyProperty
function modifyFunction(getMProps) {
	let mProps = getMProps(retainmentCommand);
	modifier.deepUpdateObject(mProps, true);
}

modifyProperty(modifyFunction, newValue, "branches", "mockBranch", "name");
//Calling modifyProperty passes a function to modifyFunction
//modifyFunction then invokes this passed function
//with the retainment command as an argument,
//and gets the mProps object as a return value.

//The mProps returned should look like
//{
//  retainmentCommand,
//  branches: {
//      retainmentCommand,
//      mockBranch: {
//          retainmentCommand,
//          name: newValue
//      }
//  }
//}
```

Because of its complexity, a straightforward approach is advised, for example,

```js
obj.branches.mockBranch.name = newValue;
```

.Use the straightforward approach unless you are specifically constrained to use the `modifyProperty` function.

> ### NOTE
>
> arrays have to be specified to the modifyProperty function, for example
>
> ```js
> modifyFunction, newValue, "element", "___children", 0;
> ```
>
> the three underscores before children notifies the `modifyProperty` function that the `children property` is an array.

### `ExtensibleStateModifier`

The `ExtensibleStateModifier` is the current state modifier at the time of writing. It is a class developed to create a framework of encapsulation for state modification. For example, if we have:

```js
let data = {
	name: "root",
	level: 0,
	branches: {
		emptyBranch: {},
		mockBranch: { name: "Mock Branch" },
	},
};

let dataModifier = new ExtensibleStateModifier(null, null, data);
let branchesModifier = dataModifier.encapsulate("branches");
```

 `dataModifier` will be able to modify all of its properties and subProperties, while the `branchesModifier` will be limited to `data.branches` only. This ensures that unintended modification do not occur.

It works for arrays too,

```js
let data = {
	name: "Root",
	children: [{ name: "First Child" }, { name: "Second Child" }],
};

let dataModifier = new ExtensibleStateModifier(null, null, data);
let childrenModifier = dataModifier.encapsulate("children");

childrenModifier.set([]);
//This is equivalent to saying data.children = []

let firstChildModifier = childrenModifier.encapsulate(0);
firstChildModifier.set({ name: "First Child, but Modified" });
//This is equivalent to saying data.children[0]= {name: "First Child, but Modified"}

//and so on....
```

The current modifiers are sitting at `./state-methods.js` awaiting a sensible grouping.


## `TreeModel`

The `TreeModel` is a class that represents the model of a tree structure. It contains methods for traversals, selecting and updating the members.

All members must have an `id` and a `track` property. If they will have child nodes, then all of those child nodes must be in an array in the `children` property of their parent. The child nodes must also have their own individual `id`s and `track` properties.

Member properties | Mandate | Description
------------------|----------|-------------
`id` | Required | The id of this member. This should be unique in the tree. While there is no enforcement to check if the `id` property is present, it must be present or it could cause the `TreeModel` instance to crash in many cases.
`track` | Required except in the root | The `track` property is a string of ids separated by a delimiter. It contains the ids of the member's parents from the most remote in the hierachy to the most immediate. For example if the delimiter is `/`, then a child of a member branch2, who is in turn a child of a member branch1 who is the direct descendant of the root member 'root', will have a track similar to `root/branch1/branch2`. The role of a track is to be able to trace a child nodes ancestry. The root member should not have a track.
`children` | Optional | The `children` property contains an array of child nodes that this member has. The children must have a track that ends with this member's id.

### TreeModel Methods




