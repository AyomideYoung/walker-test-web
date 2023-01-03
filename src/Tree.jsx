import { TreeView, TreeItem } from "@mui/lab";
import { ExpandMoreIcon, RightChevronIcon } from "./editor/q-icon/ChevronIcons";
import QIcon from "./editor/q-icon/QIcon";

let classes = {
	root: "TreeItem",
	label: "TreeItem-label",
	iconContainer: "TreeItem-icon",
	selected: "TreeItem-selected",
};


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



const Tree = (props) => {
	return (
		<TreeView
			onNodeSelect={(ev, val) => console.log(val)}
			defaultCollapseIcon={<RightChevronIcon />}
			defaultExpandIcon={<ExpandMoreIcon />}
		>
			{createBranch(props.nodes)}
		</TreeView>
	);
};

export default Tree;
