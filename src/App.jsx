import ErrorModal from "./ErrorModal";
import React from "react";
import DashboardHomeSkeleton from "./skeletons/DashboardHomeSkeleton";
import DashboardHome from "./dashboard-components/DashboardHome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ObjectModifier from "./ObjectModifier";
import { ROOT_MODIFIER } from "./state-methods";

const App = class App extends React.Component {
	constructor(props) {
		super(props);
		this.loadDataIntoState = this.loadDataIntoState.bind(this);
		this.updateScreen = this.updateScreen.bind(this);
		this.stateModifier = new ObjectModifier(this.state);
		this.altStateModifier = ROOT_MODIFIER;
		this.currentRequestId = 0;
		this.state = {
			errorMessageAvailable: false,
			ChildSkeleton: DashboardHomeSkeleton,
			ChildComponent: DashboardHome,
			invalidated: true,
			childState: {},
			url: "http://localhost:8080/db/home",
		};

		this.altStateModifier._data = this.state;
		this.altStateModifier.setCallback(() => {
			this.setState(this.altStateModifier.get());
		});
		
		this.modifyChildState = this.modifyChildState.bind(this);
		this.clearErrorMsg = this.clearErrorMsg.bind(this);
		this.setErrorMsg = this.setErrorMsg.bind(this);
	}

	showErrorMessage() {
		return (
			<ErrorModal
				show={true}
				errorMsg={this.state.errorMsg}
				onHide={this.altClearErrorMsg}
			/>
		);
	}


	updateState(newStateObj) {
		this.altStateModifier.set(newStateObj);
	}

	updateScreen(params) {
		if (params.url === false) {
			this.updateState({
				...this.state,
				invalidated: false,
				ChildComponent: params.ChildComponent,
				childState: params.props,
			});
		} else {
			this.updateState({
				...this.state,
				ChildSkeleton: params.ChildSkeleton,
				ChildComponent: params.ChildComponent,
				url: params.url,
				invalidated: true,
			});
		}
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

	//altUpdateChild will be accessed from state-methods

	modifyChildState(fn) {
		this.updateChildState(
			fn(
				this.stateModifier.getRetainUnchangedValuesCommand(),
				this.stateModifier.obj
			)
		);
	}
	//altModifyChild will be accessed from state-methods
	//all they have to do is ensure that they don't override
	//already existing data

	
	loadDataIntoState(data) {
		if (data == null) return;

		this.updateState({
			...this.state,
			invalidated: false,
			childState: data,
		});
	}

	setErrorMsg(msg) {
		this.updateState({
			...this.state,
			errorMessageAvailable: true,
			errorMsg: msg,
			invalidated: false,
		});
	}

	clearErrorMsg() {
		this.updateState({
			...this.state,
			errorMessageAvailable: false,
			errorMsg: "",
			invalidated: false,
		});
	}

	handleResponse(response, requestId) {
		if (this.currentRequestId !== requestId) return null;

		if (response.ok) {
			return response.json();
		} else {
			this.setErrorMsg("Sorry, an error occured");
			return null;
		}
	}

	//response handle confirm request id

	genericFetchResponseHandler(response) {
		if (response.ok) return response.json();
		else {
			this.setErrorMsg("Sorry, an error occured");
		}

		return null;
	}

	fetchData() {
		let requestId = Math.random();
		this.currentRequestId = requestId;

		fetch(this.state.url)
			.then(
				(response) => this.handleResponse(response, requestId),
				(reason) => {
					console.log(reason);
					this.setErrorMsg(
						`Sorry, we could not connect to the Internet`
					);
				}
			)
			.then(this.loadDataIntoState);
	}

	render() {
		if (this.state.invalidated === true) {
			this.fetchData();
			return <this.state.ChildSkeleton />;
		} else
			return (
				<>
					<this.state.ChildComponent
						{...this.state.childState}
						genericFetchResponseHandler={
							this.genericFetchResponseHandler
						}
						modifyState={this.modifyChildState}
						setErrorMsg={this.setErrorMsg}
						updateScreen={this.updateScreen}
						glop={this}
					/>
					{this.state.errorMessageAvailable ? (
						this.showErrorMessage()
					) : (
						<></>
					)}
				</>
			);
	}
};
export default App;
