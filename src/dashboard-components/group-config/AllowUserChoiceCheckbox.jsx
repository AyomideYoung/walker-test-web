import {useContext} from 'react';
import CallbackContext from './CallbackContext';
import MinMaxSelectableInputs from './MinMaxSelectableInputs';
import {Form} from 'react-bootstrap';


const AllowUserChoiceCheckbox = (props) => {
	let CALLBACKS = useContext(CallbackContext);
	return (
		<Form.Check type="checkbox">
			<Form.Check.Input
				type="checkbox"
				ref={props.userSelectableRef}
				defaultChecked={props.userSelectable ? true : false}
				onChange={CALLBACKS.onUserSelectableChanged}
			/>
			<Form.Check.Label>Allow User Choice</Form.Check.Label>

			<MinMaxSelectableInputs
				{...props}
				hidden={props.userSelectable}
				minSelectableRef={props.minSelectableRef}
				maxSelectableRef={props.maxSelectableRef}
			/>
		</Form.Check>
	);
};

export default AllowUserChoiceCheckbox;