import { Container, Row, Col } from "react-bootstrap";
import Tree from "@naisutech/react-tree";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
	ClassicEditor,
	InlineEditor,
} from "@ayomide-young/ckeditor5-build-classic-inline";
import "./css/EditingEnvironment.css";
import "./css/ck-theme.css";
import QIcon from "./q-icon/QIcon";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const dummyData = [
	{
		id: 94939,
		label: "Unilag Post UME",
		parentId: null,
		items: [
			{
				id: 30382,
				label: "Question 1",
				parentId: 94939,
				items: null,
			},
			{
				id: 30342,
				label: "Question 2",
				parentId: 94939,
				items: null,
			},
		],
	},
];

const OptionEditor = (props) => {
	return (
		<div className={props.className}>
			<Row className="align-items-baseline m-0 wt-option">
				<Col xs="auto" className="option-label centered">
					{ALPHABETS.charAt(props.index)}
				</Col>
				<Col className="bg-white option-edit">
					<CKEditor editor={InlineEditor} data="<p></p>" />
				</Col>
			</Row>
		</div>
	);
};

const mapOptions = (index) => {
	let optionArray = [];
	for (let i = 0; i < index; i++) {
		optionArray[i] = (
			<OptionEditor className="my-1" key={i} index={i} data="<p></p>" />
		);
	}

	return optionArray;
};

const iconSet = {
	file: <QIcon />,
};

let newTheme = {
	wt_theme: {
		text: "#131513",
		bg: "#fff",
		decal: "#0bb431",
		highlight: "#f1f1f1",
		accent: "#a2cea2",
	},
};

const EditingEnvironment = function (props) {
	return (
		<Container className="bg-white p-2">
			<Row>
				<Col className="ssp-regular" md={4}>
					<Tree
						nodes={dummyData}
						iconSet={iconSet}
						theme="wt_theme"
						customTheme={newTheme}
					/>
				</Col>
				<Col>
					<CKEditor
						editor={ClassicEditor}
						data="<p>Start Editing</p>"
					/>
					
					{mapOptions(5)}
				</Col>
			</Row>
		</Container>
	);
};

export default EditingEnvironment;
