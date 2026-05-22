import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import Select from '@/components/select'
import { getApiUrl, translate } from '@/helpers';

export default class Policies extends React.Component {

	componentDidMount() {
		this.performSearch(this.props.modifiers, this.props.form.monarchPower, this.props.form.ideaGroups);
	}

	handleModifierSelect = (modifiers) => {
		this.props.handleModifiersChange(modifiers);
		this.performSearch(modifiers, this.props.form.monarchPower, this.props.form.ideaGroups);
	};

	handleMonarchPowerSelect = (monarchPower) => {
		this.props.handleFormChange({ ...this.props.form, monarchPower: monarchPower.value });
		this.performSearch(this.props.modifiers, monarchPower.value, this.props.form.ideaGroups);
	};


	handleIdeaGroupsSelect = (ideaGroups) => {
		this.props.handleFormChange({ ...this.props.form, ideaGroups: ideaGroups });
		this.performSearch(this.props.modifiers, this.props.form.monarchPower, ideaGroups);
	}

	// Main search with select filter
	performSearch = (modifiers, monarchPower, ideaGroups) => {
		this.props.setLoading(true);
		var query = modifiers.map((modifier) => {
			return `modifiers_filter=${modifier.name}`;
		})

		ideaGroups.forEach((ideaGroup) => {
			query.push(`idea_groups=${ideaGroup.name}`)
		})

		if (monarchPower !== "") {
			query.push(`monarch_powers_filter=${monarchPower}`)
		}

		fetch(getApiUrl(`/policies?${query.join('&')}`))
			.then(response => response.json())
			.then(data => {
				this.props.setSearchResults(data);
			})
			.catch(error => {
				console.error('Search error:', error);
				this.props.setLoading(false);
			});
	};

	render() {
		const optionsWithImages = [
			{ value: 'ADM', label: translate("ADM"), imageUrl: 'icon_powers_administrative' },
			{ value: 'DIP', label: translate("DIP"), imageUrl: 'icon_powers_diplomatic' },
			{ value: 'MIL', label: translate("MIL"), imageUrl: 'icon_powers_military' },
		];

		return (
			<>
				<Select
					options={optionsWithImages}
					placeholder="Select monarch group..."
					onChange={this.handleMonarchPowerSelect}
					value={this.props.form.monarchPower}
				/>
				<MultiselectAutocomplete
					placeholder="Search idea groups..."
					onSelectionChange={this.handleIdeaGroupsSelect}
					apiEndpoint={getApiUrl('/idea_groups')}
					value={this.props.form.ideaGroups}
				/>
				<MultiselectAutocomplete
					placeholder="Search modifiers..."
					onSelectionChange={this.handleModifierSelect}
					apiEndpoint={getApiUrl('/modifiers')}
					value={this.props.modifiers}
				/>
			</>
		)
	}
}