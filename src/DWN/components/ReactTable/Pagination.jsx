import React, { useState } from "react";
import "./ReactTable.scss";
export const Pagination = ({ pagination, data }) => {
  const { page, getPages } = pagination?.state;
  const currentIndex = Number(page) || 0;
  const lastPageNo = data?.nodes ? getPages((data?.nodes)).length : 0;
  const [pageNumberLimit, setPageNumberLimit] = useState(4);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(-1);

  const handleNext = () => {
    pagination.fns.onSetPage(currentIndex + 1);
    if (currentIndex + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevious = () => {
    pagination.fns.onSetPage(currentIndex - 1);
    if ((currentIndex - 1) <= minPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const renderPageNumbers = getPages(data?.nodes)?.map((_, index) => {
    if (index < maxPageNumberLimit + 1 && index > minPageNumberLimit) {

      return (
        <button
          key={`${index}-${maxPageNumberLimit}-${minPageNumberLimit}`}
          type="button"
          onClick={() => pagination.fns.onSetPage(index)}
          className={`${currentIndex === index ?  'page-selected' :  'page-link'}`}
        >
          {index + 1}
        </button>
      );
    } else {
      return null;
    }
  });
  return (
    <>
    <nav className="nav-pagination">
      <ul className="pagination">
        <li
          className={`page-item ${currentIndex === 0 ? "disabled" : ""}`}
          onClick={currentIndex !== 0 ? handlePrevious : null}
        ><button type="button" className="page-link">&lang;</button>
        </li>
        {renderPageNumbers}
        <li
          className={`page-item ${
            lastPageNo === currentIndex + 1 ? "disabled" : ""
          }`}
          onClick={lastPageNo === currentIndex + 1 ? null : handleNext}
        ><button type="button" className="page-link">&rang;</button>
        </li>
      </ul>
    </nav>
    <br></br>
    </>
  );
};
