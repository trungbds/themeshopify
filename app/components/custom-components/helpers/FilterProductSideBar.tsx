import React, { useState } from "react";

export function FilterProductSideBar() {
  const [colorExpanded, setColorExpanded] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [sizeExpanded, setSizeExpanded] = useState(false);

  const toggleColorSection = () => setColorExpanded(!colorExpanded);
  const toggleCategorySection = () => setCategoryExpanded(!categoryExpanded);
  const toggleSizeSection = () => setSizeExpanded(!sizeExpanded);

  return (
    <form className="filter-form__product border-gray-200">
      <h3>Filter</h3>
      <ul role="list" className="px-2 py-3 font-medium text-gray-900">
        <li>
          <a href="#" className="block px-2 py-3">
            Totes
          </a>
        </li>
        <li>
          <a href="#" className="block px-2 py-3">
            Backpacks
          </a>
        </li>
        <li>
          <a href="#" className="block px-2 py-3">
            Travel Bags
          </a>
        </li>
        <li>
          <a href="#" className="block px-2 py-3">
            Hip Bags
          </a>
        </li>
        <li>
          <a href="#" className="block px-2 py-3">
            Laptop Sleeves
          </a>
        </li>
      </ul>

      {/* Color Section */}
      <div className="border-t border-gray-200 px-4 py-6">
        <h3 className="-mx-2 -my-3 flow-root">
          <button
            type="button"
            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
            aria-controls="filter-section-mobile-0"
            aria-expanded={colorExpanded}
            onClick={toggleColorSection}
          >
            <span className="font-medium text-gray-900">Color</span>
            <span className="ml-6 flex items-center">
              {colorExpanded ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              )}
            </span>
          </button>
        </h3>
        {colorExpanded && (
          <div className="pt-6" id="filter-section-mobile-0">
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  id="filter-mobile-color-0"
                  name="color[]"
                  value="white"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-color-0"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  White
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-color-1"
                  name="color[]"
                  value="beige"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-color-1"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  Beige
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-color-2"
                  name="color[]"
                  value="blue"
                  type="checkbox"
                  checked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-color-2"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  Blue
                </label>
              </div>
              {/* Add more color options as necessary */}
            </div>
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="border-t border-gray-200 px-4 py-6">
        <h3 className="-mx-2 -my-3 flow-root">
          <button
            type="button"
            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
            aria-controls="filter-section-mobile-1"
            aria-expanded={categoryExpanded}
            onClick={toggleCategorySection}
          >
            <span className="font-medium text-gray-900">Category</span>
            <span className="ml-6 flex items-center">
              {categoryExpanded ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              )}
            </span>
          </button>
        </h3>
        {categoryExpanded && (
          <div className="pt-6" id="filter-section-mobile-1">
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  id="filter-mobile-category-0"
                  name="category[]"
                  value="new-arrivals"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-category-0"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  New Arrivals
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-category-1"
                  name="category[]"
                  value="sale"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-category-1"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  Sale
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-category-2"
                  name="category[]"
                  value="travel"
                  type="checkbox"
                  checked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-category-2"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  Travel
                </label>
              </div>
              {/* Add more category options as necessary */}
            </div>
          </div>
        )}
      </div>

      {/* Size Section */}
      <div className="border-t border-gray-200 px-4 py-6">
        <h3 className="-mx-2 -my-3 flow-root">
          <button
            type="button"
            className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
            aria-controls="filter-section-mobile-2"
            aria-expanded={sizeExpanded}
            onClick={toggleSizeSection}
          >
            <span className="font-medium text-gray-900">Size</span>
            <span className="ml-6 flex items-center">
              {sizeExpanded ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              )}
            </span>
          </button>
        </h3>
        {sizeExpanded && (
          <div className="pt-6" id="filter-section-mobile-2">
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  id="filter-mobile-size-0"
                  name="size[]"
                  value="2l"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-size-0"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  2L
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-size-1"
                  name="size[]"
                  value="6l"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-size-1"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  6L
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="filter-mobile-size-2"
                  name="size[]"
                  value="12l"
                  type="checkbox"
                  checked
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="filter-mobile-size-2"
                  className="ml-3 min-w-0 flex-1 text-gray-500"
                >
                  12L
                </label>
              </div>
              {/* Add more size options as necessary */}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

