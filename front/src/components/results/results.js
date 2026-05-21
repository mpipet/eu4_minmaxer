'use client';
import React from 'react';
import NationalIdeas from '@/components/results/nationalIdeas'
import IdeaGroups from '@/components/results/ideaGroups'
import Religions from '@/components/results/religions'
import Policies from '@/components/results/policies'
import GreatProjects from '@/components/results/greatProjects'

export default class ResultsList extends React.Component {
	renderResult(result) {
		switch (result.type) {
			case 'national_ideas':
				return <NationalIdeas key={result.id} ideaSet={result} />;
			case 'idea_groups':
				return <IdeaGroups key={result.id} ideaGroup={result} />;

			case 'religions':
				return <Religions key={result.id} religion={result} />;

			case 'policies':
				return <Policies key={result.id} policy={result} />;

			case 'great_projects':
				return <GreatProjects key={result.id} greatProject={result} />;

			default:
				console.warn(`Unknown result type: ${result.type}`);
				return null;
		}
	}

	render() {
		const { results, isLoading, pagination } = this.props;

		if (isLoading) {
			return (
				<div className="results-loading">
					<p>Loading results...</p>
				</div>
			);
		}

		if (!results || results.length === 0) {
			return (
				<div className="results-empty">
					<p>No results found</p>
				</div>
			);
		}

		return (
			<div className="results-list">
				<div className="results-header">
					<h2>Results ({pagination.total})</h2>
				</div>

				<div className="results-grid">
					{results.map(result => this.renderResult(result))}
				</div>
			</div>
		);
	}
}
