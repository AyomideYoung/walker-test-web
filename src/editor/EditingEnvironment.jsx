import { Container, Row, Col } from "react-bootstrap";
import Tree from "@naisutech/react-tree";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import QIcon from "./q-icon/QIcon";

const dummyData = [
	{
		id: 94939,
		label: "Unilag Post UME",
		parentId: null,
		items: [
			{
				id: 30382,
				label: "Question 1",
				parentId: 94939,
				items: null,
			},
			{
				id: 30342,
				label: "Question 2",
				parentId: 94939,
				items: null,
			},
		],
	},
];

const iconSet = {
	file: <QIcon />,
};

let newTheme = {
	wt_theme: {
		text: "#131513",
		bg: "#fff",
		decal: "#0bb431",
		highlight: "#f1f1f1",
		accent: "#a2cea2",
	},
};

const EditingEnvironment = function (props) {
	return (
		<Container fluid>
			<Row>
				<Col className="ssp-regular">
					<Tree
						nodes={dummyData}
						iconSet={iconSet}
						theme="wt_theme"
						customTheme={newTheme}
					/>
				</Col>
				<Col>
					<CKEditor
						editor={ClassicEditor}
						disabled={true}
						data="<p>Start Editing...</p>"
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default EditingEnvironment;
