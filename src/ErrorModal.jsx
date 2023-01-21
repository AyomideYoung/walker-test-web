import Modal from "react-bootstrap/Modal";
import { useState } from "react";

const ErrorModal = function ({ show, errorMsg, onHide}) {
	const [visible, setVisible] = useState(show);

	return (
		<Modal
			show={visible}
			centered
			onHide={() => {
				setVisible(false);
				if (typeof onHide === "function") {
					onHide();
				}
			}}
		>
			<Modal.Header closeButton>
				<Modal.Title>An error occured</Modal.Title>
			</Modal.Header>
			<Modal.Body>{errorMsg}</Modal.Body>
		</Modal>
	);
};

export default ErrorModal;
