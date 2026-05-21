'use client';
import React, { useContext } from 'react';
import { getImageUrl, formatModifierValue, translate, getWikiLink } from '@/helpers';
import ModifiersContext from '@/contexts/modifiersContext';
import ModifiersGroup from '@/components/results/modifiers';

const ModifiersGroupsPannel = ({ modifiersGroups }) => {
    const modifierGroupsOrder = ['0', '1', '2', '3', '4', '5', '6', 'bonus'];
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

const IdeaGroupsResultHeader = ({ ideaGroup }) => {
    const { selectIdeaGroups } = useContext(ModifiersContext)
    return (
        < div className="header image-container" >
            <img
                src={getImageUrl(ideaGroup.name)}
                alt={ideaGroup.name}
            />
            <h3>
                <a
                    className="wiki-link"
                    target="_blank"
                    href={getWikiLink(ideaGroup.name)}
                >
                    {translate(ideaGroup.name)}
                </a>
            </h3>
            <button
                className="add-modifiers-button"
                title="Select this idea group"
                onClick={() => { selectIdeaGroups(ideaGroup) }}
            >
                +
            </button>
        </div >
    )
}


export default class IdeaGroups extends React.Component {
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
        const { ideaGroup } = this.props;

        return (
            <div className="national-ideas-result">
                <IdeaGroupsResultHeader ideaGroup={ideaGroup} />
                {/* Modifier groups in order */}
                <ModifiersGroupsPannel modifiersGroups={ideaGroup} />
            </div>
        );
    }
}