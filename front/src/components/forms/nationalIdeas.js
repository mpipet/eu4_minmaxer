'use client';
import React from 'react';
import MultiselectAutocomplete from '@/components/multiSelectAutocomplete'
import Autocomplete from '../autocomplete';
import { getApiUrl } from '@/helpers';
import SortControl from '../sortControl';



export default class NationalIdeas extends React.Component {

  componentDidMount() {
    this.performSearch(this.props.form.modifiers, this.props.form.tag, this.props.form.sortField, this.props.form.sortDirection);
  }

  handleModifierSelect = (modifiers) => {
    this.props.handleModifiersChange(modifiers)
    this.performSearch(modifiers, this.props.form.tag, this.props.form.sortField, this.props.form.sortDirection);
  };

  handleTagSelect = (tag) => {
    this.props.handleFormChange({ tag: tag })
    this.performSearch(this.props.form.modifiers, tag, this.props.form.sortField, this.props.form.sortDirection);
  };

  handleSortChange = (sortField, sortDirection) => {
    this.props.handleFormChange({ sortField: sortField, sortDirection: sortDirection })
    this.performSearch(this.props.form.modifiers, this.props.form.tag, sortField, sortDirection);
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
          initialValue={this.props.form.tag}
        />

        <div className="grid grid-cols-2">
          <MultiselectAutocomplete
            placeholder="Search modifiers..."
            onSelectionChange={this.handleModifierSelect}
            apiEndpoint={getApiUrl('/modifiers')}
            value={this.props.form.modifiers}
          />
          <SortControl
            fields={this.props.form.modifiers}
            onSortChange={this.handleSortChange}
          />
        </div>
      </>
    )
  }
}