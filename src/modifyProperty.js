let validateKeys = (keys) => {
	for (let key of keys) {
		if (typeof key != "string" && typeof key != "number")
			throw new Error(
				`${key} must either be a string or a number: found ${typeof key}`
			);
		if (typeof key === "number") parseInt(key);
	}
};

function modifyProperty(modifyFunction, newValue, ...keys) {
	validateKeys(keys);

	modifyFunction((retainValue) => {
		return createModifiedPropertiesObject(retainValue, newValue, ...keys);
	});
}

function createModifiedPropertiesObject(retainValue, newValue, ...keys) {
	let [parentKey, ...subKeys] = keys;
	let result;

	if(isArrayBinding(parentKey)){
		result={command: retainValue};
		parentKey = removeIndicatorsFromKey(parentKey);
		result[parentKey] = createArrayTree(retainValue, newValue, parentKey, ...subKeys);
	}
	else{
		result = createObjectTree(retainValue, newValue, ...keys);
	}

	return result;
}

function removeIndicatorsFromKey(key) {
	if (typeof key === "string" && key.startsWith("___")) {
		return key.substring(3);
	}

	return key;
}

function createArrayTree(retainValue, newValue, ...keys) {
	let root = [retainValue];
	let [, index, ...subKeys] = keys;

	//increment index to preserve the retainValue command in root
	index++;

	if (subKeys.length === 0) root[index] = newValue;
	else {
		root[index] = createModifiedPropertiesObject(
			retainValue,
			newValue,
			...subKeys
		);
	}

	return root;
}

function createObjectTree(retainValue, newValue, ...keys) {
	let root = {command: retainValue};
	let [parentKey, ...subKeys] = keys;

	if (keys.length === 1) root[parentKey] = newValue;
	else {
		root[parentKey] = createModifiedPropertiesObject(
			retainValue,
			newValue,
			...subKeys
		);
	}

	return root;
}

function isArrayBinding(key) {
	return typeof key === "string" && key.startsWith("___");
}

export default modifyProperty;
