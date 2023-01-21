import { Container, Row, Col, Button, NavItem } from "react-bootstrap";
import TooltipWrapper from "../TooltipWrapper";
import Tree from "../tree/Tree";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
	ClassicEditor,
	InlineEditor,
} from "@ayomide-young/ckeditor5-build-classic-inline";
import "./css/EditingEnvironment.css";
import arrow1 from "../images/arrow-1.svg";
import save_draft from "../images/draft-save.svg";
import preview_icon from "../images/preview.svg";
import bin from "../images/bin2.svg"
import cross from "../images/cross.svg";
import "./css/ck-theme.css";
import OptionTrayArea from "./OptionTrayArea";
import { Box, ButtonGroup, Chip, chipClasses, IconButton } from "@mui/material";
import {
	Add,
	CheckCircleRounded,
	Circle,
	Delete,
	Newspaper,
} from "@mui/icons-material";
import ModelActions from "../TreeModelActions";
import { useEffect, useState } from "react";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const dummyData = {
	id: "root",
	label: "Question Group",
	children:[{
		id: "sg",
		label: "Unilag Post UTME exam",
		track: "root",
		children: [
			{ id: "Q1", label: "Question 1", track: "root/sg" },
			{ id: "Q2", label: "Question 2", track: "root/sg" },
			{ id: "Q3", label: "Question 3", track: "root/sg" },
			{ id: "Q4", label: "Question 4", track: "root/sg" },
			{ id: "Q5", label: "Question 5", track: "root/sg" },
			{ id: "Q6", label: "Question 6", track: "root/sg" },
		],
	}]
};

const EditorTray = ({ treeModel, setTreeModel }) => {
	const selectNextItem = () => {
		let currentSelected = treeModel.getSelected();

		if (!currentSelected) {
			console.log("No item selected yet");
			return;
		}

		let nextItem = treeModel.nextItem(currentSelected);
		let newTreeModel = new ModelActions(treeModel.getData());
		newTreeModel.setSelected(nextItem);
		setTreeModel(newTreeModel);
	};

	const selectPreviousItem = () => {
		let currentSelected = treeModel.getSelected();

		if (!currentSelected) {
			console.log("No item selected yet");
			return;
		}

		let prevItem = treeModel.previousItem(currentSelected);
		let newTreeModel = new ModelActions(treeModel.getData());
		newTreeModel.setSelected(prevItem);
		setTreeModel(newTreeModel);
	};

	const addQuestion = () => {
		let currentSelected = treeModel.getSelected();
		const premiseValid =
			!currentSelected ||
			!currentSelected.track ||
			currentSelected.track.length === 0;

		const showErrorMessage = () => {
			//Send error Message
			console.log("Select a question or a question in a sub group first");
			return;
		};

		if (premiseValid) {
			showErrorMessage();
		}

		let trackArray = currentSelected.track.split(treeModel.delimiter);
		trackArray.push(currentSelected.id);

		if (trackArray.length < 2) {
			showErrorMessage();
		} else {
			let subGroupTrackArray = trackArray.slice(0, 2);
			let newQuestionId = `${Math.round(Math.random() * 1000)}`;
			let newQuestion = {
				id: newQuestionId,
				label: `Question ${newQuestionId}`,
				track: subGroupTrackArray.join(treeModel.delimiter),
			};

			treeModel.updateItem(
				treeModel.getData(),
				subGroupTrackArray,
				(subGroup) => {
					subGroup.children.push(newQuestion);
					return subGroup;
				}
			);

			let newTreeModel = new ModelActions(treeModel.getData());
			newTreeModel.setSelected(newQuestion);
			setTreeModel(newTreeModel);
		}
	};

	return (
		<Container className="bg-gray d-flex flex-row-reverse my-1" fluid>
			<TooltipWrapper>
				<TooltipWrapper.Target hover>
					<Button className="gray-btn" variant="none">
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
					<Button className="gray-btn" variant="none">
						<img
							src={bin}
							width="22px"
							height="22px"
							alt="delete icon"
						/>
					</Button>
				</TooltipWrapper.Target>
				<TooltipWrapper.Tip>Delete Question</TooltipWrapper.Tip>
			</TooltipWrapper>
			<TooltipWrapper>
				<TooltipWrapper.Target hover>
					<Button className="gray-btn" variant="none">
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
					<Button
						className="gray-btn"
						onClick={selectNextItem}
						variant="none"
					>
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
					<Button
						className="gray-btn"
						onClick={selectPreviousItem}
						variant="none"
					>
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
			<TooltipWrapper>
				<TooltipWrapper.Target hover>
					<Button className="gray-btn" onClick={addQuestion} variant="none">
						<img
							src={cross}
							width="16px"
							height="16px"
							alt="add icon"
						/>
					</Button>
				</TooltipWrapper.Target>
				<TooltipWrapper.Tip>Add Question</TooltipWrapper.Tip>
			</TooltipWrapper>
		</Container>
	);
};

