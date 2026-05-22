import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import { getApiUrl } from '@/helpers';

export default class GreatProjects extends React.Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		selectedModifiers: [],
	// 		searchResults: [],
	// 	};
	// }

	componentDidMount() {
		this.performSearch(this.props.form.modifiers);
	}

	handleModifierSelect = (modifiers) => {
		this.props.handleModifiersChange(modifiers)
		this.performSearch(modifiers);
	};

	// Main search with select filter
	performSearch = (modifiers) => {
		this.props.setLoading(true);

		var query = modifiers.map((modifier) => {
			return `modifiers_filter=${modifier.name}`;
		})


		fetch(getApiUrl(`/great_projects?${query.join('&')}`), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
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
		return (
			<>
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