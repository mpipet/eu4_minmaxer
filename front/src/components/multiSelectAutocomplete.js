'use client';
import { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { getImageUrl, translate } from '@/helpers';

const MultiValueLabel = (props) => {
  const { data } = props;

  return (
    <components.MultiValueLabel {...props}>
      <div className="multiselect-value-content">
        <div className="select-icon-container">
          <img
            src={getImageUrl(data.name)}
            alt={data.name}
          />
        </div>
        <span className="select-text">{translate(data.name)}</span>
      </div>
    </components.MultiValueLabel>
  );
};

// Composant personnalisé pour les options du dropdown
const Option = (props) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <div className="multiselect-option-content">
        <div className="select-icon-container">
          <img
            src={getImageUrl(data.name)}
            alt={data.name}
          />
        </div>
        <span>{translate(data.name)}</span>
      </div>
    </components.Option>
  );
};

const MultiselectAutocomplete = ({
  apiEndpoint,
  placeholder,
  onSelectionChange,
  initialSelectedItems = [],
  value = null,
}) => {
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser avec les valeurs fournies
  useEffect(() => {
    if (initialSelectedItems.length > 0 && selectedItems.length === 0) {
      setSelectedItems(initialSelectedItems);
    }
  }, [initialSelectedItems]);

  // Support du mode contrôlé
  useEffect(() => {
    if (value !== null) {
      setSelectedItems(value);
    }
  }, [value]);

  // Fetch suggestions quand l'input change
  useEffect(() => {
    if (!inputValue.trim()) {
      setOptions([]);
      return;
    }

    setIsLoading(true);

    fetch(apiEndpoint + "?query=" + inputValue)
      .then((response) => response.json())
      .then((data) => {
        // Filtrer les items déjà sélectionnés
        const filtered = data.results.filter(
          item => !selectedItems.some(selected => selected.name === item.name)
        );

        // Formater pour react-select
        const formattedOptions = filtered.map((item) => ({
          ...item,
          value: item.name,
          label: translate(item.name),
        }));

        setOptions(formattedOptions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setIsLoading(false);
      });
  }, [inputValue, selectedItems, apiEndpoint]);

  // Handler de sélection - Renvoie TOUT le tableau
  const handleChange = (selected) => {
    const newSelectedItems = selected || [];

    // Seulement mettre à jour l'état interne si non contrôlé
    if (value === null) {
      setSelectedItems(newSelectedItems);
    }

    setInputValue('');
    setOptions([]);

    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  };

  // Handler de saisie
  const handleInputChange = (value, { action }) => {
    if (action === 'input-change') {
      setInputValue(value);
    }
  };

  // Utiliser value si fourni, sinon selectedItems
  const currentValue = value !== null ? value : selectedItems;

  return (
    <Select
      isMulti
      value={currentValue}
      options={options}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      components={{
        MultiValueLabel,
        Option,
        DropdownIndicator: null,
        IndicatorSeparator: null,
      }}
      placeholder={placeholder}
      isLoading={isLoading}
      noOptionsMessage={() =>
        inputValue.trim()
          ? 'No results found'
          : 'Type to search...'
      }
      className="multiselect-container"
      classNamePrefix="multiselect"
      blurInputOnSelect={false}
      closeMenuOnSelect={false}
      backspaceRemovesValue={true}
    />
  );
};

export default MultiselectAutocomplete;