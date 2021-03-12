/* eslint-disable react-hooks/rules-of-hooks */
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
		let input = {
			obj: this.obj,
			changedProperties: modifiedProperties,
			createMissingKeys: shouldCreateMissingKeys,
			retainCommand: this.retainUnchangedValuesCommand,
		};

		this.obj = new DeepUpdater(input).performUpdate().getResult();

		return this.obj;
	}
};

const DeepUpdater = function (input) {
	let createMissingKeys = input.createMissingKeys;
	let retainmentCommand = input.retainCommand;
	this.performUpdate = performUpdate.bind(this);

	function performUpdate() {
		let result = deepUpdateObjectWithModifiedProperties(
			input.obj,
			input.changedProperties
		);
		return new ResultWrapper(result);
	}

	function deepUpdateObjectWithModifiedProperties(obj, mProps) {
		let result;
		let isUnnecessaryUpdate = isDeepUpdateUnnecessary(obj, mProps);

		if (isUnnecessaryUpdate) result = useMPropsAsResult(obj, mProps);
		else result = deepUpdateEachChangedProperty(obj, mProps);

		return result;
	}

	function isDeepUpdateUnnecessary(obj, mProps) {
		let currentObjectHasNoProperties = obj === undefined || obj === {};
		let shouldNotRetainUnchangedValues = !shouldRetainUnchangedValues(
			mProps
		);

		return shouldNotRetainUnchangedValues || currentObjectHasNoProperties;
	}

	function useMPropsAsResult(obj, mProps) {
		let currentObjectHasNoProperties = obj === undefined || obj === {};

		if (!shouldRetainUnchangedValues(mProps)) {
			return mProps;
		} else if (currentObjectHasNoProperties)
			return deepFilterOutRetainmentCommandFromObject(mProps);
	}

	function shouldRetainUnchangedValues(modifiedProperties) {
		let firstModifiedProperty = getFirstProperty(modifiedProperties);
		return firstModifiedProperty === retainmentCommand;
	}

	function getKeys(obj) {
		let modifiedPropertiesKeys = Object.keys(obj);
		return modifiedPropertiesKeys;
	}

	function getFirstProperty(obj) {
		let keys = getKeys(obj);
		let firstProperty = obj[keys[0]];

		return firstProperty;
	}

	function deepUpdateEachChangedProperty(obj, modifiedProperties) {
		let modifiedPropertiesKeys = getKeys(modifiedProperties);
		let [, ...actualmodifiedKeys] = modifiedPropertiesKeys;
		let objClone = cloneObject(obj);

		for (let key of actualmodifiedKeys) {
			if (!createMissingKeys)
				throwErrorIfKeyIsMissingInObject(key, objClone);

			//If modifiedProperties is an array, directly updating currentPropertiesClone
			//without decrementing the key will result in a "hole" at
			//index 0 and may lead to the updates of wrong indices because the retainValue command
			//occupies index 0 in modifiedProperties
			let currentKey = Array.isArray(modifiedProperties) ? key - 1 : key;
			let currentValue = getValue(obj, currentKey);
			let modifiedValue = getValue(modifiedProperties, key);

			let updatedProperty = deepUpdatePropertyValue(
				currentValue,
				modifiedValue
			);

			objClone[currentKey] = updatedProperty;
		}
		return objClone;
	}

	function deepUpdatePropertyValue(currentValue, modifiedValue) {
		return deepUpdateObjectWithModifiedProperties(
			currentValue,
			modifiedValue
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

	function deepFilterOutRetainmentCommandFromObject(obj, retainValue) {
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
				deepFilterOutRetainmentCommandFromObject(e, retainValue)
			);
		else {
			return removeRetainValueFromObjectChildren(obj, retainValue);
		}
	}

	function removeRetainValueFromObjectChildren(obj, retainValue) {
		let objKeys = Object.keys(obj);
		let newObj = { ...obj };

		for (let key of objKeys) {
			newObj[key] = deepFilterOutRetainmentCommandFromObject(
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
};

function ResultWrapper(result) {
	this.getResult = () => result;
}

export default ObjectModifier;
