/* eslint-disable react-hooks/exhaustive-deps */
import {
	ListGroup,
	Form,
	Col,
	Card,
	Button,
	Container,
	Row,
} from "react-bootstrap";
import "../css/SubGroupList.css";
import arrow from "../../images/white-arrow.svg";
import cross from "../../images/cross.svg";
import cancel from "../../images/x-icon.svg";
import { useRef, useEffect } from "react";
import SubGroupActionTray from "./SubGroupActionTray";

const PseudoElement = (props) => (
	<Form
		className="lato-regular"
		onSubmit={(e) => {
			e.preventDefault();
			props.onSubmit();
		}}
	>
		<Form.Row>
			<Col md="auto" className="px-0">
				<input
					ref={props.pseudoInputRef}
					className="lined-input"
					placeholder="New sub group name"
					size="25"
				/>
			</Col>
			<Col className="align-self-end">
				<Button type="submit" size="sm" variant="secondary">
					<img src={arrow} alt="white-arrow" width="16" />
				</Button>
			</Col>
		</Form.Row>
	</Form>
);

const PseudoElementContainer = (props) => {
	let clearInput = () => (props.pseudoInputRef.current.value = "");

	return (
		<Container
			className={`${
				props.isShowingPseudoElement ? "" : "hidden"
			} px-1 pb-2`}
			fluid
		>
			<Row className="justify-content-between align-items-baseline p-1 pseudo">
				<Col sm="auto">
					<PseudoElement
						show={props.isShowingPseudoElement}
						pseudoInputRef={props.pseudoInputRef}
						onSubmit={props.onSubmit}
					/>
				</Col>
				<Col className="d-flex flex-row-reverse">
					<Button
						size="sm"
						onClick={() => {
							clearInput();
							props.hidePseudoElement();
						}}
						variant="none"
						className="circle gray-btn"
					>
						<img
							className="m-auto"
							src={cancel}
							alt="cancel-icon"
							width="11"
							height="11"
						/>
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

const SubGroupList = (props) => {
	useEffect(() => hidePseudoElement, []);
	console.log(props.items);
	let pseudoInput = useRef();
	let updateSubGroups = (newGroup) => {
		//add new sub group to groups
	};
	let onCreateSubGroupRequest = () => {
		let url = "http://localhost:8080/groups/rfsomething/add-sub";
		fetch(url, {
			method: "POST",
			body: {
				subGroupName: pseudoInput.current.value,
			},
		})
			.then(props.genericFetchResponseHandler, () =>
				props.setErrorMsg("Oh no! We were unable to send that request")
			)
			.then(updateSubGroups, (reason) =>
				props.setErrorMsg("An unexpected error occured")
			);
	};

	let isShowingPseudoElement = props.componentState.isShowingPseudoElement;

	let showPseudoElement = () =>
		props.modifyComponentProperty(true, "isShowingPseudoElement");
	let hidePseudoElement = () =>
		props.modifyComponentProperty(false, "isShowingPseudoElement");

	let deleteSubGroup = (itemIndex) => {
		let { items } = props;
		let { elementList } = props.componentState;

		items.splice(itemIndex, 1);
		elementList.splice(itemIndex, 1);

		props.modifyComponentProperty(elementList, "___elementList");
		props.modifyProperty(items);
	};

	return (
		<Card className="lato-regular mt-2">
			<Card.Header className="p-0">
				<div className="d-flex flex-row-reverse">
					<Button variant="light" onClick={showPseudoElement}>
						<img src={cross} alt="add-icon" width="18" />
					</Button>
				</div>
			</Card.Header>

			<Card.Body className="pt-2">
				<PseudoElementContainer
					isShowingPseudoElement={isShowingPseudoElement}
					pseudoInputRef={pseudoInput}
					showPseudoElement={showPseudoElement}
					hidePseudoElement={hidePseudoElement}
					onSubmit={onCreateSubGroupRequest}
				/>
				<ListGroup>
					{props.items.map((item, i) => (
						<ListGroup.Item key={i} className="py-1 px-2">
							<SubGroupActionTray
								{...item}
								deleteSubGroup={() => deleteSubGroup(i)}
								setErrorMsg={props.setErrorMsg}
								genericFetchResponseHandler={
									props.genericFetchResponseHandler
								}
								updateScreen={props.updateScreen}
								componentState={
									props.componentState.elementList[i]
								}
								modifyComponentProperty={(
									newValue,
									...keys
								) => {
									props.modifyComponentProperty(
										newValue,
										"___elementList",
										i,
										...keys
									);
								}}
								modifyProperty={(newValue, ...keys) =>
									props.modifyProperty(newValue, i, ...keys)
								}
							/>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Card.Body>
		</Card>
	);
};

export default SubGroupList;
