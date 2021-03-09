import Form from 'react-bootstrap/Form';

const OrderSelect = (props) => (
	<Form.Control size="sm" as="select" defaultValue={props.selectedOrder}>
		{props.orderOptions.map((option, i) => (
			<option
                key={i}
				value={option}
			>
				{`${option} ${props.numberOfRequiredQuestions}`}
			</option>
		))}
	</Form.Control>
);

export default OrderSelect;