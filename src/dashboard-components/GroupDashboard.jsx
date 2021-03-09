import {
	Container,
	Table,
	Button,
	Modal,
	Form,
	Spinner,
} from "react-bootstrap";
import GroupConfigDashboard from "./GroupConfigDashboard";
import tick from "../tick.svg";
import React, { useState } from "react";
import "./css/GroupDashboard.css";

function GroupDashboard(props) {
	let addNewGroupUrl = "http://localhost:8080/dfonts/f/s";
	let [showModalSpinner, setShowModalSpinner] = useState(false);
	let [showSuccessTick, setShowSuccessTick] = useState(false);
	let newGroupName = React.createRef();

	const showFormModal = () => {
		props.modifyState((currentState) => {
			return {
				...currentState,
				isFormModalVisible: true,
				errorMsg: "",
			};
		});
		setShowModalSpinner(false);
		setShowSuccessTick(false);
	};

	const hideFormModal = () => {
		props.modifyState((currentState) => {
			return { ...currentState, isFormModalVisible: false };
		});
	};

	const hideModalError = () => {
		setModalErrorMsg("");
	};

	const setModalErrorMsg = (msg) => {
		props.modifyState((currentState) => {
			return {
				...currentState,
				errorMsg: msg,
			};
		});
	};

	const addNewGroup = function (e) {
		e.preventDefault();
		setShowModalSpinner(true);

		fetch(addNewGroupUrl)
			.then(
				(response) => {
					return {
						ok: response.ok,
						status: response.status,
						data: response.json,
					};
				},
				(msg) => {
					setModalErrorMsg("Sorry we couldn't connect to the server");
					setShowModalSpinner(false);
				}
			)
			.then(
				(body) => {
					if (!body) {
						setModalErrorMsg(
							"Sorry we couldn't connect to the server"
						);
						setShowModalSpinner(false);
						return;
					}

					if (body.ok) {
						showSuccess();
						setTimeout(hideFormModal, 1000);
					} else if (body.status === 413) {
						setModalErrorMsg(body.data().msg);
						setShowModalSpinner(false);
					} else {
						setModalErrorMsg("Sorry. An error occured");
						setShowModalSpinner(false);
					}
				},
				(reject) => {
					setModalErrorMsg("Sorry. An error occured");
					setShowModalSpinner(false);
				}
			);
	};

	const showSuccess = () => {
		setShowModalSpinner(false);
		setShowSuccessTick(true);
	};

	return (
		<Container fluid>
			<div className="px-4 py-3">
				<h4>Groups</h4>
				<div className="pl-4 ssp-black">
					managed by <span className="ssp-regular h5">User</span>
				</div>
				<hr />
				<Container
					className="justify-content-end my-3 d-flex flex-row"
					fluid
				>
					<Button variant="primary" size="sm" onClick={showFormModal}>
						Add New Group
					</Button>
				</Container>
				<Table striped hover bordered>
					<thead>
						<tr>
							<th>Group name</th>
							<th>Sub-groups</th>
							<th>Registered Users</th>
						</tr>
					</thead>
					<tbody className="ssp-regular">
						{props.groups.map((m, i) => (
							<tr
								key={i}
								onClick={() =>
									props.updateScreen({
										url: false,
										props: {},
										ChildComponent: GroupConfigDashboard,
									})
								}
							>
								<td>{m.name}</td>
								<td>{m.numberOfSubGroups}</td>
								<td>{m.numberOfUsers}</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Modal show={props.isFormModalVisible} onHide={hideFormModal}>
					<Modal.Header closeButton>
						<Modal.Title>New Group</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Label className="ssp-regular h5">
								Group Name:
							</Form.Label>
							<Form.Group>
								<Form.Control
									type="text"
									ref={newGroupName}
									className="h6"
									placeholder="2019 questions"
									disabled={
										showModalSpinner || showSuccessTick
											? "disabled"
											: undefined
									}
								/>
								<Form.Text className="text-danger">
									{props.errorMsg}
								</Form.Text>
							</Form.Group>

							<Button
								variant="success"
								className="ssp-regular h6"
								onClick={addNewGroup}
								type="submit"
								disabled={
									showModalSpinner ? "disabled" : undefined
								}
							>
								<span
									className={
										showModalSpinner || showSuccessTick
											? "hidden"
											: ""
									}
								>
									Submit
								</span>
								<img
									src={tick}
									width="32"
									alt="tick"
									height="32"
									className={showSuccessTick ? "" : "hidden"}
								/>
								<Spinner
									as="span"
									animation="border"
									role="status"
									className={showModalSpinner ? "" : "hidden"}
								/>
							</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</div>
		</Container>
	);
	//add Delete icon for table items
	//test error capability for modal
	//include Post request for form processing
	//change table state on successful addition
	//use form validation
}

export default GroupDashboard;
