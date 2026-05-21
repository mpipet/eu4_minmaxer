'use client';
import React from "react";
import { getImageUrl } from '@/helpers';
import { SelectDropdown } from '@/components/select'

/**
 * Multiselect component with static options
 * 
 * @param {Array} options - Array of option objects with structure:
 *   { value: string, label: string, imageUrl?: string }
 * @param {string} placeholder - Placeholder text
 * @param {function} onChange - Callback when selections change: (selectedOptions[]) => {}
 * @param {Array} value - Currently selected values (controlled component)
 * @param {Array} defaultValue - Default selected values (uncontrolled)
 */
export default class MultiselectSelect extends React.Component {
    constructor(props) {
        super(props);

        // Find initial selected options
        const initialValues = props.value || props.defaultValue || [];
        const initialOptions = props.options.filter(opt =>
            initialValues.includes(opt.value)
        );

        this.state = {
            selectedOptions: initialOptions,
            isOpen: false
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

    componentDidUpdate(prevProps) {
        // Handle controlled component updates
        if (this.props.value !== prevProps.value) {
            const newOptions = this.props.options.filter(opt =>
                (this.props.value || []).includes(opt.value)
            );
            this.setState({ selectedOptions: newOptions });
        }
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    };

    toggleDropdown = () => {
        this.setState(prev => ({ isOpen: !prev.isOpen }));
    };

    handleSelect = (option) => {
        // Add to selection
        const newSelectedOptions = [...this.state.selectedOptions, option];

        this.setState({
            selectedOptions: newSelectedOptions,
            isOpen: false // Close dropdown after selection
        });

        if (this.props.onChange) {
            this.props.onChange(newSelectedOptions);
        }
    };

    handleRemove = (optionToRemove, e) => {
        e.stopPropagation();

        const newSelectedOptions = this.state.selectedOptions.filter(
            opt => opt.value !== optionToRemove.value
        );

        this.setState({ selectedOptions: newSelectedOptions });

        if (this.props.onChange) {
            this.props.onChange(newSelectedOptions);
        }
    };

    render() {
        const { options, placeholder } = this.props;
        const { selectedOptions, isOpen } = this.state;

        return (
            <div className="select-container" ref={this.wrapperRef}>
                {/* Multiselect display */}
                <div
                    className="select-display"
                    onClick={this.toggleDropdown}
                >
                    {/* Selected tags */}
                    {selectedOptions.map((option) => (
                        <div key={option.value} className="multiselect-tag">
                            {/* Image if present */}
                            {option.imageUrl && (
                                <img
                                    src={getImageUrl(option.imageUrl)}
                                    alt={option.label}
                                    className="multiselect-tag-image"
                                />
                            )}
                            <span className="select-text">{option.label}</span>

                            {/* Remove button */}
                            <button
                                className="multiselect-tag-remove"
                                onClick={(e) => this.handleRemove(option, e)}
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    {/* Placeholder or hidden input for accessibility */}
                    {selectedOptions.length === 0 && (
                        <span className="select-placeholder">{placeholder}</span>
                    )}

                    {/* Dropdown arrow */}
                    <span className={`select-arrow ${isOpen ? 'select-arrow-open' : ''}`}>
                        ▼
                    </span>
                </div>

                {/* Dropdown list */}
                {isOpen && (
                    <SelectDropdown
                        placeholder={placeholder}
                        handleSelect={this.handleSelect}
                        options={options}
                        selectedOptions={selectedOptions}
                    />
                )}
            </div>
        );
    }
}