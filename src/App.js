import ErrorModal from "./ErrorModal";
import React from "react";
import DashboardHomeSkeleton from "./skeletons/DashboardHomeSkeleton";
import DashboardHome from "./dashboard-components/DashboardHome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ObjectModifier from "./ObjectModifier";

const App = class App extends React.Component {
	constructor(props) {
		super(props);
		this.loadDataIntoState = this.loadDataIntoState.bind(this);
		this.updateScreen = this.updateScreen.bind(this);
		this.stateModifier = new ObjectModifier(this.state);
		this.state = {
			errorMessageAvailable: false,
			ChildSkeleton: DashboardHomeSkeleton,
			ChildComponent: DashboardHome,
			invalidated: true,
			childState: {},
			url: "http://localhost:8080/db/home",
		};

		this.modifyChildState = this.modifyChildState.bind(this);
		this.clearErrorMsg = this.clearErrorMsg.bind(this);
		this.setErrorMsg = this.setErrorMsg.bind(this);
	}

	showErrorMessage() {
		return <ErrorModal show={true} errorMsg={this.state.errorMsg} onHide={this.clearErrorMsg}/>;
	}

	updateState(modifiedProperties, shouldCreateMissingKeys) {
		let modifiedState = this.stateModifier.deepUpdateObject(
			modifiedProperties,
			shouldCreateMissingKeys
		);
		this.setState({ ...modifiedState });
	}

	updateScreen(params) {
		if (params.url === false) {
			this.updateState(
				{
					command: this.stateModifier.getRetainUnchangedValuesCommand(),
					invalidated: false,
					ChildComponent: params.ChildComponent,
					childState: params.props,
				},
				true
			);
			return;
		}

		this.updateState(
			{
				command: this.stateModifier.getRetainUnchangedValuesCommand(),
				ChildSkeleton: params.ChildSkeleton,
				ChildComponent: params.ChildComponent,
				url: params.url,
				invalidated: true,
			},
			true
		);
	}

	updateChildState(newState) {
		this.updateState(
			{
				command: this.stateModifier.getRetainUnchangedValuesCommand(),
				childState: newState,
			},
			true
		);
	}

	modifyChildState(fn) {
		this.updateChildState(
			fn(
				this.stateModifier.getRetainUnchangedValuesCommand(),
				this.stateModifier.obj
			)
		);
	}

	loadDataIntoState(data) {
		if (data == null) return;

		this.updateState(
			{
				command: this.stateModifier.getRetainUnchangedValuesCommand(),
				invalidated: false,
				childState: data,
			},
			true
		);
	}

	setErrorMsg(msg) {
		this.updateState(
			{
				command: this.stateModifier.getRetainUnchangedValuesCommand(),
				errorMessageAvailable: true,
				errorMsg: msg,
				invalidated: false,
			},
			true
		);
	}

	clearErrorMsg(){
		this.updateState(
			{
				command: this.stateModifier.getRetainUnchangedValuesCommand(),
				errorMessageAvailable: false,
				errorMsg: "",
				invalidated: false,
			},
			true
		);
	}

	genericFetchResponseHandler(response) {
		if (response.ok) return response.json();
		else {
			this.setErrorMsg("Sorry, an error occured");
		}

		return null;
	}

	fetchData() {
		fetch(this.state.url)
			.then(
				this.genericFetchResponseHandler,
				(reason) => {
					this.setErrorMsg(
						`Sorry, we could not connect to the Internet`
					);
					return null;
				}
			)
			.then(this.loadDataIntoState);
	}

	render() {
		if (this.state.invalidated === true) {
			this.fetchData();
			return <this.state.ChildSkeleton />;
		} 
		else
			return (
				<>
				<this.state.ChildComponent
					{...this.state.childState}
					genericFetchResponseHandler = {this.genericFetchResponseHandler}
					modifyState={this.modifyChildState}
					setErrorMsg={this.setErrorMsg}
					updateScreen={this.updateScreen}
				/>
				{this.state.errorMessageAvailable ? this.showErrorMessage(): <></>}
				</>
			);
	}
};
export default App;
