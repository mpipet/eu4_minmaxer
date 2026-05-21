'use client';
import React, { useContext } from 'react';
import { getImageUrl, formatModifierValue, translate, getWikiLink } from '@/helpers';
import ModifiersContext from '@/contexts/modifiersContext';
import { Modifier } from '@/components/results/modifiers';

const ModifiersGroupsPannel = ({ policy }) => {
	const isModifierMatched = (modifierKey) => {
		if (!policy.matched_modifiers) return false;
		return policy.matched_modifiers.includes(modifierKey);
	}

	return (
		<div className="modifier-groups-container">
			<div className="modifier-list">
				{
					Object.entries(policy["flat_modifiers"]).map((modifier) => {
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
	)
}

const PoliciesResultHeader = ({ policy }) => {
	const { selectAdmPolicy, selectDipPolicy, selectMilPolicy } = useContext(ModifiersContext)
	const selecterMapping = {
		"ADM": selectAdmPolicy,
		"DIP": selectDipPolicy,
		"MIL": selectMilPolicy,
	}
	const iconMapping = {
		"ADM": "icon_powers_administrative",
		"DIP": "icon_powers_diplomatic",
		"MIL": "icon_powers_military",
	}

	return (
		< div className="header image-container" >
			<img
				src={getImageUrl(iconMapping[policy["monarch_power"]])}
				alt={policy["monarch_power"]}
			/>
			<h3>
				{translate(policy.name)}
			</h3>
			<button
				className="add-modifiers-button"
				title="Select this policy"
				onClick={() => { selecterMapping[policy["monarch_power"]](policy) }}
			>
				+
			</button>
		</div >
	)
}

export default class Policies extends React.Component {

	render() {
		const { policy } = this.props;
		return (
			<div key={policy.name} className="national-ideas-result">

				<PoliciesResultHeader policy={policy} />
				<div className="header image-container">
					{policy.idea_groups.map((ideaGroup) => {
						return (
							<div key={ideaGroup} className="image-container text-small">
								<img
									src={getImageUrl(ideaGroup)}
									alt={ideaGroup}
									className="modifier-group-icon"
								/>
								{translate(ideaGroup)}
							</div>
						)
					})}
				</div>

				<ModifiersGroupsPannel policy={policy} />
			</div>
		);
	}
}