const OptionEditor = (props) => {
	return (
		<div className={props.className}>
			<Row className="align-items-center m-0 wt-option big-round">
				<Col xs="auto" className="option-label centered">
					{ALPHABETS.charAt(props.index)}
				</Col>
				<Col>
					<Row className="align-items-center bg-white">
						<Col className="option-edit">
							<CKEditor editor={InlineEditor} data={props.data} />
						</Col>
						<Col
							xs="auto"
							className="p-0"
							style={{ backgroundColor: "white" }}
						>
							<ButtonGroup>
								<IconButton>
									<CheckCircleRounded />
								</IconButton>
								<IconButton>
									<Delete color="error" />
								</IconButton>
							</ButtonGroup>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

const showOptionEditors = (index) => {
	let optionArray = [];
	for (let i = 0; i < index; i++) {
		optionArray[i] = (
			<OptionEditor
				className="my-1 ssp-black"
				key={i}
				index={i}
				data="<p></p>"
			/>
		);
	}

	return optionArray;
};

const SubGroupIndicator = (props) => (
	<Box
		sx={{
			pb: 1,
		}}
	>
		<Chip
			sx={{
				borderColor: "#0bb431",
				borderWidth: "2px",
				[`& .${chipClasses.icon}`]: {
					color: "#0bb620",
				},
			}}
			icon={<Circle />}
			variant="outlined"
			label={props.subGroupName}
			clickable
		/>
	</Box>
);

const EditingEnvironment = function (props) {
	//May update all of these to general state modifier later
	let [treeModel, setTreeModel] = useState(new ModelActions(dummyData));
	let [mainEditor, setMainEditor] = useState(null);
	let isSelected = treeModel.selected ? true : false;
	let changeQuestionOnView = function (event, selected) {
		let newModel = new ModelActions(treeModel.getData());
		newModel.setSelectedAbsolute(selected);

		setTreeModel(newModel);
	};

	useEffect(() => {
		if (mainEditor !== null) {
			mainEditor.setData(
				isSelected ? treeModel.selected.label : "Start Editing"
			);
		}
	});
	return (
		<Container className="bg-white p-2">
			<Row>
				<Col className="ssp-regular" md={4}>
					<Tree
						nodes={treeModel.getData()}
						onNodeSelect={changeQuestionOnView}
						selected={
							isSelected
								? treeModel.selected.track +
								  treeModel.delimiter +
								  treeModel.selected.id
								: null
						}
					/>
				</Col>
				<Col
					style={{
						fontFamily: "Roboto",
					}}
				>
					<EditorTray
						treeModel={treeModel}
						setTreeModel={setTreeModel}
					/>
					<SubGroupIndicator subGroupName="Unilag Post UME" />
					<CKEditor
						onReady={(editor) => {
							if (mainEditor !== editor) {
								setMainEditor(editor);
							}
						}}
						editor={ClassicEditor}
					/>
					<OptionTrayArea />
					{showOptionEditors(4)}
				</Col>
			</Row>
		</Container>
	);
};

export default EditingEnvironment;
