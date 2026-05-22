'use client';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { getImageUrl } from '@/helpers';

const SimpleSelect = ({
    options = [],
    placeholder = "",
    onChange,
    value,
    defaultValue,
}) => {
    const itemsCache = useRef(new Map());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Normaliser un item (retirer champs qui changent)
    const getCachedItem = (item) => {
        if (!item) return null;

        const key = item.value;

        if (itemsCache.current.has(key)) {
            return itemsCache.current.get(key);
        }

        // Retirer les champs qui peuvent changer
        const { score, ...normalized } = item;
        itemsCache.current.set(key, normalized);
        return normalized;
    };

    // Normaliser toutes les options
    const normalizedOptions = options.map(getCachedItem);

    // Trouver la valeur initiale
    const getInitialValue = () => {
        const initialValue = value || defaultValue;
        if (!initialValue) return null;

        const found = normalizedOptions.find(opt => opt.value === initialValue);
        return found || null;
    };

    const [selected, setSelected] = useState(() => getInitialValue());

    // Mode contrôlé : mettre à jour quand value change
    useEffect(() => {
        if (value !== undefined) {
            const found = normalizedOptions.find(opt => opt.value === value);
            setSelected(found || null);
        }
    }, [value]);

    const handleChange = (option) => {
        const cached = getCachedItem(option);

        // Mode non contrôlé : mettre à jour l'état interne
        if (value === undefined) {
            setSelected(cached);
        }

        if (onChange) {
            onChange(cached);
        }
    };

    // Ne pas render avant hydration
    if (!isMounted) {
        return null;
    }

    const currentValue = value !== undefined
        ? normalizedOptions.find(opt => opt.value === value) || null
        : selected;

    return (
        <Select
            instanceId="simple-select-stable"
            value={currentValue}
            options={normalizedOptions}
            onChange={handleChange}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            isClearable={false}
            placeholder={placeholder}
            formatOptionLabel={(opt) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {opt.imageUrl && (
                        <img
                            src={getImageUrl(opt.imageUrl)}
                            alt={opt.label}
                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                        />
                    )}
                    <span>{opt.label}</span>
                </div>
            )}
            className="select-container"
            classNamePrefix="select"
        />
    );
};

export default SimpleSelect;