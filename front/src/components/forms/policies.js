import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import Select from '@/components/select'
import { getApiUrl, translate } from '@/helpers';

export default class Policies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedModifiers: [],
			monarchPower: "",
			ideaGroups: [],
			searchResults: [],
		};
	}

	componentDidMount() {
		this.performSearch([], "", []);
	}

	handleModifierSelect = (modifiers) => {
		this.setState({ selectedModifiers: modifiers });
		this.performSearch(modifiers, this.state.monarchPower, this.state.ideaGroups);
	};

	handleMonarchPowerSelect = (monarchPower) => {
		this.setState({ monarchPower: monarchPower.value });
		this.performSearch(this.state.selectedModifiers, monarchPower.value, this.state.ideaGroups);
	};


	handleIdeaGroupsSelect = (ideaGroups) => {
		this.setState({ ideaGroups: ideaGroups });
		this.performSearch(this.state.selectedModifiers, this.state.monarchPower, ideaGroups);
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
				/>
				<MultiselectAutocomplete
					placeholder="Search idea groups..."
					onSelectionChange={this.handleIdeaGroupsSelect}
					apiEndpoint={getApiUrl('/idea_groups')}
				/>
				<MultiselectAutocomplete
					placeholder="Search modifiers..."
					onSelectionChange={this.handleModifierSelect}
					apiEndpoint={getApiUrl('/modifiers')}
				/>

			</>
		)
	}
}