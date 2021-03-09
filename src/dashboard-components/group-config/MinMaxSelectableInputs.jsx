import {useContext} from 'react';
import CallbackContext from './CallbackContext';
import {Form, Col, Container} from 'react-bootstrap'

const MinMaxSelectableInputs = (props) => {
	let CALLBACKS = useContext(CallbackContext);

	return (
		<Container className={props.hidden ? "" : "hidden"} fluid>
			<Form.Row className="align-items-baseline">
				<Col sm="auto">
					<Form.Label>Min selectable sub groups</Form.Label>
				</Col>
				<Col sm={6}>
					<input
						defaultValue={props.minSelectable}
						ref={props.minSelectableRef}
						onChange={CALLBACKS.onMinSelectableChanged}
						min={0}
						max={props.groups.length}
						className="lined-input text-black"
						type="number"
					/>
				</Col>
			</Form.Row>

			<Form.Row className="align-items-center">
				<Col sm="auto">
					<Form.Label>Max selectable sub groups</Form.Label>
				</Col>
				<Col sm={6}>
					<input
						ref={props.maxSelectableRef}
						defaultValue={props.maxSelectable}
						onChange={CALLBACKS.onMaxSelectableChanged}
						className="lined-input text-black"
						min={props.minSelectable}
						max={props.groups.length}
						type="number"
					/>
				</Col>
			</Form.Row>
		</Container>
	);
};

export default MinMaxSelectableInputs;