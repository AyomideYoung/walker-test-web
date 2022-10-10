import { TreeView, TreeItem } from "@material-ui/lab";
import { ExpandMoreIcon, RightChevronIcon } from "./editor/q-icon/ChevronIcons";
import QIcon from "./editor/q-icon/QIcon";

let classes = {
	root: "TreeItem",
	label: "TreeItem-label",
	iconContainer: "TreeItem-icon",
	selected: "TreeItem-selected",
};

function hasNoChildren(data) {
	return data.children === undefined || data.children.length === 0;
}

function matchesExpectedId(data, ids) {
	return data.id === ids[0];
}

function isTargetNode(data, ids) {
	return data.id === ids[0] && ids.length === 1;
}

function createBranch(data) {
	return (
		<TreeItem
			label={data.label}
			classes={classes}
			endIcon={<QIcon />}
			key={data.id}
			nodeId={data.id}
		>
			{data.children.map((child) => {
				if (child.children === undefined) return createLeaf(child);
				else return createBranch(child);
			})}
		</TreeItem>
	);
}

function createLeaf(data) {
	return (
		<TreeItem
			classes={classes}
			endIcon={<QIcon />}
			label={data.label}
			key={data.id}
			nodeId={data.id}
		/>
	);
}

let data = {
	label: "root",
	id: "1",
	children: [
		{
			label: "Child one",
			id: "2",
			children: [],
		},
		{
			label: "Child two",
			id: "3",
		},
	],
};

class ModelActions {
	constructor(data = null, delimiter = "/") {
		this.data = data;
		this.selected = null;
		this.delimiter = delimiter;
	}

	updateItem(data, itemTrack, updateFn) {
		let doesNotMatchExpectedId = !matchesExpectedId(data, itemTrack);
		let isNotTargetNode = !isTargetNode(data, itemTrack);

		if (doesNotMatchExpectedId) {
			this.throwNoMatchError(itemTrack);
		} else if (isNotTargetNode) {
			return this._updateExpectedChild(data, itemTrack, updateFn);
		} else {
			return updateFn(data);
		}
	}

	_convertTrackStringtoArray(trackString) {
		return trackString.split(this.delimiter);
	}

	_updateExpectedChild(parent, itemTrack, updateFn) {
		let [parentId, specifiedChildId] = itemTrack;

		if (hasNoChildren(parent))
			throw new Error(`Item ${parentId} has no children`);

		for (let i = 0; i < parent.children.length; i++) {
			let child = parent.children[i];

			if (child.id === specifiedChildId) {
				let updatedChild = this._updateChild(
					child,
					itemTrack,
					updateFn
				);
				let updatedParent = this._updateParentWithResult(
					parent,
					updatedChild,
					i
				);
				return updatedParent;
			}
		}

		//this line should not be called if specified child was found
		throw new Error(`No child with id ${specifiedChildId} was found`);
	}

	_updateChild(child, ids, updateFn) {
		let [, ...remainingIds] = ids;

		let updatedChild = this.updateItem(child, remainingIds, updateFn);

		return updatedChild;
	}

	_updateParentWithResult(parent, result, resultIndex) {
		let { ...dataClone } = parent;

		dataClone.children[resultIndex] = result;

		return dataClone;
	}

	_traverseToFetch(data, ids) {
		if (isTargetNode(data, ids)) {
			return data;
		} else if (data.id === ids[0]) {
			return this._traverseChildren(data, ids);
		} else {
			throw new Error(
				`No child with id exists. Found children until ${ids[0]}`
			);
		}
	}

	_traverseChildren(data, ids) {
		if (hasNoChildren(data))
			throw new Error(`Item ${ids[0]} has no children`);

		for (let child of data.children) {
			if (child.id === ids[1]) {
				let [, ...remainingIds] = ids;
				return this._traverseToFetch(child, remainingIds);
			}
		}
	}

	_throwInvalidDataError() {
		if (this.data === null)
			throw new Error(
				"Data property is null. Initialize it first by calling setData(<obj>)"
			);
		else if (this.data.id === undefined || this.data.id === null) {
			throw new Error("The root object does not have an id");
		}
	}

