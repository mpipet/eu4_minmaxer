'use client';
import React from "react";
import { getImageUrl } from '@/helpers';

export function SelectDropdown({ placeholder = "", handleSelect = () => { }, options = [], selectedOptions = [] }) {
    return (
        <ul className="select-dropdown">
            {/* None option if placeholder exists */}
            {placeholder && (
                <li
                    className="select-option"
                    onMouseDown={() => handleSelect(null)}
                >
                    <span className="select-option-placeholder">{placeholder}</span>
                </li>
            )}
            {/* Options */}
            {options
                .filter(option => !selectedOptions.some(sel => sel.value === option.value))
                .map((option) => (
                    <li
                        key={option.value}
                        className={"select-option"}
                        onMouseDown={() => handleSelect(option)}
                    >
                        {/* Image if present */}
                        {option.imageUrl && (
                            <img
                                src={getImageUrl(option.imageUrl)}
                                alt={option.label}
                                className="select-option-image"
                            />
                        )}
                        <span>{option.label}</span>
                    </li>
                ))}
        </ul>
    );
}


export default class Select extends React.Component {
    constructor(props) {
        super(props);

        // Find initial selected option
        const initialValue = props.value || props.defaultValue;
        const initialOption = initialValue
            ? props.options.find(opt => opt.value === initialValue)
            : null;

        this.state = {
            selectedOption: initialOption,
            isOpen: false
        };

        this.wrapperRef = React.createRef();
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
            const newOption = this.props.options.find(opt => opt.value === this.props.value);
            this.setState({ selectedOption: newOption || null });
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
        this.setState({
            selectedOption: option,
            isOpen: false
        });

        if (this.props.onChange) {
            this.props.onChange(option);
        }
    };

    render() {
        const { options, placeholder } = this.props;
        const { selectedOption, isOpen } = this.state;

        return (
            <div className="select-container" ref={this.wrapperRef}>
                {/* Selected value display */}
                <div
                    className="select-display"
                    onClick={this.toggleDropdown}
                >
                    {/* Image if present */}
                    {selectedOption?.imageUrl && (
                        <div className="select-icon-container">
                            <img
                                src={getImageUrl(selectedOption.imageUrl)}
                                alt={selectedOption.label}
                            />
                        </div>
                    )}

                    {/* Selected text or placeholder */}
                    <span className={`select-text ${!selectedOption ? 'select-placeholder' : ''}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    {/* Dropdown arrow */}
                    <span className={`select-arrow ${isOpen ? 'select-arrow-open' : ''}`}>
                        ▼
                    </span>
                </div>

                {/* Dropdown list */}
                {isOpen &&
                    <SelectDropdown
                        placeholder={placeholder}
                        handleSelect={this.handleSelect}
                        options={options}
                        selectedOptions={selectedOption !== null ? [selectedOption] : []}
                    />
                }
            </div>
        );
    }
}