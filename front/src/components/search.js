'use client';
import React, { useContext } from 'react';

import NationalIdeasSearchForm from '@/components/forms/nationalIdeas'
import IdeaGroupsSearchForm from '@/components/forms/ideaGroups'
import ReligionsSearchForm from '@/components/forms/religions'
import Forms from '@/components/forms/forms'
import LeftSidePanel from '@/components/leftSidePanel'
import RightSidePanel from '@/components/rightSidePanel';
import { ModifiersProvider } from '@/contexts/modifiersContext';
import ResultsList from './results/results';
import Pagination from '@/components/pagination'

class MainPage extends React.Component {
  render() {
    return (
      <div className="main-container">


        <ModifiersProvider>
          <LeftSidePanel />
          <MainSearch
            onSelectNationalIdeas={this.handleSelectNationalIdeas}

          />
          <RightSidePanel />
        </ModifiersProvider>
      </div>
    )
  }
}



class MainSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchResults: {},
      results: [],
      pagination: {},
    };
  }

  setSearchResults = (searchResults = []) => {
    this.setState({ results: searchResults.results, pagination: searchResults.pagination, isLoading: false })
  };

  setLoading = (isLoading) => {
    this.setState({ isLoading: isLoading })
  };

  render() {
    const { results, pagination } = this.state
    return (
      <div className="search-container">

        <Forms setLoading={this.setLoading} setSearchResults={this.setSearchResults} />

        {/* SearchResults */}
        {this.state.isLoading && <p>Loading...</p>}

        {
          results.length > 0 &&
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            totalResults={pagination.total}
            pageSize={20}
            onPageChange={(page) => console.log('Go to page', page)}
          // onPageSizeChange={(size) => console.log('Change size to', size)}
          // pageSizeOptions={[10, 20, 50, 100]}
          />

        }
        <ResultsList
          results={results}
          isLoading={this.state.isLoading}
          pagination={pagination}
          onSelectNationalIdeas={this.onSelectNationalIdeas}
        />

        {
          results.length > 0 &&
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            totalResults={pagination.total}
            pageSize={20}
            onPageChange={(page) => console.log('Go to page', page)}
          // onPageSizeChange={(size) => console.log('Change size to', size)}
          // pageSizeOptions={[10, 20, 50, 100]}
          />

        }
      </div>
    );
  }
}

export default MainPage;