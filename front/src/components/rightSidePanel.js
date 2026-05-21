'use client';
import React, { useContext } from 'react';
import ModifiersContext, { ModifiersProvider } from '@/contexts/modifiersContext';
import { translate, getImageUrl } from '@/helpers';
import { Modifier } from '@/components/results/modifiers';
import Fuse from 'fuse.js'

const computeModifiersFromFlatModifiers = (modifiers, nationalIdeas) => {
	for (const [modifier, value] of Object.entries(nationalIdeas["flat_modifiers"])) {
		if (modifier in modifiers) {
			modifiers[modifier] = modifiers[modifier] + value
		} else {
			modifiers[modifier] = value
		}
	}
}

class Input extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ""
		};
	}
	handleInputChange = (e) => {
		const text = e.target.value;
		this.setState({ text: text });
		this.props.onChange(text)
	};
	render() {
		const { placeholder } = this.props
		const { text } = this.state
		return (
			<>
				<input
					type="text"
					value={text}
					className="input"
					placeholder={placeholder}
					onChange={this.handleInputChange}
				/>
			</>
		);
	}
}

export default class RightSidePanel extends React.Component {
	static contextType = ModifiersContext;
	constructor(props) {
		super(props);

		this.state = {
			search: ""
		};
	}

	onSearchInputChange = (text) => {
		this.setState({ search: text })
	};

	render() {
		const { ideaGroups, nationalIdeas, admPolicies, dipPolicies, milPolicies, greatProjects } = this.context;
		const modifiersGroups = [
			ideaGroups,
			admPolicies,
			dipPolicies,
			milPolicies,
			greatProjects
		]
		const { search } = this.state

		const modifiers = {}
		if (nationalIdeas != null) {
			modifiersGroups.push([nationalIdeas])
		}

		modifiersGroups.forEach((modifiersGroup) => {
			modifiersGroup.forEach((mg) => {
				computeModifiersFromFlatModifiers(modifiers, mg)
			})
		})

		const translated = {}
		Object.keys(modifiers).forEach((key) => {
			translated[translate(key)] = key
		})

		var displayModifiers = []
		if (search !== "") {
			const fuse = new Fuse(Object.keys(translated), {
				threshold: 0.4,
				distance: 45,
				includeScore: true,
				useExtendedSearch: true
			});
			displayModifiers = fuse.search(search).map((match) => { return match.item })
		} else {
			displayModifiers = Object.keys(translated).sort()
		}

		return (
			<div className="modifiers-sumup">
				<div className="form-context-label">
					Applied Modifiers
				</div>

				<div className="modifier-list">

					{
						displayModifiers.length > 0 &&
						<Input
							onChange={this.onSearchInputChange}
							placeholder={"Filter modifiers below"}
						/>
					}
					{
						displayModifiers.map((name) => {
							const modifier = translated[name]
							return (
								<Modifier
									key={modifier}
									modifierKey={modifier}
									modifierValue={modifiers[modifier]}
									imageUrl={getImageUrl(modifier)}
								/>
							)
						})
					}
				</div>
			</div>
		)
	}

}
