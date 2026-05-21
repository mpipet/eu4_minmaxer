'use client';
import IdeaGroups from "@/components/results/ideaGroups";
import React from "react";

const ModifiersContext = React.createContext();

export class ModifiersProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nationalIdeas: null,
      ideaGroups: [],
      greatProjects: [],
      admPolicies: [],
      dipPolicies: [],
      milPolicies: [],
    };
  }

  selectIdeaGroups = (ideaGroup) => {
    const { ideaGroups } = this.state

    const alreadyPresent = this.state.ideaGroups.filter((iG) => iG.name == ideaGroup.name)
    if (alreadyPresent.length > 0) {
      return
    }

    if (this.state.ideaGroups.length > 9) {
      return
    }


    ideaGroups.push(ideaGroup)
    this.setState({ ideaGroups: ideaGroups });
  }


  selectGreatProject = (greatProject, tier) => {
    const { greatProjects } = this.state

    const alreadyPresentIndex = greatProjects.findIndex((gP) => gP.name == greatProject.name)
    if (alreadyPresentIndex != -1) {
      greatProjects.splice(alreadyPresentIndex, 1);
    }

    greatProject["flat_modifiers"] = tier
    greatProjects.push(greatProject)
    this.setState({ greatProjects: greatProjects });
  }

  unselectGreatProject = (index) => {
    const { greatProjects } = this.state
    greatProjects.splice(index, 1);
    this.setState({ greatProjects: greatProjects })
  }

  selectAdmPolicy = (policy) => {
    const { admPolicies } = this.state

    const alreadyPresent = this.state.admPolicies.filter((p) => p.name == policy.name)
    if (alreadyPresent.length > 0) {
      return
    }

    if (this.state.admPolicies.length > 9) {
      return
    }


    admPolicies.push(policy)
    this.setState({ admPolicies: admPolicies });
  }

  selectDipPolicy = (policy) => {
    const { dipPolicies } = this.state

    const alreadyPresent = this.state.dipPolicies.filter((p) => p.name == policy.name)
    if (alreadyPresent.length > 0) {
      return
    }

    if (this.state.dipPolicies.length > 9) {
      return
    }


    dipPolicies.push(policy)
    this.setState({ dipPolicies: dipPolicies });
  }

  selectMilPolicy = (policy) => {
    const { milPolicies } = this.state

    const alreadyPresent = this.state.milPolicies.filter((p) => p.name == policy.name)
    if (alreadyPresent.length > 0) {
      return
    }

    if (this.state.milPolicies.length > 9) {
      return
    }


    milPolicies.push(policy)
    this.setState({ milPolicies: milPolicies });
  }

  unselectIdeaGroups = (index) => {
    const { ideaGroups } = this.state
    ideaGroups.splice(index, 1);
    this.setState({ ideaGroups: ideaGroups })
  }

  unselectAdmPolicies = (index) => {
    const { admPolicies } = this.state
    admPolicies.splice(index, 1);
    this.setState({ admPolicies: admPolicies })
  }

  unselectDipPolicies = (index) => {
    const { dipPolicies } = this.state
    dipPolicies.splice(index, 1);
    this.setState({ dipPolicies: dipPolicies })
  }

  unselectMilPolicies = (index) => {
    const { milPolicies } = this.state
    milPolicies.splice(index, 1);
    this.setState({ milPolicies: milPolicies })
  }

  selectNationalIdeas = (nationalIdeas) => {
    this.setState({ nationalIdeas: nationalIdeas });
  }

  unselectNationalIdeas = () => {
    this.setState({ nationalIdeas: null });
  }

  clearAll = () => {
    this.setState({
      nationalIdeas: null,
      ideaGroups: [],
      greatProjects: [],
      admPolicies: [],
      dipPolicies: [],
      milPolicies: [],
    });
  };

  render() {

    return (
      <ModifiersContext.Provider value={{
        nationalIdeas: this.state.nationalIdeas,
        ideaGroups: this.state.ideaGroups,
        admPolicies: this.state.admPolicies,
        dipPolicies: this.state.dipPolicies,
        milPolicies: this.state.milPolicies,
        greatProjects: this.state.greatProjects,
        selectGreatProject: this.selectGreatProject,
        unselectGreatProject: this.unselectGreatProject,
        selectNationalIdeas: this.selectNationalIdeas,
        unselectNationalIdeas: this.unselectNationalIdeas,
        selectIdeaGroups: this.selectIdeaGroups,
        selectAdmPolicy: this.selectAdmPolicy,
        unselectAdmPolicies: this.unselectAdmPolicies,
        selectDipPolicy: this.selectDipPolicy,
        unselectDipPolicies: this.unselectDipPolicies,
        selectMilPolicy: this.selectMilPolicy,
        unselectMilPolicies: this.unselectMilPolicies,
        unselectIdeaGroups: this.unselectIdeaGroups,
        clearAll: this.clearAll
      }}>
        {this.props.children}
      </ModifiersContext.Provider>
    );
  }
}

export default ModifiersContext