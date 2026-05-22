import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import { getApiUrl } from '@/helpers';

export default class IdeaGroups extends React.Component {
  componentDidMount() {
    this.performSearch(this.props.modifiers);
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

    fetch(getApiUrl(`/idea_groups?${query.join('&')}`))
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