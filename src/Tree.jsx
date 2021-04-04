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

function isCurrentItemInTrack(data, ids) {
	return data.id === ids[0];
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

let modelData = {
	id: "i",
	children: [
		{
			id: "ft",
			name: "cummueil",
			children: [
				{
					id: "rt",
					children: [
						{
							id: "2",
							data: "Cols",
						},
					],
				},
			],
		},
	],
};

class ModelActions {
	constructor(data = null) {
		this.data = data;
		this.selected = null;
	}

	traverseChildrenToUpdateTarget(data, ids, updater) {
		if (this.isTargetNode(data, ids)) return updater(data);

		else if (isCurrentItemInTrack(data, ids))
			return this.findNextItemInChildrenAndUpdate(data, ids, updater);

		else
			throw new Error(
				`No child with id exists. Found children until ${ids[0]}`
			);
	}

	findNextItemInChildrenAndUpdate(data, ids, updater) {
		let [parentId, specifiedChildId] = ids;

		if (hasNoChildren(data))
			throw new Error(`Item ${parentId} has no children`);

		for (let i = 0; i < data.children.length; i++) {
			let child = data.children[i];

			if (child.id === specifiedChildId) {
				return this.updateParentWithModifiedChildData(data, child, i, ids, updater);
			}
		}

		//this line should not be called if specified child was found
		throw new Error(`No child with id ${specifiedChildId} was found`);
	}

	updateParentWithModifiedChildData(data, child, childIndex, ids, updater) {
		let [, ...remainingIds] = ids;
		let { ...dataClone } = data;

		let modifiedChildData = this.traverseChildrenToUpdateTarget(
			child,
			remainingIds,
			updater
		);
		dataClone.children[childIndex] = modifiedChildData;

		return dataClone;
	}

	traverseToFetch(data, ids) {
		if (this.isTargetNode(data, ids)) {
			return data;
		} else if (data.id === ids[0]) {
			return this.traverseChildren(data, ids);
		} else {
			throw new Error(
				`No child with id exists. Found children until ${ids[0]}`
			);
		}
	}

	traverseChildren(data, ids) {
		if (hasNoChildren(data))
			throw new Error(`Item ${ids[0]} has no children`);

		for (let child of data.children) {
			if (child.id === ids[1]) {
				let [, ...remainingIds] = ids;
				return this.traverseToFetch(child, remainingIds);
			}
		}
	}

	isTargetNode(data, ids) {
		return data.id === ids[0] && ids.length === 1;
	}

	addItem(item) {}

	deleteItem(item) {}

	addAbsolute(track, item) {}

	deleteAbsolute(track) {}

	replaceData(newData) {
		this.data = newData;
	}

	setSelected(selected) {
		this.selected = selected;
	}

	setSelectedAbsolute(track) {}

	getSelected() {
		return this.selected;
	}

	getData() {
		return this.data;
	}

	nextItem() {}

	previousItem() {}
}

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

function testModel() {
	let myActions = new ModelActions(modelData);
	myActions.traverse();
	console.log(myActions.getData());
}

testModel();

export default Tree;
