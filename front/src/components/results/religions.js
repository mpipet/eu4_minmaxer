'use client';
import React, { useContext } from 'react';
import { getImageUrl, formatModifierValue, translate, getWikiLink } from '@/helpers';
import ModifiersContext from '@/contexts/modifiersContext';
import ModifiersGroup from '@/components/results/modifiers';
import { Modifier } from '@/components/results/modifiers';

const ModifiersGroupsPannel = ({ modifiersGroups }) => {
    const isModifierMatched = (modifierKey) => {
        if (!modifiersGroups.matched_modifiers) return false;
        return modifiersGroups.matched_modifiers.includes(modifierKey);
    }
    return (
        <div className="modifier-groups-container">
            <div className="modifier-list">
                {
                    Object.entries(modifiersGroups["base_modifiers"]).map((modifier) => {
                        return (

                            <Modifier
                                key={modifier[0]}
                                isMatched={isModifierMatched(modifier[0])}
                                modifierKey={modifier[0]}
                                modifierValue={modifier[1]}
                                imageUrl={getImageUrl(modifier[0])}
                            />
                        )

                    })
                }

            </div>

        </div>
    )
}

const ReligionsResultHeader = ({ religion }) => {
    // const { selectIdeaGroups } = useContext(ModifiersContext)
    return (
        < div className="header image-container" >
            <img
                src={getImageUrl(religion.name)}
                alt={religion.name}
            />
            <h3>
                <a
                    className="wiki-link"
                    target="_blank"
                    href={getWikiLink(translate(religion.name))}
                >
                    {translate(religion.name)}
                </a>
            </h3>
            {/* <button
                className="add-modifiers-button"
                title="Select this idea group"
                onClick={() => { selectIdeaGroups(ideaGroup) }}
            >
                +
            </button> */}
        </div >
    )
}


export default class Religions extends React.Component {
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
        const { religion } = this.props;
        console.log(religion)
        return (
            <div className="national-ideas-result">
                <ReligionsResultHeader religion={religion} />
                {/* Modifier groups in order */}
                <ModifiersGroupsPannel modifiersGroups={religion} />
            </div>
        );
    }
}