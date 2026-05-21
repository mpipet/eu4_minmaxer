'use client';
import React from 'react';
import NationalIdeas from '@/components/forms/nationalIdeas'
import IdeaGroups from '@/components/forms/ideaGroups'
import Religions from '@/components/forms/religions'
import Policies from '@/components/forms/policies'
import GreatProjects from '@/components/forms/greatProjects'


// Définition des tabs disponibles
const SEARCH_FORMS = [
  {
    id: 'national_ideas',
    label: 'National Ideas',
    icon: '🏛',
    component: NationalIdeas,
  },
  {
    id: 'idea_groups',
    label: 'Idea Groups',
    icon: '💡',
    component: IdeaGroups,
  },
  {
    id: 'policies',
    label: 'Policies',
    icon: '📜',
    component: Policies,
  },
  {
    id: 'great_projects',
    label: 'Great Projects',
    icon: '🕌',
    component: GreatProjects,
  },
  {
    id: 'religions',
    label: 'Religions',
    icon: '✝',
    component: Religions,
  },
];

export default class SearchFormSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFormId: 'national_ideas'
    };
  }

  handleTabChange = (formId) => {
    this.setState({ activeFormId: formId });

    if (this.props.onFormChange) {
      this.props.onFormChange(formId);
    }
  };

  getActiveForm = () => {
    return SEARCH_FORMS.find(form => form.id === this.state.activeFormId);
  };

  render() {
    const { activeFormId } = this.state;
    const activeForm = this.getActiveForm();
    const ActiveFormComponent = activeForm?.component;

    return (
      <div className="search-form-selector">
        {/* Tabs de sélection */}
        <div className="selector-tabs">
          {SEARCH_FORMS.map((form) => (
            <button
              key={form.id}
              className={`selector-tab ${activeFormId === form.id ? 'active' : ''} ${!form.component ? 'disabled' : ''}`}
              onClick={() => form.component && this.handleTabChange(form.id)}
              disabled={!form.component}
              title={!form.component ? 'Coming soon' : form.label}
            >
              <span className="tab-icon">{form.icon}</span>
              {form.label}
            </button>
          ))}
        </div>

        {/* Formulaire actif */}
        <div className="selector-content">
          <div className="form-context-label">
            {activeForm?.icon} {activeForm?.label} Search
          </div>

          {ActiveFormComponent ? (
            <ActiveFormComponent setLoading={this.props.setLoading} setSearchResults={this.props.setSearchResults} />
          ) : (
            <div className="form-coming-soon">
              Coming soon...
            </div>
          )}
        </div>
      </div>
    );
  }
}