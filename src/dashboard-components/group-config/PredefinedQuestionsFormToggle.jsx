import {useContext} from 'react';
import CallbackContext from './CallbackContext';
import AllowUserChoiceCheckbox from './AllowUserChoiceCheckbox';
import SubGroupTable from './SubGroupTable';
import {Form, Container} from 'react-bootstrap';

const PredefinedQuestionsFormToggle = (props) => {
	let CALLBACKS = useContext(CallbackContext);
	return (
		<Form.Check type="radio">
			<Form.Check.Input
				name="configRadios"
				type="radio"
				defaultChecked={!props.config.randomizeAll ? true : false}
				onChange={CALLBACKS.onRandomizeAllChanged}
			/>
			<Form.Check.Label>Predefined</Form.Check.Label>
			<Container
				className={!props.config.randomizeAll ? "" : "hidden"}
				fluid
			>
				<AllowUserChoiceCheckbox
					{...props.config.subGroupProperties}
					minSelectableRef={props.minSelectableRef}
					maxSelectableRef={props.maxSelectableRef}
					userSelectableRef={props.userSelectableRef}
				/>
				<Form.Check
					type="checkbox"
					label="Preserve group hierarchy"
					ref={props.hierarchyCheckboxRef}
					defaultChecked={
						props.config.subGroupProperties
							.preserveGroupHierarchyInPackage
					}
					onChange={
						CALLBACKS.onPreserveGroupHierarchyInPackageChanged
					}
				/>

				<Container fluid>
					<SubGroupTable
						className="pt-3"
						groups={props.config.subGroupProperties.groups}
                        userSelectable={props.config.subGroupProperties.userSelectable}
						orderOptions={props.orderOptions}
						isOrderOptionsLoaded={props.isOrderOptionsLoaded}
					/>
				</Container>
			</Container>
		</Form.Check>
	);
};

export default PredefinedQuestionsFormToggle;