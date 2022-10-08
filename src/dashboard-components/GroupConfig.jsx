import TechnoTab from "./TechnoTab.jsx";
import React, { createRef, useState, useEffect } from "react";

import SubGroupList from "./group-config/SubGroupList";
import GroupSettings from "./group-config/GroupSettings";

const GroupConfig = (props) => {
	let nameRef = createRef();
	let [hasMadeOrderOptionsRequest, setMadeOrderOptionsRequest] = useState(
		false
	);
	let [isOrderOptionsLoaded, setOrderOptionsLoaded] = useState(false);
	let [orderOptions, setOrderOptions] = useState([]);

	function fetchOrderOptions(url) {
		fetch(url)
			.then(props.genericFetchResponseHandler, () =>
				props.setErrorMsg("Sorry, we couldn't connect to the server")
			)
			.then((data) => {
				setOrderOptions(data);
				setOrderOptionsLoaded(true);
			});
	}

	let tabs = [
		{
			id: 1,
			name: "Sub groups",
			contentComponent: SubGroupList,
			props: {
				items: props.config.subGroupProperties.groups,
				componentState: props.componentState.subGroupList,
				updateScreen: props.updateScreen,
				setErrorMsg: props.setErrorMsg,
				genericFetchResponseHandler: props.genericFetchResponseHandler,
			},
		},

		{
			id: 2,
			name: "Config",
			contentComponent: GroupSettings,
			props: {
				config: props.config,
				orderOptions: orderOptions,
				isOrderOptionsLoaded: isOrderOptionsLoaded,
				genericFetchResponseHandler: props.genericFetchResponseHandler,
			},
		},
	];

	useEffect(() => {
		if (!hasMadeOrderOptionsRequest) {
			fetchOrderOptions("http://localhost:8080/aux/orderOptions");
			setMadeOrderOptionsRequest(true);
		}
	}, [hasMadeOrderOptionsRequest]);

	return (
		<div>
			<div className="spacious-block position-relative p-3">
				<input
					type="text"
					className="bottom-right position-absolute text-white lined-input"
					defaultValue={props.name}
				/>
			</div>
			<div className="py-2" />
			<TechnoTab tabs={[...tabs]} />
		</div>
	);
};

//Get PropTypes
//delete buttons for groups
//animation onHide
//Finish GroupSettings
//Add save button for settings

export default GroupConfig;
