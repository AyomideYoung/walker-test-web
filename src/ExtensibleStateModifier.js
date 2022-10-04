class ExtensibleStateModifier {
	constructor(parent, propertyKeys, data) {
		/**
		 * @private
		 */
		this._data = data;
		/**
		 * @private
		 */
		this.parent = parent;
		/**
		 * @private
		 */
		this._propertyKeys = propertyKeys;

		/**
		 * @private
		 */
		this._afterSet = this._afterSet.bind(this);
		/**
		 * @private
		 */
		this.__callbackFn = () => {};
		this.get = this.get.bind(this);
		this.encapsulate = this.encapsulate.bind(this);
		this.setCallback = this.setCallback.bind(this);
		this.set = this.set.bind(this);
	}

	/**
	 * Creates a new based on this one.
	 * @param  {...string|number} propertyKeys a path to the property
	 * this is allowed to modify.
	 * This property is accessed by
	 * ```javascript
	 * this.data[propertyKeys[0]][propertyKeys[1]]...[propertyKeys[n]]
	 * ```
	 *
	 * @returns
	 * a new ExtensibleStateModifier with this one as a parent.
	 */
	encapsulate(...propertyKeys) {
		return new ExtensibleStateModifier(this, propertyKeys);
		//Mechanism 1
		//set receives an object and performs operation on it
		//if this was created straight from data
		//set will replace the data with new object
		//if created via encapsulation however, set would have to delegate
		//to the parent by taking the new object, finding the propertyNames that it is
		//encapsulating and updating the data and then passing the data to the parent's set

		//TODO afterSet
	}

	/**
	 * Sets the callback to be called after set() operation is complete
	 * @param {function} callbackFn
	 */
	setCallback(callbackFn) {
		this.__callbackFn = callbackFn;
	}

	/** @private */
	_getPropertyToModify(parentData) {
		let propertyToModify;
		for (let i = 0; i < this._propertyKeys.length; i++) {
			if (i === 0) {
				propertyToModify = parentData[this._propertyKeys[i]];
			} else {
				propertyToModify = propertyToModify[this._propertyKeys[i]];
			}
		}

		return propertyToModify;
	}

	/**
	 * @private
	 */
	_updateInParentData(parentData, value, propKeys) {
		let [currentKey, ...latterKeys] = propKeys;
		if (propKeys.length > 1) {
			parentData[currentKey] = this._updateInParentData(
				parentData[currentKey],
				value,
				latterKeys
			);
		} else {
			parentData[currentKey] = value;
		}

		return parentData;
	}

	/**
	 * Sets the data of this {@class ExtensibleStateModifier}. The sets the subset of the parent
	 * data it is allowed to modify if a parent {@class ExtensibleStateModifier} is present.
	 * @param {*} newData the new data
	 *
	 */
	set(newData) {
		if (!this.parent) {
			this._data = newData;
			this._afterSet();
			return;
		} else if (this.parent) {
			let parentData = { ...this.parent.get() };

			this._updateInParentData(parentData, newData, this._propertyKeys);
			this.parent.set(parentData);

			this._afterSet();
		}
	}

	/**@private */
	_afterSet() {
		if (this.__callbackFn && typeof this.__callbackFn === "function") {
			this.__callbackFn();
		}
	}

	/**
	 * Gets the current data or the subset of the parent's current data
	 * it is allowed to see and modify
	 * @returns {object} the data used to construct this object or the subset of parent data
	 * it is allowed to see.
	 */
	get() {
		return this.parent
			? this._getPropertyToModify(this.parent.get())
			: this._data;
	}
}

export default ExtensibleStateModifier;
