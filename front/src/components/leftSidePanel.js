'use client';
import React, { useContext } from 'react';
import ModifiersContext, { ModifiersProvider } from '@/contexts/modifiersContext';
import { translate, getImageUrl } from '@/helpers';


const Selection = ({ item, unselect }) => {

  return (
    <div>
      <div key={item.name} className="selected-modifiers-list">
        <div className="selected-modifier-item" onClick={() => unselect()}>
          <div className="selected-modifier-content">
            <div className="selected-modifier-name">
              {translate(item.name)}
            </div>
          </div>
          {/* 
          <button
            className="selected-modifier-remove"
            // onClick={() => unselect()}
            aria-label={`Remove ${translate(item.name)}`}
            title="Remove"
          >
            ×
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default class LeftSidePanel extends React.Component {
  static contextType = ModifiersContext;
  render() {
    const {
      ideaGroups,
      unselectIdeaGroups,
      nationalIdeas,
      greatProjects,
      unselectNationalIdeas,
      admPolicies,
      dipPolicies,
      milPolicies,
      unselectAdmPolicies,
      unselectDipPolicies,
      unselectMilPolicies,
      unselectGreatProject,
      clearAll
    } = this.context;
    const nothingSelecting = nationalIdeas === null
      && ideaGroups.length == 0
      && greatProjects.length == 0
      && admPolicies.length == 0
      && dipPolicies.length == 0
      && milPolicies.length == 0

    return (
      <div className="modifiers-panel">
        {/* Header */}
        <div className="modifiers-panel-header">
          <div className="form-context-label">
            Selection
          </div>
        </div>

        {/* Liste des modifiers */}
        <div className="selected-modifiers-list">
          {nationalIdeas != null &&
            <div className="block-container">
              < div className="header" >
                <h3>National idea</h3>
              </div>
              <Selection item={nationalIdeas} unselect={unselectNationalIdeas} />
            </div>
          }
        </div>

        {
          ideaGroups.length > 0 &&
          <div className="block-container">
            < div className="header" >
              <h3>Idea groups</h3>
            </div>
            {
              ideaGroups.map((ideaGroup, index) => {
                return (
                  <Selection key={ideaGroup.name} item={ideaGroup} unselect={() => unselectIdeaGroups(index)} />
                );
              })
            }
          </div>
        }

        {
          admPolicies.length > 0 &&
          <div className="block-container">
            < div className="header" >
              <h3>Administrative Policies</h3>
            </div>
            {
              admPolicies.map((policy, index) => {
                return (
                  <Selection key={policy.name} item={policy} unselect={() => unselectAdmPolicies(index)} />
                );
              })
            }
          </div>
        }

        {
          dipPolicies.length > 0 &&
          <div className="block-container">
            < div className="header" >
              <h3>Diplomatic Policies</h3>
            </div>
            {
              dipPolicies.map((policy, index) => {
                return (
                  <Selection key={policy.name} item={policy} unselect={() => unselectDipPolicies(index)} />
                );
              })
            }
          </div>
        }

        {
          milPolicies.length > 0 &&
          <div className="block-container">
            < div className="header" >
              <h3>Military Policies</h3>
            </div>
            {
              milPolicies.map((policy, index) => {
                return (
                  <Selection key={policy.name} item={policy} unselect={() => unselectMilPolicies(index)} />
                );
              })
            }
          </div>
        }

        {
          greatProjects.length > 0 &&
          <div className="block-container">
            < div className="header" >
              <h3>Great Projects</h3>
            </div>
            {
              greatProjects.map((greatProject, index) => {
                return (
                  <Selection key={greatProject.name} item={greatProject} unselect={() => unselectGreatProject(index)} />
                );
              })
            }
          </div>
        }

        {/* Bouton Clear All */}
        {!nothingSelecting && clearAll && (
          <button
            className="clear-all-button"
            onClick={clearAll}
          >
            Clear all
          </button>
        )}

      </div>
    );
  }
}
