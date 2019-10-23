import * as React from "react";

class Footer extends React.Component {

	render() {
		return (
			<div className="footer">
				<div className="legal">
					<ul className="legal-top">
						<li>Privacy</li>
						<li>Terms</li>
					</ul>
					<p>© Zerochass, LLC. All rights reserved.</p>
				</div>
			</div>
		);
	}
}

export { Footer };