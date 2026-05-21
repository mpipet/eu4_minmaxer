'use client';
import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import Autocomplete from '../autocomplete';
import { getApiUrl } from '@/helpers';
import SortControl from '../sortControl';

export default class NationalIdeas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      selectedTag: {},
      searchResults: [],
      sortField: null,
      sortDirection: 'desc'
    };
  }

  componentDidMount() {
    this.performSearch([], {});
  }

  handleModifierSelect = (modifiers) => {
    this.setState({ fields: modifiers });
    this.performSearch(modifiers, this.state.selectedTag, this.state.sortField, this.state.sortDirection);
  };

  handleTagSelect = (tag) => {
    this.setState({ selectedTag: tag });
    this.performSearch(this.state.fields, tag, this.state.sortField, this.state.sortDirection);
  };

  handleSortChange = (sortField, sortDirection) => {
    this.setState({ sortField: sortField, sortDirection: sortDirection })
    this.performSearch(this.state.fields, this.state.tag, sortField, sortDirection);
  };

  // Main search with select filter
  performSearch = (modifiers, tag, sortField, sortDirection) => {
    this.props.setLoading(true);

    var query = modifiers.map((modifier) => {
      return `modifiers_filter=${modifier.name}`;
    })

    if (tag != undefined && tag.name) {
      query.push(`tag_filter=${tag.name}`)
    }

    if (sortField != undefined && sortField) {
      query.push(`sort_field=${sortField}&sort_direction=${sortDirection}`)
    }

    fetch(getApiUrl(`/national_ideas?${query.join('&')}`), {
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
        <Autocomplete
          placeholder="Search tag..."
          apiEndpoint={getApiUrl('/tags')}
          onSelectionChange={this.handleTagSelect}
        />

        <div className="grid grid-cols-2">
          <MultiselectAutocomplete
            placeholder="Search modifiers..."
            onSelectionChange={this.handleModifierSelect}
            apiEndpoint={getApiUrl('/modifiers')}
          />
          <SortControl
            fields={this.state.fields}
            onSortChange={this.handleSortChange}
          />
        </div>
      </>
    )
  }
}