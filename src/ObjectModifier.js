const ObjectModifier = class {
	constructor(obj) {
		this.obj = { ...obj };
		this.retainUnchangedValuesCommand = {
			specialValueForRetainment: Math.random(),
		};
	}

	getRetainUnchangedValuesCommand() {
		return this.retainUnchangedValuesCommand;
	}

	deepUpdateObject(modifiedProperties, shouldCreateMissingKeys) {
		this.obj = deepUpdateObjectWithModifiedProperties(
			this.obj,
			modifiedProperties,
			shouldCreateMissingKeys,
			this.retainUnchangedValuesCommand
		);
		return this.obj;
	}
};
function deepUpdateObjectWithModifiedProperties(
	obj,
	modifiedProperties,
	shouldCreateMissingKeys,
	retainUnchangedValuesCommand
) {
	let result;
	let firstModifiedProperty = getFirstModifiedProperty(modifiedProperties);
	let shouldRetainUnchangedValues =
		firstModifiedProperty === retainUnchangedValuesCommand;

	if (!shouldRetainUnchangedValues) result = modifiedProperties;
	else if (obj === undefined)
		result = filterOutRetainUnchangedValuesCommandFromObjectAndChildren(
			modifiedProperties,
			retainUnchangedValuesCommand
		);
	else
		result = updateCurrentPropertiesWithModifiedProperties(
			obj,
			modifiedProperties,
			shouldCreateMissingKeys,
			retainUnchangedValuesCommand
		);

	return result;
}

function getModifiedPropertiesKeys(modifiedProperties) {
	let modifiedPropertiesKeys = Object.keys(modifiedProperties);
	return modifiedPropertiesKeys;
}

function getFirstModifiedProperty(modifiedProperties) {
	let modifiedPropertiesKeys = getModifiedPropertiesKeys(modifiedProperties);
	let firstmodifiedProperty = modifiedProperties[modifiedPropertiesKeys[0]];

	return firstmodifiedProperty;
}

function updateCurrentPropertiesWithModifiedProperties(
	currentProperties,
	modifiedProperties,
	shouldCreateMissingKeys,
	retainUnchangedValuesCommand
) {
	let modifiedPropertiesKeys = getModifiedPropertiesKeys(modifiedProperties);
	let [, ...actualmodifiedKeys] = modifiedPropertiesKeys;
	let currentPropertiesClone = cloneObject(currentProperties);

	for (let key of actualmodifiedKeys) {
		if (!shouldCreateMissingKeys)
			throwErrorIfKeyIsMissingInObject(key, currentPropertiesClone);

		//In arrays, directly updating currentPropertiesClone
		//without decrementing the key will result in a "hole" at
		//index 0 and may lead to the updates of wrong indices because the retainValue command
		//occupies index 0 in modifiedProperties 
		let currentKey = Array.isArray(modifiedProperties) ? key -1 : key
		let currentValue = getValue(currentProperties, currentKey);
		let modifiedValue = getValue(modifiedProperties, key);

		let updatedProperty = deepUpdatePropertyValue(
			currentValue,
			modifiedValue,
			shouldCreateMissingKeys,
			retainUnchangedValuesCommand
		);
		
		currentPropertiesClone[currentKey] = updatedProperty;
	}
	return currentPropertiesClone;
}

function deepUpdatePropertyValue(
	currentValue,
	modifiedValue,
	shouldCreateMissingKeys,
	retainUnchangedValuesCommand
) {
	return deepUpdateObjectWithModifiedProperties(
		currentValue,
		modifiedValue,
		shouldCreateMissingKeys,
		retainUnchangedValuesCommand
	);
}

function cloneObject(obj) {
	let clone = Array.isArray(obj) ? [] : {};

	Object.assign(clone, obj);
	return clone;
}

function throwErrorIfKeyIsMissingInObject(key, obj) {
	if (!objectHasKey(obj, key)) throwMissingKeyError(key);
}

function objectHasKey(object, key) {
	return Object.keys(object).includes(key);
}

function throwMissingKeyError(key) {
	throw new Error(
		`currentProperties does not have the key '${key}'.` +
			` To fix, either set shouldCreateMissingKeys to true or make sure that` +
			` the currentProperties object has a '${key}' key `
	);
}

function getValue(currentProperties, key) {
	return currentProperties === undefined || currentProperties === null
		? undefined
		: currentProperties[key];
}

function filterOutRetainUnchangedValuesCommandFromObjectAndChildren(
	obj,
	retainValue
) {
	let [first] = Object.keys(obj);
	let newObj;

	if (obj[first] === retainValue) {
		newObj = removeRetainValueFromObj(obj, first);
		newObj = removeRetainValueFromChildren(newObj, retainValue);

		return newObj;
	} else {
		return obj;
	}
}

function removeRetainValueFromChildren(obj, retainValue) {
	if (Array.isArray(obj))
		return obj.map((e) =>
			filterOutRetainUnchangedValuesCommandFromObjectAndChildren(
				e,
				retainValue
			)
		);
	else {
		return removeRetainValueFromObjectChildren(obj, retainValue);
	}
}

function removeRetainValueFromObjectChildren(obj, retainValue) {
	let objKeys = Object.keys(obj);
	let newObj = { ...obj };

	for (let key of objKeys) {
		newObj[
			key
		] = filterOutRetainUnchangedValuesCommandFromObjectAndChildren(
			obj[key],
			retainValue
		);
	}

	return newObj;
}

function removeRetainValueFromObj(obj, retainValueKey) {
	let newObj;

	if (obj instanceof Array) [, ...newObj] = obj;
	else {
		newObj = {};
		Object.assign(newObj, obj);
		delete newObj[retainValueKey];
	}

	return newObj;
}

export default ObjectModifier;
