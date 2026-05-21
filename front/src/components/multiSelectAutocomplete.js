'use client';
import React from "react";
import { getImageUrl } from '@/helpers';
import { SelectDropdown } from '@/components/select'
import { translate } from "@/helpers";

export default class MultiselectAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      suggestions: [],
      selectedItems: [], // Array of selected items
      showSuggestions: false
    };
    this.wrapperRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ showSuggestions: false });
    }
  };

  fetchSuggestions(text) {
    if (!text.trim()) {
      this.setState({ suggestions: [], showSuggestions: false });
      return;
    }

    fetch(this.props.apiEndpoint + "?query=" + text)
      .then((response) => response.json())
      .then((data) => {
        // Filter out already selected items
        const filtered = data.results.filter(
          item => !this.state.selectedItems.some(selected => selected.name === item.name)
        );

        this.setState({
          suggestions: filtered,
          showSuggestions: true
        });
      })
      .catch(error => {
        console.error('Search error:', error);
      });
  }

  handleSelect = (item) => {
    const newSelectedItems = [...this.state.selectedItems, item];

    this.setState({
      text: '',
      suggestions: [],
      selectedItems: newSelectedItems,
      showSuggestions: false
    });

    // Focus back on input
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(newSelectedItems);
    }
  };

  handleRemove = (itemToRemove) => {
    const newSelectedItems = this.state.selectedItems.filter(
      item => item.name !== itemToRemove.name
    );

    this.setState({ selectedItems: newSelectedItems });

    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(newSelectedItems);
    }
  };

  handleInputChange = (e) => {
    const text = e.target.value;
    this.setState({ text: text });
    this.fetchSuggestions(text);
  };

  handleFocus = () => {
    if (this.state.text.trim() && this.state.suggestions.length > 0) {
      this.setState({ showSuggestions: true });
    }
  };

  handleKeyDown = (e) => {
    // Backspace on empty input removes last tag
    if (e.key === 'Backspace' && !this.state.text && this.state.selectedItems.length > 0) {
      const newSelectedItems = this.state.selectedItems.slice(0, -1);
      this.setState({ selectedItems: newSelectedItems });

      if (this.props.onSelectionChange) {
        this.props.onSelectionChange(newSelectedItems);
      }
    }
  };

  render() {
    const { placeholder } = this.props;
    const { text, suggestions, selectedItems, showSuggestions } = this.state;
    const options = suggestions.map((suggestion) => {
      suggestion["imageUrl"] = suggestion.name
      suggestion["value"] = suggestion.name
      suggestion["label"] = translate(suggestion.name)
      return suggestion
    })

    return (
      <div className="select-container" ref={this.wrapperRef}>
        {/* Multiselect display area */}
        <div className="select-display" onClick={() => this.inputRef.current?.focus()}>
          {/* Selected tags */}
          {selectedItems.map((item) => (
            <div key={item.name} className="multiselect-tag">
              {/* Image */}
              <div className="select-icon-container">
                <img
                  src={getImageUrl(item.name)}
                  alt={item.name}
                />
              </div >
              <span className="select-text">{translate(item.name)}</span>

              {/* Remove button */}
              <button
                className="multiselect-tag-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  this.handleRemove(item);
                }}
                type="button"
              >
                ×
              </button>
            </div>
          ))}

          {/* Input field */}
          <input
            ref={this.inputRef}
            type="text"
            value={text}
            className="select-input"
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            onFocus={this.handleFocus}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />

        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
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