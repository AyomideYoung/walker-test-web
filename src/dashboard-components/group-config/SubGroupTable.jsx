import { useContext, createRef } from "react";
import CallbackContext from "./CallbackContext";
import OrderSelect from "./OrderSelect";
import { Table, Button } from "react-bootstrap";

const SubGroupTable = ({
	groups,
	userSelectable,
	orderOptions,
	className,
	isOrderOptionsLoaded,
}) => {
	let requiredQuestionsInputRefs = new Map();
	let CALLBACKS = useContext(CallbackContext);

	for (let group of groups) {
		requiredQuestionsInputRefs.set(group.id, createRef());
	}
	return (
		<Table
			size="sm"
			className={className}
			bordered
			striped
			hover
			responsive
		>
			<thead>
				<tr>
					<th>Group name</th>
					<th>Compulsory</th>
					<th>Questions from this Sub group</th>
					<th>Order</th>
				</tr>
			</thead>
			<tbody>
				{groups.map((group, i) => (
					<tr key={i}>
						<td>{group.name}</td>
						<td>
							<Button
								disabled={userSelectable ? undefined : true}
								onClick={() =>
									userSelectable
										? CALLBACKS.toggleCompulsoryFlag(i)
										: null
								}
								block
								size="sm"
								className="ssp-black fluid"
								variant={
									group.compulsory ? "primary" : "secondary"
								}
							>
								{group.compulsory ? "Yes" : "No"}
							</Button>
						</td>
						<td>
							<input
								ref={requiredQuestionsInputRefs.get(group.id)}
								type="number"
								min={0}
								className="lined-input"
								defaultValue={group.numberOfRequiredQuestions}
								onChange={() => {
									let newValue = requiredQuestionsInputRefs.get(
										group.id
									).current.value;
									CALLBACKS.setNumberOfRequiredQuestions(
										i,
										newValue
									);
								}}
							/>
						</td>
						<td>
							{isOrderOptionsLoaded ? (
								<OrderSelect
									numberOfRequiredQuestions={
										group.numberOfRequiredQuestions
									}
									orderOptions={orderOptions}
									selectedOrder={group.order}
								/>
							) : (
								group.order
							)}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default SubGroupTable;
