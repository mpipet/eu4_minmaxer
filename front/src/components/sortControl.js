'use client';
import React from 'react';
import { getImageUrl } from '@/helpers';

export default class SortControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: null,
      sortDirection: 'desc',
      showDropdown: false
    };
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  };

  toggleDropdown = () => {
    this.setState(prev => ({ showDropdown: !prev.showDropdown }));
  };

  handleFieldSelect = (modifier) => {
    if (!modifier) {
      // None selected
      this.setState({
        sortField: null,
        showDropdown: false
      });
      if (this.props.onSortChange) {
        this.props.onSortChange(null, null);
      }
    } else {
      // Modifier selected
      this.setState({
        sortField: modifier.name,
        showDropdown: false
      });
      if (this.props.onSortChange) {
        this.props.onSortChange(modifier.name, this.state.sortDirection);
      }
    }
  };

  handleDirectionChange = (direction) => {
    if (this.state.sortField) {
      this.setState({ sortDirection: direction });
      if (this.props.onSortChange) {
        this.props.onSortChange(this.state.sortField, direction);
      }
    }
  };

  render() {
    const { fields } = this.props;
    const { sortField, sortDirection, showDropdown } = this.state;

    // Si aucun modifier sélectionné, ne rien afficher
    if (!fields || fields.length === 0) {
      return null;
    }

    // Trouver le modifier actuellement sélectionné pour le tri
    const currentModifier = fields.find(m => m.name === sortField);

    return (
      <div className="sort-inline-image" ref={this.wrapperRef}>
        {/* Badge de sélection avec dropdown */}
        <div
          className="sort-current-modifier"
          onClick={this.toggleDropdown}
        >
          {currentModifier ? (
            <>
              <div className="select-icon-container">
                <img
                  src={getImageUrl(currentModifier.name)}
                  alt={currentModifier.name}
                />
              </div>
              <span className="select-text">
                {currentModifier.searchable_name || currentModifier.name}
              </span>
            </>
          ) : (
            <span className="sort-placeholder">Sort by...</span>
          )}
        </div>

        {/* Dropdown menu */}
        {showDropdown && (
          <div className="sort-dropdown active">
            {/* Option None */}
            <div
              className={`sort-dropdown-item ${!sortField ? 'selected' : ''}`}
              onClick={() => this.handleFieldSelect(null)}
            >
              <span className="sort-dropdown-text sort-dropdown-none">None</span>
            </div>

            {/* Options des modifiers */}
            {fields.map(modifier => (
              <div
                key={modifier.name}
                className={`sort-dropdown-item ${sortField === modifier.name ? 'selected' : ''}`}
                onClick={() => this.handleFieldSelect(modifier)}
              >
                <img
                  src={getImageUrl(modifier.name)}
                  alt={modifier.name}
                  className="sort-dropdown-img selected-tag-imag"
                />
                <span className="sort-dropdown-text">
                  {modifier.searchable_name || modifier.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Boutons de direction */}
        <div className="sort-direction-compact">
          <button
            className={`sort-dir-btn ${sortDirection === 'asc' ? 'active' : ''}`}
            onClick={() => this.handleDirectionChange('asc')}
            disabled={!sortField}
            title="Ascending"
          >
            ↑
          </button>
          <button
            className={`sort-dir-btn ${sortDirection === 'desc' ? 'active' : ''}`}
            onClick={() => this.handleDirectionChange('desc')}
            disabled={!sortField}
            title="Descending"
          >
            ↓
          </button>
        </div>
      </div>
    );
  }
}