'use client';
import React from 'react';

export default class Pagination extends React.Component {
    getPageNumbers() {
        const { currentPage, totalPages } = this.props;
        const pages = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const leftSide = currentPage - 2;
            const rightSide = currentPage + 2;

            pages.push(1);

            if (leftSide > 2) {
                pages.push('...');
            }

            for (let i = Math.max(2, leftSide); i <= Math.min(totalPages - 1, rightSide); i++) {
                pages.push(i);
            }

            if (rightSide < totalPages - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    }

    render() {
        const {
            currentPage,
            totalPages,
            totalResults,
            pageSize,
            onPageChange,
            onPageSizeChange,
            pageSizeOptions = [10, 20, 50, 100]
        } = this.props;

        if (totalPages <= 1 && !onPageSizeChange) {
            return null;
        }

        const startResult = (currentPage - 1) * pageSize + 1;
        const endResult = Math.min(currentPage * pageSize, totalResults);
        const pages = this.getPageNumbers();

        return (
            <div className="pagination-container">
                <div className="pagination-info">
                    <span className="pagination-info-text">
                        Showing {startResult}-{endResult} of {totalResults} results
                    </span>
                </div>

                <div className="pagination-controls">
                    <button
                        className="pagination-btn pagination-btn-prev"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous page"
                    >
                        ‹
                    </button>

                    <div className="pagination-pages">
                        {pages.map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                        …
                                    </span>
                                );
                            }

                            return (
                                <button
                                    key={page}
                                    className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="pagination-btn pagination-btn-next"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Next page"
                    >
                        ›
                    </button>
                </div>

                {onPageSizeChange && (
                    <div className="pagination-size-selector">
                        <span className="pagination-size-label">Per page:</span>
                        <select
                            className="pagination-size-select"
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
    }
}