import { useState, useRef } from "react";
import { Children } from "react";
import { Overlay, Tooltip } from "react-bootstrap";

const Target = (targetProps) => targetProps.children;

const Tip = (tipProps) => tipProps.children;

function TooltipWrapper(props) {
	let [show, setShow] = useState(false);
	let targetRef = useRef();

    const toggleShow = () => {
        setShow(!show)
    }

	return (
		<div>
			{Children.toArray(props.children).map((c, i) => {
				if (c.type === Target) {
					return (
						<div
                            className="inline-block"
							key={i}
							ref={targetRef}
							onClick={c.props.click ? toggleShow : null}
                            onMouseOver={c.props.hover ? () => setShow(true) : null}
                            onMouseOut={c.props.hover ? () => setShow(false) : null}
						>
							{c}
						</div>
					);
				} else if (c.type === Tip)
					return (
						<Overlay key={i} target={targetRef.current} show={show} placement="bottom">
							{(props) => (
								<Tooltip id="overlay-example" className="font-small" {...props}>
									{c}
								</Tooltip>
							)}
						</Overlay>
					);
				else return c;
			})}
		</div>
	);
}

TooltipWrapper.Target = Target;
TooltipWrapper.Tip = Tip;

export default TooltipWrapper;
