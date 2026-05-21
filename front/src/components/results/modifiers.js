'use client';
import React from 'react';
import { getImageUrl, formatModifierValue, translate } from '@/helpers';


const ModifiersGroup = ({ groupKey, modifiersGroup, matchedModifiers }) => {
  // Get the first modifier name from a group (for image display)
  const getFirstModifierKey = (group) => {
    if (!group || typeof group !== 'object') return null;
    const keys = Object.keys(group);
    return keys.length > 0 ? keys[0] : null;
  }

  // Check if a modifier is matched
  const isModifierMatched = (modifierKey) => {
    if (!matchedModifiers) return false;
    return matchedModifiers.includes(modifierKey);
  }


  if (!modifiersGroup || Object.keys(modifiersGroup).length === 0) {
    return null;
  }

  const firstModifierKey = getFirstModifierKey(modifiersGroup);
  const imageUrl = firstModifierKey ? getImageUrl(firstModifierKey) : null;
  const notAllowed = ["modifiers_list"];

  const modifiers = Object.entries(modifiersGroup).filter(key => !notAllowed.includes(key[0]));

  return (
    <div key={groupKey} className="modifier-group">

      {/* List of modifiers in the group */}
      <div className="modifier-list">
        {modifiers.map(([modifierKey, modifierValue], index) => {

          const isMatched = isModifierMatched(modifierKey);

          return (
            <Modifier
              key={modifierKey}
              isMatched={isMatched}
              modifierKey={modifierKey}
              modifierValue={modifierValue}
              imageUrl={firstModifierKey == modifierKey && imageUrl}
            />
          );
        })}
      </div>
    </div>
  )
}
export default ModifiersGroup;


export const Modifier = ({ modifierKey, modifierValue, isMatched, imageUrl }) => {
  if (modifierKey === "effect") return null;

  return (
    <div
      key={modifierKey}
      className={`modifier-item ${isMatched ? 'matched' : ''}`}
    >
      {/* Image only for first element */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={modifierKey}
          className="modifier-group-icon"
        />
      ) : (
        <div style={{ width: '28px' }}></div> // Empty spacer for alignment
      )}
      <span className="modifier-name">{translate(modifierKey)}</span>
      {
        (typeof modifierValue === 'float' || typeof modifierValue === 'number') && (
          <span className="modifier-value">
            {formatModifierValue(modifierKey, modifierValue)}
          </span>
        )
      }
    </div>
  )
}
