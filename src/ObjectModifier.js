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

	function deepUpdateObjectWithModifiedProperties(obj, modifiedProperties) {
		let result;
		let isUnnecessaryUpdate = isDeepUpdateUnnecessary(
			obj,
			modifiedProperties
		);

		if (isUnnecessaryUpdate)
			result = performNonUpdatingActions(obj, modifiedProperties);
		else
			result = updateCurrentPropertiesWithModifiedProperties(
				obj,
				modifiedProperties,
				createMissingKeys,
				retainmentCommand
			);

		return result;
	}

	function isDeepUpdateUnnecessary(obj, modifiedProperties) {
		let currentObjectHasNoProperties = obj === undefined || obj === {};
		let shouldNotRetainUnchangedValues = !shouldRetainUnchangedValues(
			modifiedProperties
		);

		return shouldNotRetainUnchangedValues || currentObjectHasNoProperties;
	}

	function performNonUpdatingActions(obj, modifiedProperties) {
		let shouldNotRetainUnchangedValues = !shouldRetainUnchangedValues(
			modifiedProperties
		);
		let currentObjectHasNoProperties = obj === undefined || obj === {};

		if (shouldNotRetainUnchangedValues) return modifiedProperties;
		else if (currentObjectHasNoProperties)
			return deepFilterOutRetainmentCommandFromObject(modifiedProperties);
	}

	function shouldRetainUnchangedValues(modifiedProperties) {
		let firstModifiedProperty = getFirstModifiedProperty(
			modifiedProperties
		);
		return firstModifiedProperty === retainmentCommand;
	}

	function getModifiedPropertiesKeys(modifiedProperties) {
		let modifiedPropertiesKeys = Object.keys(modifiedProperties);
		return modifiedPropertiesKeys;
	}

	function getFirstModifiedProperty(modifiedProperties) {
		let modifiedPropertiesKeys = getModifiedPropertiesKeys(
			modifiedProperties
		);
		let firstmodifiedProperty =
			modifiedProperties[modifiedPropertiesKeys[0]];

		return firstmodifiedProperty;
	}

	function updateCurrentPropertiesWithModifiedProperties(
		currentProperties,
		modifiedProperties,
		shouldCreateMissingKeys,
		retainUnchangedValuesCommand
	) {
		let modifiedPropertiesKeys = getModifiedPropertiesKeys(
			modifiedProperties
		);
		let [, ...actualmodifiedKeys] = modifiedPropertiesKeys;
		let currentPropertiesClone = cloneObject(currentProperties);

		for (let key of actualmodifiedKeys) {
			if (!shouldCreateMissingKeys)
				throwErrorIfKeyIsMissingInObject(key, currentPropertiesClone);

			//In arrays, directly updating currentPropertiesClone
			//without decrementing the key will result in a "hole" at
			//index 0 and may lead to the updates of wrong indices because the retainValue command
			//occupies index 0 in modifiedProperties
			let currentKey = Array.isArray(modifiedProperties) ? key - 1 : key;
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
