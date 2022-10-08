import CallbackContext from "./CallbackContext";
import { useRef } from "react";
import Form from "react-bootstrap/Form";
import PredefinedQuestionsFormToggle from "./PredefinedQuestionsFormToggle";
import RandomQuestionsFormToggle from "./RandomQuestionsFormToggle";
import {
	SUB_GROUP_PROPERTIES_MODIFIER as subGroupPropertiesModifier,
	CONFIG_MODIFIER as configModifier,
	SUB_GROUP_PROPERTIES_GROUP_MODIFIER,
} from "../../state-methods";

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

	const setRandomizeAllFlag = (flag) => {
		configModifier.set({ ...configModifier.get(), randomizeAll: flag });
	};

	const setRequiredRandomQuestions = (number) => {
		configModifier.set({
			...configModifier.get(),
			requiredRandomQuestions: number,
		});
	};

	const setUserSelectable = (flag) => {
		subGroupPropertiesModifier.set({
			...subGroupPropertiesModifier.get(),
			userSelectable: flag,
		});
	};

	const setPreserveGroupHierarchyInPackage = (flag) => {
		subGroupPropertiesModifier.set({
			...subGroupPropertiesModifier.get(),
			preserveGroupHierachyInPackage: flag,
		});
	};

	const setMinSelectable = (number) => {
		subGroupPropertiesModifier.set({
			...subGroupPropertiesModifier.get(),
			minSelectable: number,
		});
	};

	const setMaxSelectable = (number) => {
		subGroupPropertiesModifier.set({
			...subGroupPropertiesModifier.get(),
			minSelectable: number,
		});
	};

	const toggleCompulsoryFlag = (subGroupIndex) => {
		let newValue =
			!props.config.subGroupProperties.groups[subGroupIndex].compulsory;
		let groupPropertyModifier =
			SUB_GROUP_PROPERTIES_GROUP_MODIFIER.encapsulate(subGroupIndex);

		groupPropertyModifier.set({
			...groupPropertyModifier.get(),
			compulsory: newValue,
		});
	};

	const setNumberOfRequiredQuestions = (subGroupIndex, number) => {
		let groupPropertyModifier =
			SUB_GROUP_PROPERTIES_GROUP_MODIFIER.encapsulate(subGroupIndex);

		groupPropertyModifier.set({
			...groupPropertyModifier.get(),
			numberOfRequiredQuestions: number,
		});
	};

	const changeSubGroupName = (subGroupIndex, newName) => {
		let groupPropertyModifier =
			SUB_GROUP_PROPERTIES_GROUP_MODIFIER.encapsulate(subGroupIndex);

		groupPropertyModifier.set({
			...groupPropertyModifier.get(),
			name: newName,
		});
	};
	//add Ref validator

	const changeOrder = (subGroupIndex, order) => {
		if (props.orderOptions.contains(order)) {
			let groupPropertyModifier =
				SUB_GROUP_PROPERTIES_GROUP_MODIFIER.encapsulate(subGroupIndex);

			groupPropertyModifier.set({
				...groupPropertyModifier.get(),
				order: order,
			});
		} else {
			console.log("Invalid order option");
		}
	};

	const CALLBACKS = {
		onMinSelectableChanged: onMinSelectableChanged,
		onMaxSelectableChanged: onMaxSelectableChanged,
		onRandomizeAllChanged: onRandomizeAllChanged,
		onUserSelectableChanged: onUserSelectableChanged,
		onPreserveGroupHierarchyInPackageChanged:
			onPreserveGroupHierarchyInPackageChanged,
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
