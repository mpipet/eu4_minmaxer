'use client';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { getImageUrl } from '@/helpers';

const Autocomplete = ({
  apiEndpoint,
  placeholder,
  onSelectionChange,
  initialValue = null,
}) => {
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const itemsCache = useRef(new Map());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getCachedItem = (item) => {
    if (!item || !item.name) return null;

    const key = item.name;

    if (itemsCache.current.has(key)) {
      return itemsCache.current.get(key);
    }

    const { score, ...normalized } = item;
    itemsCache.current.set(key, normalized);
    return normalized;
  };

  useEffect(() => {
    if (isMounted && initialValue) {
      const cached = getCachedItem(initialValue);
      setSelected(cached);
      setOptions(cached ? [cached] : []);
    }
  }, [isMounted, initialValue]);

  useEffect(() => {
    if (!isMounted) return;

    if (!inputValue.trim()) {
      if (selected && selected.name) {
        setOptions([selected]);
      } else {
        setOptions([]);
      }
      return;
    }

    setIsLoading(true);

    fetch(apiEndpoint + "?query=" + inputValue)
      .then((response) => response.json())
      .then((data) => {
        const results = (data.results || []).map(getCachedItem).filter(Boolean);

        if (selected && selected.name) {
          const selectedInResults = results.find(r => r.name === selected.name);

          if (selectedInResults) {
            setSelected(selectedInResults);
            setOptions(results);
          } else {
            setOptions([selected, ...results]);
          }
        } else {
          setOptions(results);
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setIsLoading(false);
      });
  }, [inputValue, apiEndpoint, isMounted, selected]);

  const handleChange = (newValue) => {
    s
    if (!newValue) {
      setSelected(null);
      setInputValue('');
      setOptions([]);
      itemsCache.current.clear();

      if (onSelectionChange) {
        onSelectionChange(null);
      }
      return;
    }

    const cached = getCachedItem(newValue);
    setSelected(cached);
    setInputValue('');

    if (cached) {
      setOptions([cached]);
    } else {
      setOptions([]);
    }

    if (onSelectionChange) {
      onSelectionChange(cached || {});
    }
  };

  const handleInputChange = (value, meta) => {
    if (meta.action === 'input-change') {
      setInputValue(value);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Select
      instanceId="autocomplete-select-stable"
      value={selected}
      options={options}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      getOptionValue={(opt) => opt?.name || ''}
      getOptionLabel={(opt) => opt?.searchable_name || ''}
      isClearable
      components={{
        DropdownIndicator: null,
      }}
      isLoading={isLoading}
      placeholder={placeholder}
      noOptionsMessage={() => inputValue ? 'No results' : 'Type to search'}
      formatOptionLabel={(opt) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {opt?.name && (
            <img
              src={getImageUrl(opt.name)}
              alt={opt.searchable_name}
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
          )}
          <span>{opt?.searchable_name}</span>
        </div>
      )}
      className="autocomplete-container"
      classNamePrefix="autocomplete"
    />
  );
};

export default Autocomplete;