	addItem(item) {
		const addFunction = (data) => {
			let clone = { ...data };

			if (hasNoChildren(clone)) clone.children = [];

			clone.children.push(item);
			return clone;
		};
		let ids = this._convertTrackStringtoArray(item.track);

		if (this.data === null || this.data.id === undefined)
			this._throwInvalidDataError();

		let updatedData = this.updateItem(this.data, ids, addFunction);
		this.data = updatedData;
		console.log(JSON.parse(JSON.stringify(updatedData)));
	}

	deleteItem(deleteParams) {
		let deleteFunction = (data) => {
			let clone = { ...data };

			if (hasNoChildren(data)) {
				return data;
			} else {
				let filtered = clone.children.filter(
					(e) => e.id !== deleteParams.targetId
				);
				clone.children = filtered;
				return clone;
			}
		};

		let itemParentTrack = this._convertTrackStringtoArray(
			deleteParams.parentTrack
		);
		let updatedData = this.updateItem(
			this.data,
			itemParentTrack,
			deleteFunction
		);
		this.data = updatedData;

		console.log(JSON.parse(JSON.stringify(updatedData)));
	}

	addAbsolute(track, item) {
		let newItem = { ...item, track: track };
		return this.addItem(newItem);
	}

	deleteAbsolute(track) {
		let ids = [...this._convertTrackStringtoArray(track)];
		let [itemId, ...ancestorIdsInReverse] = ids.reverse();
		let ancestorIds = ancestorIdsInReverse.reverse();

		return this.deleteItem({
			targetId: itemId,
			parentTrack: ancestorIds.join("/"),
		});
	}

	replaceData(newData) {
		this.data = newData;
	}

	setSelected(selected) {
		this.selected = selected;
	}

	setSelectedAbsolute(track) {
		let target = this._traverseToFetch(this.data, track);
		this.setSelected(target);
	}

	getSelected() {
		return this.selected;
	}

	getData() {
		return { ...this.data };
	}

	nextItem(arg) {
		if (typeof arg === "string") {
			return this._getNextItemByTrack(arg);
		} else if (typeof arg === "object") {
			return this._getNextItemByTrack(arg.track);
		}
	}

	
	_getNextItemByTrack(trackString) {
		let track = [...this._convertTrackStringtoArray(trackString)];
		let ids = track.slice(0, track.length - 1);
		let parent = this._traverseToFetch(this.data, ids);

		parent.children = parent.children ? parent.children : [];

		let hasFoundCurrent = false;
		for (let i = 0; i < parent.children?.length; i++) {
			let child = parent.children[i];

			if (hasFoundCurrent) {
				return child;
			} else if (child.track === trackString) {
				hasFoundCurrent = true;
			}
		}

		return null;
	}

	previousItem(arg) {
		if (typeof arg === "string") {
			return this._getPreviousItemByTrack(arg);
		} else if (typeof arg === "object") {
			return this._getPreviousItemByTrack(arg.track);
		}
	}

	_getPreviousItemByTrack(trackString) {
		let track = [...this._convertTrackStringtoArray(trackString)];
		let ids = track.slice(0, track.length - 1);
		let parent = this._traverseToFetch(this.data, ids);

		parent.children = parent.children ? parent.children : [];

		
		for (let i = 0; i < parent.children?.length; i++) {
			let child = parent.children[i];
 
			if (child.track === trackString) {
				return parent.children[i-1]
			}
		}

		return null;
	}


	throwNoMatchError(itemTrack) {
		throw new Error(
			`No child with id exists. Found children until ${itemTrack[0]}`
		);
	}
}

function testActions() {
	let data = {
		id: "root",
		children: [
			{
				id: "b1",
			},
			{
				id: "b2",
				label: "drunk",
			},
		],
	};

	let actions = new ModelActions(data);

	actions.deleteAbsolute("root/b2");
	console.log(JSON.parse(JSON.stringify(actions.getData())));
}

testActions();

const Tree = (props) => {
	return (
		<TreeView
			onNodeSelect={(ev, val) => console.log(val)}
			defaultCollapseIcon={<RightChevronIcon />}
			defaultExpandIcon={<ExpandMoreIcon />}
		>
			{createBranch(data)}
		</TreeView>
	);
};

export default Tree;
