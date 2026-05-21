'use client';
import React, { useContext } from 'react';
import { getImageUrl, formatModifierValue, translate, getWikiLink } from '@/helpers';
import ModifiersContext from '@/contexts/modifiersContext';
import ModifiersGroup from '@/components/results/modifiers';

const ModifiersGroupsPannel = ({ modifiersGroups }) => {
  const modifierGroupsOrder = ['start', '0', '1', '2', '3', '4', '5', '6', 'bonus'];
  return (
    <div className="modifier-groups-container">
      {modifierGroupsOrder.map(groupKey => {
        const modifiersGroup = modifiersGroups[groupKey];
        return (
          <ModifiersGroup
            key={groupKey}
            groupKey={groupKey}
            modifiersGroup={modifiersGroup}
            matchedModifiers={modifiersGroups.matched_modifiers}
          />);
      })}
    </div>
  )
}


const NationalIdeasResultHeader = ({ ideaSet }) => {
  const { selectNationalIdeas } = useContext(ModifiersContext)
  return (
    < div className="header image-container" >
      {/* One Flag case */}
      {ideaSet && ideaSet.tags && ideaSet.tags.length === 1 &&

        (
          <img
            src={getImageUrl(ideaSet.tags[0])}
            alt={ideaSet.name}
          />
        )}
      <h3>
        {/* One Flag case */}
        {ideaSet && ideaSet.tags && ideaSet.tags.length === 1 && (
          <a
            className="wiki-link"
            target="_blank"
            href={getWikiLink(translate(ideaSet.tags[0]))}
          >
            {translate(ideaSet.name)}
          </a>
        )}
        {/* No Flags or Many Flags case */}
        {ideaSet && ideaSet.tags && ideaSet.tags.length !== 1 && (
          translate(ideaSet.name)
        )}
      </h3>
      <button
        className="add-modifiers-button"
        title="Select this national ideas"
        onClick={() => { selectNationalIdeas(ideaSet) }}
      >
        +
      </button>
    </div >
  )
}

const NationalIdeasResultSubHeader = ({ ideaSet }) => {
  return (
    ideaSet && ideaSet.tags && ideaSet.tags.length > 1 &&
    <div className="header tags image-container">
      <span>For</span>
      {ideaSet.tags.map(tag => {
        return (
          <div key={tag}>
            <img
              src={getImageUrl(tag)}
              alt={tag}
              className="tag-flags-image"
            />
            <span>
              <a className="wiki-link" target="_blank" href={getWikiLink(translate(tag))}>{translate(tag)}</a>
            </span>
          </div>
        );
      })}
    </div>

  )
}

export default class NationalIdeas extends React.Component {
  // Get the first modifier name from a group (for image display)
  getFirstModifierName(group) {
    if (!group || typeof group !== 'object') return null;
    const keys = Object.keys(group);
    return keys.length > 0 ? keys[0] : null;
  }

  // Check if a modifier is matched
  isModifierMatched(modifierName) {
    const { data } = this.props;
    if (!data.matched_modifiers) return false;
    return data.matched_modifiers.includes(modifierName);
  }

  render() {
    const { ideaSet } = this.props;

    return (
      <div className="national-ideas-result">

        {/* Headers with name, eventual links and flags */}
        <NationalIdeasResultHeader ideaSet={ideaSet} />

        <NationalIdeasResultSubHeader ideaSet={ideaSet} />

        {/* Modifier groups in order */}
        <ModifiersGroupsPannel modifiersGroups={ideaSet} />
      </div>
    );
  }
}