import { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import GroupList from "./group-config/GroupList";
import GroupConfig from "./GroupConfig";
import "./css/GroupConfigDashboard.css";
import modifyProperty from "../modifyProperty";

const GroupConfigDashboard = class GroupConfigDashboard extends Component {
	constructor(props) {
		super(props);

		this.groupListUrl = "http://localhost:8080/db/group-list";
		this.groupConfigUrlBase = "http://localhost:8080/db/groups";

		this.modifyGroupConfigState = this.modifyGroupConfigState.bind(this);
		this.modifyComponentState = this.modifyComponentState.bind(this);
		this.modifyComponentProperty = this.modifyComponentProperty.bind(this);
		this.modifyGroupListState = this.modifyGroupListState.bind(this);
		this.onActiveItemChange = this.onActiveItemChange.bind(this);

		this.fetchGroupListAndUpdate();
		this.fetchGroupConfigAndUpdate(1);
	}

	componentDidMount() {
		this.defaultState();
	}

	defaultState() {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				componentState: {
					isGroupListLoaded: false,
					isGroupConfigLoaded: false,
					groupConfig: {
						subGroupList: {
							elementList: [],
						},
					},
				},
				groupList: {},
				groupConfig: {},
			};
		});
	}

	modifyGroupListState(fn) {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				groupList: fn(retainUnchanged),
			};
		});
	}

	modifyComponentState(fn) {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				componentState: fn(retainUnchanged),
			};
		});
	}

	modifyComponentProperty(newValue, ...keys) {
		modifyProperty(this.modifyComponentState, newValue, ...keys);
	}

	modifyGroupConfigState(fn) {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				groupConfig: fn(retainUnchanged),
			};
		});
	}

	changeGroupListItems(items) {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				groupList: {
					command: retainUnchanged,
					items: items,
				},
				componentState: {
					command: retainUnchanged,
					isGroupListLoaded: true,
				},
			};
		});
	}


	replaceGroupConfigState(newState) {
		this.props.modifyState((retainUnchanged) => {
			return {
				command: retainUnchanged,
				groupConfig: newState,
				componentState: {
					command: retainUnchanged,
					isGroupConfigLoaded: true,
				},
			};
		});
	}

	fetchGroupListAndUpdate() {
		fetch(this.groupListUrl)
			.then(this.props.genericFetchResponseHandler, (reason) =>
				this.props.setErrorMsg(
					"Sorry, we couldn't connect to the server"
				)
			)
			.then((data) => {
				if (data) {
					this.changeGroupListItems(data.groups);
				}
			});
	}

	fetchGroupConfigAndUpdate(groupId) {
		fetch(`${this.groupConfigUrlBase}/${groupId}`)
			.then(this.props.genericFetchResponseHandler, (reason) =>
				this.props.setErrorMsg(
					"Sorry, we couldn't connect to the server"
				)
			)
			.then((data) => {
				if (data) {
					this.replaceGroupConfigState(data);
				}
			});
	}

	onActiveItemChange(oldItemId, newItemId) {
		this.fetchGroupConfigAndUpdate(newItemId);
	}

	render() {

		if(this.props.componentState === undefined)
			return null;

		return (
			<Row>
				<Col xs={3}>
					{this.props.componentState.isGroupListLoaded ? (
						<GroupList
							{...this.props.groupList}
							modifyState={this.modifyGroupListState}
							onActiveItemChange={this.onActiveItemChange}
						/>
					) : (
						<></>
					)}
				</Col>
				<Col xs={9}>
					{this.props.componentState.isGroupConfigLoaded ? (
						<Card className="p-3 shadow">
							<GroupConfig
								{...this.props.groupConfig}
								componentState = {this.props.componentState.groupConfig}
								genericFetchResponseHandler={
									this.props.genericFetchResponseHandler
								}
								setErrorMsg={this.props.setErrorMsg}
								modifyState={this.modifyGroupConfigState}
								modifyComponentProperty={(newValue, ...keys) =>
									this.modifyComponentProperty(
										newValue,
										"groupConfig",
										...keys
									)
								}
								updateScreen={this.props.updateScreen}
							/>
						</Card>
					) : (
						<></>
					)}
				</Col>
			</Row>
		);
	}
};

export default GroupConfigDashboard;
