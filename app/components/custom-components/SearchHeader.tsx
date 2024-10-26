import iconsearch from '~/assets/fonts/icons/icon-search.svg';
import React, { useRef, useEffect } from 'react';
import { Link } from '@remix-run/react';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import { SearchHeaderExpand, useSearchExpand } from '~/components/custom-components/SearchHeaderExpand';
import { IconDefaultArrowForward } from './icons/default/IconDefaultArrowForward';
import useHeaderOverlay from './helpers/useHeaderOverlay';

export function SearchHeader() {
  const [isOverlayOpen, openOverlay, closeOverlay] = useHeaderOverlay(); // Sử dụng hook
  const { open, close } = useSearchExpand();
  const searchRef = useRef<HTMLDivElement | null>(null);

  const activeSearch = () => {
    open('search');
    openOverlay(); // Gọi hàm mở overlay
  };

  const closeSearchHeader = () => {
    close();
    closeOverlay(); // Gọi hàm đóng overlay
  };

  // Sự kiện kích hoạt bên ngoài DOM và cuộn trang
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearchHeader();
      }
    };

    const handleScroll = () => {
      closeSearchHeader();
    };

    if (isOverlayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOverlayOpen, closeSearchHeader]);

  return (
    <div className='search-header' ref={searchRef}>
      <SearchFormPredictive>
        {({ fetchResults, goToSearch, inputRef }) => (
          <div
            className="search-header__btn max-w-md mx-auto"
            onClick={activeSearch}
          >
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"> Search </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-6">
                <img src={iconsearch} width="20px" height="auto" />
              </div>
              <input
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="What can we help you find?"
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                ref={inputRef}
                type="search"
              />
            </div>
          </div>
        )}
      </SearchFormPredictive>
      <SearchResultsExpand />
    </div>
  );
}

function SearchResultsExpand() {
  return (
    <SearchHeaderExpand type="search" heading="SEARCH">
      <div className="predictive-search">
        <SearchResultsPredictive>
          {({ items, total, term, state, inputRef, closeSearch }) => {
            const { articles, collections, pages, products, queries } = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  inputRef={inputRef}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    className='all-results-predictive'
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q><IconDefaultArrowForward />
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </SearchHeaderExpand>
  );
}
