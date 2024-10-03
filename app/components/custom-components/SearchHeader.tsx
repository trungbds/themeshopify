import iconsearch from '~/assets/fonts/icons/icon-search.svg';
import React, { useRef, useEffect } from 'react';

import {Link} from '@remix-run/react';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {SearchHeaderExpand, useSearchExpand} from '~/components/custom-components/SearchHeaderExpand'

export function SearchHeader(
  {openOverlayClick,closeOverlayClick }: { 
    openOverlayClick : () => void,
    closeOverlayClick: () => void
  }
){
  const {open, close} = useSearchExpand();
  const activeSearch = () => { 
    open('search');
    openOverlayClick();
  }
  const closeSearchHeader = () => { 
    close();
    closeOverlayClick();
  }

  const searchRef = useRef<HTMLDivElement | null>(null); // Chỉ định rõ kiểu HTMLDivElement hoặc null
  // Sự kiện kích hoạt bên ngoài DOM
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra nếu nhấn vào ngoài search box và searchRef không phải là null
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearchHeader();
      }
    };

    // Thêm event listener cho document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearchHeader]);


  return (
    <div className='search-header' ref={searchRef}>

      {/* Search button */}
      <SearchFormPredictive>
        {({fetchResults, goToSearch, inputRef}) => (
          <div
            className="search-header__btn max-w-md mx-auto"
            onClick={activeSearch}
          >
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"> Search </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-6">
                  <img src={iconsearch} width="20px" height="auto"/>
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
      {/* Search Results */}
      <SearchResultsExpand />
    </div>

  );
}


function SearchResultsExpand() {
  return (
    <SearchHeaderExpand type="search" heading="SEARCH">
      <div className="predictive-search">
        <SearchResultsPredictive>
          {({items, total, term, state, inputRef, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

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
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
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

