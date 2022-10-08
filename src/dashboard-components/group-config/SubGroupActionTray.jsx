import { createRef, useEffect } from "react";
import { ButtonGroup, Button, Modal } from "react-bootstrap";
import EditingEnvironment from "../../editor/EditingEnvironment";
import bin from "../../images/bin2.svg";
import qEdit from "../../images/q-edit.svg";
import pencil from "../../images/pencil.svg";
import {
	SUB_GROUP_LIST_ELEMENT_LIST_MODIFIER,
	SUB_GROUP_PROPERTIES_GROUP_MODIFIER,
} from "../../state-methods";

const SubGroupActionTray = function (props) {
	let inputRef = createRef();

	const actionTrayComponentStateModifier =
		SUB_GROUP_LIST_ELEMENT_LIST_MODIFIER.encapsulate(props.index);
	const subGroupModifier = SUB_GROUP_PROPERTIES_GROUP_MODIFIER.encapsulate(
		props.index
	);

	const composeSubGroupUrl = () => {
		//return `http://localhost:8080/groups/rf2938s9/subs/${props.id}`
		return "http://localhost:8080/db/home";
	};
	let hasComponentState = !(props.componentState === undefined);
	let { isEditing, isShowingModal } = hasComponentState
		? props.componentState
		: false;

	let setEditing = () => {
		actionTrayComponentStateModifier.set({
			...actionTrayComponentStateModifier.get(),
			isEditing: true,
		});
	};
	let unsetEditing = () => {
		actionTrayComponentStateModifier.set({
			...actionTrayComponentStateModifier.get(),
			isEditing: false,
		});
	};

	let startEditingSubGroupQuestions = () => {
		let url = composeSubGroupUrl();
		props.updateScreen({
			url: false,
			props: [],
			ChildComponent: EditingEnvironment,
		});
	};

	let showModal = () => {
		actionTrayComponentStateModifier.set({
			...actionTrayComponentStateModifier.get(),
			isShowingModal: true,
		});
	};

	let hideModal = () => {
		actionTrayComponentStateModifier.set({
			...actionTrayComponentStateModifier.get(),
			isShowingModal: false,
		});
	};

	let editName = () => {
		subGroupModifier.set({
			...subGroupModifier.get(),
			name: inputRef.current.value,
		});
	};

	//activate link
	let deleteOnServer = () => {
		let url = "http://localhost:8080/groups/rf2938s9/subs/33";
		fetch(url, {
			method: "DELETE",
		}).then(
			(response) => {
				if (response.ok) {
					props.deleteSubGroup();
					hideModal();
				} else {
					hideModal();
					props.setErrorMsg("Sorry, an error occured");
				}
			},
			() => {
				hideModal();
				props.setErrorMsg(
					"Sorry, the operation could not be performed"
				);
			}
		);
	};

	useEffect(() => {
		actionTrayComponentStateModifier.set({
			...actionTrayComponentStateModifier.get(),
			isEditing: false,
			isShowingModal: false,
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isEditing) inputRef.current.focus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditing]);

	return (
		<div className="d-flex flex-row align-items-baseline fluid justify-content-between">
			{!isEditing ? (
				props.name
			) : (
				<input
					type="text"
					ref={inputRef}
					className="lined-input"
					onBlur={unsetEditing}
					onChange={editName}
					defaultValue={props.name}
				/>
			)}

			<Modal show={isShowingModal} onHide={hideModal}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete {props.name}?
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={deleteOnServer} variant="success">
						Yes
					</Button>
					<Button onClick={hideModal} variant="danger">
						No
					</Button>
				</Modal.Footer>
			</Modal>

			<ButtonGroup>
				<Button variant="light" onClick={setEditing}>
					<img
						alt="pencil-icon"
						src={pencil}
						width="18px"
						height="24px"
					/>
				</Button>
				<Button variant="light" onClick={startEditingSubGroupQuestions}>
					<img
						alt="q-edit-icon"
						src={qEdit}
						width="26px"
						height="26px"
					/>
				</Button>
				<Button variant="light" onClick={showModal}>
					<img
						alt="trash-icon"
						src={bin}
						width="18px"
						height="24px"
					/>
				</Button>
			</ButtonGroup>
		</div>
	);
};

export default SubGroupActionTray;
