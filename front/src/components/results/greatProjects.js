'use client';
import React, { useContext } from 'react';
import { getImageUrl, formatModifierValue, translate, getWikiLink } from '@/helpers';
import ModifiersContext from '@/contexts/modifiersContext';
import { Modifier } from '@/components/results/modifiers';

const ModifiersGroupsPannel = ({ greatProject }) => {
	const { selectGreatProject } = useContext(ModifiersContext)

	const isModifierMatched = (modifierKey) => {
		if (!greatProject.matched_modifiers) return false;
		return greatProject.matched_modifiers.includes(modifierKey);
	}

	return (
		<div>
			{
				Object.keys(greatProject["tier_1"]).length !== 0 &&
				<div className="header modifier-groups-container">
					<div className="image-container" >
						<h4>
							Tier 1
						</h4>
						<button
							className="add-modifiers-button"
							title="Select this great project tier"
							onClick={() => { selectGreatProject(greatProject, greatProject["tier_1"]) }}
						>
							+
						</button>
					</div>
					<div className="modifier-list">
						{
							Object.entries(greatProject["tier_1"]).map((modifier) => {
								return (

									<Modifier
										key={modifier[0]}
										isMatched={isModifierMatched(modifier[0])}
										modifierKey={modifier[0]}
										modifierValue={modifier[1]}
										imageUrl={getImageUrl(modifier[0])}
									/>
								)

							})
						}

					</div>
				</div>
			}
			{
				Object.keys(greatProject["tier_1"]).length !== 0 &&
				<div className="header modifier-groups-container">
					<div className="image-container" >
						<h4>
							Tier 2
						</h4>
						<button
							className="add-modifiers-button"
							title="Select this great project tier"
							onClick={() => { selectGreatProject(greatProject, greatProject["tier_2"]) }}
						>
							+
						</button>
					</div>
					<div className="modifier-list">
						{
							Object.entries(greatProject["tier_2"]).map((modifier) => {
								return (

									<Modifier
										key={modifier[0]}
										isMatched={isModifierMatched(modifier[0])}
										modifierKey={modifier[0]}
										modifierValue={modifier[1]}
										imageUrl={getImageUrl(modifier[0])}
									/>
								)

							})
						}

					</div>
				</div>
			}
			<div className="header modifier-groups-container">
				<div className="image-container" >
					<h4>
						Tier 3
					</h4>
					<button
						className="add-modifiers-button"
						title="Select this great project tier"
						onClick={() => { selectGreatProject(greatProject, greatProject["tier_3"]) }}
					>
						+
					</button>
				</div>
				<div className="modifier-list">
					{
						Object.entries(greatProject["tier_3"]).map((modifier) => {
							return (

								<Modifier
									key={modifier[0]}
									isMatched={isModifierMatched(modifier[0])}
									modifierKey={modifier[0]}
									modifierValue={modifier[1]}
									imageUrl={getImageUrl(modifier[0])}
								/>
							)

						})
					}

				</div>
			</div>
		</div>
	)
}

const GreatProjectsResultHeader = ({ greatProject }) => {

	return (
		< div className="header image-container" >
			<img
				src={getImageUrl(greatProject.name)}
				alt={greatProject.name}
				className="great-projects-image"
			/>
			<h3>
				{translate(greatProject.name)}
			</h3>
		</div >
	)
}

export default class GreatProjects extends React.Component {

	render() {
		const { greatProject } = this.props;

		return (
			<div key={greatProject.name} className="national-ideas-result">

				<GreatProjectsResultHeader greatProject={greatProject} />

				<ModifiersGroupsPannel greatProject={greatProject} />
			</div>
		);
	}
}