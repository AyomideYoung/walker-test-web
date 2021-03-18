import CallbackContext from "./CallbackContext";
import { useRef } from "react";
import Form from "react-bootstrap/Form";
import PredefinedQuestionsFormToggle from "./PredefinedQuestionsFormToggle";
import RandomQuestionsFormToggle from "./RandomQuestionsFormToggle";

const GroupSettings = (props) => {
	let requiredRandomQuestionsInputRef = useRef();
	let userSelectableRef = useRef();
	let minSelectableRef = useRef();
	let maxSelectableRef = useRef();
	let hierarchyCheckboxRef = useRef();
	let subGroupRequiredQuestionsRef = useRef();

	const onMinSelectableChanged = () => {
		setMinSelectable(parseInt(minSelectableRef.current.value));
	};

	const onMaxSelectableChanged = () => {
		setMaxSelectable(parseInt(maxSelectableRef.current.value));
	};

	const onRandomizeAllChanged = () => {
		setRandomizeAllFlag(requiredRandomQuestionsInputRef.current.checked);
	};

	const onUserSelectableChanged = () => {
		setUserSelectable(userSelectableRef.current.checked);
	};

	const onPreserveGroupHierarchyInPackageChanged = () => {
		setPreserveGroupHierarchyInPackage(
			hierarchyCheckboxRef.current.checked
		);
	};

	const setRandomizeAllFlag = (flag) =>
		props.modifyProperty(flag, "randomizeAll");

	const setRequiredRandomQuestions = (number) =>
		props.modifyProperty(number, "requiredRandomQuestions");

	const setUserSelectable = (flag) =>
		props.modifyProperty(flag, "subGroupProperties", "userSelectable");

	const setPreserveGroupHierarchyInPackage = (flag) =>
		props.modifyProperty(
			flag,
			"subGroupProperties",
			"preserveGroupHierarchyInPackage"
		);

	const setMinSelectable = (number) =>
		props.modifyProperty(number, "subGroupProperties", "minSelectable");

	const setMaxSelectable = (number) =>
		props.modifyProperty(number, "subGroupProperties", "maxSelectable");

	const toggleCompulsoryFlag = (groupIndex) => {
		let newValue = !props.config.subGroupProperties.groups[groupIndex]
			.compulsory;

		props.modifyProperty(
			newValue,
			"subGroupProperties",
			"groups",
			groupIndex,
			"compulsory"
		);
	};

	const setNumberOfRequiredQuestions = (subGroupIndex, number) =>
		props.modifyProperty(
			number,
			"subGroupProperties",
			"___groups",
			subGroupIndex,
			"numberOfRequiredQuestions"
		);

	const changeSubGroupName = (subGroupIndex, newName) =>
		props.modifyProperty(
			newName,
			"subGroupProperties",
			"groups",
			subGroupIndex,
			"name"
		);
	//add Ref validator

	const changeOrder = (groupIndex, order) => {
		if (props.orderOptions.contains(order))
			props.modifyProperty(
				order,
				"subGroupProperties",
				"groups",
				groupIndex,
				"order"
			);
			
		else {
			console.log("Invalid order option");
		}
	};

	const CALLBACKS = {
		onMinSelectableChanged: onMinSelectableChanged,
		onMaxSelectableChanged: onMaxSelectableChanged,
		onRandomizeAllChanged: onRandomizeAllChanged,
		onUserSelectableChanged: onUserSelectableChanged,
		onPreserveGroupHierarchyInPackageChanged: onPreserveGroupHierarchyInPackageChanged,
		changeOrder: changeOrder,
		changeSubGroupName: changeSubGroupName,
		toggleCompulsoryFlag: toggleCompulsoryFlag,
		setNumberOfRequiredQuestions: setNumberOfRequiredQuestions,
	};

	return (
		<CallbackContext.Provider value={CALLBACKS}>
			<div className="py-1">
				<Form>
					<div className="border-bottom setting-header ssp-black">
						Packaging
					</div>
					<Form.Group className="lato-regular pt-1 pl-3">
						<RandomQuestionsFormToggle
							inputRef={requiredRandomQuestionsInputRef}
							randomizeAll={props.config.randomizeAll}
							onRandomizeAllChanged={onRandomizeAllChanged}
							requiredRandomQuestions={
								props.config.requiredRandomQuestions
							}
							totalQuestionsCount={props.config.questionsCount}
						/>
						<PredefinedQuestionsFormToggle
							{...props}
							minSelectableRef={minSelectableRef}
							maxSelectableRef={maxSelectableRef}
							userSelectableRef={userSelectableRef}
							hierarchyCheckboxRef={hierarchyCheckboxRef}
						/>
					</Form.Group>
				</Form>
			</div>
		</CallbackContext.Provider>
	);
};

export default GroupSettings;
