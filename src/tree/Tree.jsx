import { TreeView, TreeItem } from "@mui/lab";
import { ExpandMoreIcon, RightChevronIcon } from "../editor/q-icon/ChevronIcons";
import QIcon from "../editor/q-icon/QIcon";

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
			nodeId={`${data.track? data.track + "/" : ""}${data.id}`}
		>
			{data.children.map((child) => {
				if (!child.children) return createLeaf(child);
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
			nodeId={`${data.track? data.track + "/" : ""}${data.id}`}
		/>
	);
}


const Tree = (props) => {
	return (
		<TreeView
			{...props}
			defaultCollapseIcon={<RightChevronIcon />}
			defaultExpandIcon={<ExpandMoreIcon />}
		>
			{createBranch(props.nodes)}
			
		</TreeView>
	);
};

export default Tree;
