import React from "react";
import './Pagination.css';

const SimplePagination = ({ totalPage, currentPage, setPage, maxPageButtons = 5 }) => {
    if (totalPage <= 1) return null; // Don't show pagination if only 1 page

    const getPageNumbers = () => {
        const half = Math.floor(maxPageButtons / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxPageButtons - 1, totalPage);

        if (end - start + 1 < maxPageButtons) {
            start = Math.max(end - maxPageButtons + 1, 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="pagination-container">
            <ul className="pagination">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                </li>

                {/* Page Number Buttons */}
                {getPageNumbers().map((pageNum) => (
                    <li
                        key={pageNum}
                        className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                    >
                        <button
                            className="page-link"
                            onClick={() => setPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPage ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPage}
                    >
                        &gt;
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default SimplePagination;