import {useContext} from 'react';
import {Form, Container, Col} from 'react-bootstrap';
import CallbackContext from './CallbackContext';


const RandomQuestionsFormToggle = (props) => {
	let CALLBACKS = useContext(CallbackContext);

	return (
		<Form.Check type="radio">
			<Form.Check.Input
				ref={props.inputRef}
				name="configRadios"
				type="radio"
				defaultChecked={props.randomizeAll ? true : false}
				onChange={CALLBACKS.onRandomizeAllChanged}
			/>
			<Form.Check.Label>Random Questions</Form.Check.Label>
			<Container className={props.randomizeAll ? "" : "hidden"}>
				<Form.Row className="pl-2 align-items-center">
					<Col sm="auto">
						<Form.Label>Number Of Random Questions</Form.Label>
					</Col>
					<Col sm={6}>
						<input
							defaultValue={props.requiredRandomQuestions}
							className="lined-input text-black"
							type="number"
							max={props.totalQuestionsCount}
						/>
					</Col>
				</Form.Row>
			</Container>
		</Form.Check>
	);
};

export default RandomQuestionsFormToggle;
