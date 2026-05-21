'use client';
import React from "react";
import { getImageUrl } from '@/helpers';
import { SelectDropdown } from '@/components/select'

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      suggestions: [],
      selectedImage: null,
      showSuggestions: false
    };
  }

  fetchSuggestions(text) {
    fetch(this.props.apiEndpoint + "?query=" + text)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          suggestions: data.results,
          showSuggestions: true
        });
      })
      .catch(error => {
        console.error('Search error:', error);
      });
  }

  handleSelect = (item) => {
    this.setState({
      text: item.searchable_name,
      suggestions: [],
      selectedImage: item.name,
      showSuggestions: false
    });


    console.log("coucou?")

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(item);
    }
  };

  handleBlur = () => {
    this.setState({ showSuggestions: false });
  };

  handleFocus = () => {
    if (this.state.text.trim() && this.state.suggestions.length > 0) {
      this.setState({ showSuggestions: true });
    }
  };

  setText(text) {
    this.setState({ text: text });
  }

  render() {
    const { suggestions, text, selectedImage, showSuggestions } = this.state
    const { placeholder } = this.props
    const options = suggestions.map((suggestion) => {
      suggestion["imageUrl"] = suggestion.name
      suggestion["value"] = suggestion.name
      suggestion["label"] = suggestion.searchable_name
      return suggestion
    })

    return (
      <div className="select-container">
        <div className="select-display">
          {this.state.selectedImage && (
            <div className="select-icon-container">
              <img
                src={getImageUrl(this.state.selectedImage)}
                alt="Selected"
              />
            </div>
          )}

          {/* Input sans bordure */}
          <input
            type="text"
            value={text}
            className="autocomplete-input"
            placeholder={placeholder}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={(e) => {
              this.fetchSuggestions(e.target.value);

              if (selectedImage != null) {
                this.handleSelect({})
              }
              this.setState({
                text: e.target.value,
                selectedImage: null
              });
            }}
          />
        </div>

        {/* Liste de suggestions */}
        {showSuggestions && options.length > 0 && (
          <SelectDropdown
            placeholder={placeholder}
            handleSelect={this.handleSelect}
            options={options}
          />
        )}
      </div>
    );
  }
}