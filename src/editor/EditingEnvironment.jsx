import { Container, Row, Col, Button } from "react-bootstrap";
import TooltipWrapper from "../TooltipWrapper";
import Tree from "@naisutech/react-tree";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
	ClassicEditor,
	InlineEditor,
} from "@ayomide-young/ckeditor5-build-classic-inline";
import "./css/EditingEnvironment.css";
import arrow1 from "../images/arrow-1.svg";
import save_draft from "../images/draft-save.svg";
import preview_icon from "../images/preview.svg";
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

const EditorTray = (props) => (
	<Container className="bg-gray d-flex flex-row-reverse" fluid>
		<TooltipWrapper>
			<TooltipWrapper.Target hover>
				<Button className="gray-btn" size="sm" variant="none">
					<img
						src={preview_icon}
						width="25px"
						height="25px"
						alt="preview icon"
					/>
				</Button>
			</TooltipWrapper.Target>
			<TooltipWrapper.Tip>Show preview</TooltipWrapper.Tip>
		</TooltipWrapper>
		<TooltipWrapper>
			<TooltipWrapper.Target hover>
				<Button className="gray-btn" size="sm" variant="none">
					<img
						src={save_draft}
						width="22px"
						height="22px"
						alt="save draft icon"
					/>
				</Button>
			</TooltipWrapper.Target>
			<TooltipWrapper.Tip>Save draft</TooltipWrapper.Tip>
		</TooltipWrapper>
		<TooltipWrapper>
			<TooltipWrapper.Target hover>
				<Button className="gray-btn" size="sm" variant="none">
					<img
						src={arrow1}
						width="16px"
						height="16px"
						alt="right arrow icon"
					/>
				</Button>
			</TooltipWrapper.Target>
			<TooltipWrapper.Tip>Next question</TooltipWrapper.Tip>
		</TooltipWrapper>
		<TooltipWrapper>
			<TooltipWrapper.Target hover>
				<Button className="gray-btn" size="sm" variant="none">
					<img
						className="rotateZ"
						src={arrow1}
						width="16px"
						height="16px"
						alt="left arrow icon"
					/>
				</Button>
			</TooltipWrapper.Target>
			<TooltipWrapper.Tip>Previous question</TooltipWrapper.Tip>
		</TooltipWrapper>
	</Container>
);

const OptionEditor = (props) => {
	return (
		<div className={props.className}>
			<Row className="align-items-baseline m-0 wt-option big-round">
				<Col xs="auto" className="option-label centered">
					{ALPHABETS.charAt(props.index)}
				</Col>
				<Col className="bg-white option-edit">
					<CKEditor editor={InlineEditor} data={props.data} />
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
					<EditorTray />
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
