import * as React from "react";

import { Tutorial } from "interfaces/tutorial";

interface Props {
	tutorial: Tutorial;
}

class TutorialCard extends React.Component<Props> {

	render() {
		const { tutorial } = this.props;
		const { color, description, featuredImage } = tutorial;

		return (
			<div className={`tutorial-card tutorial-card--${color.toLowerCase()}`}>
				<a className={`tutorial-card__link`} href={`/tutorial/${tutorial.slug}`}>
					<div>
						<h1 className="tutorial-card__header">{tutorial.title}</h1>
						<p className="tutorial-card__description">{description[0].firstLine}</p>
						<p className="tutorial-card__description">{description[0].secondLine}</p>
					</div>
					{featuredImage.length > 0 && <div className="card-image">
						<img className="tutorial-card__image" src={featuredImage[0].url} />
					</div>}
				</a>
			</div>
		);
	}

}
export { TutorialCard };