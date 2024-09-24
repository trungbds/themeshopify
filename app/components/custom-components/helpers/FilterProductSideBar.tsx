import React, { useState, useEffect } from "react";
import iconreset from '~/assets/fonts/icons/icon-reset.svg';
import iconclose from '~/assets/fonts/icons/icon-close.svg';
import iconcheckbox from '~/assets/fonts/icons/icon-checkbox.svg';
import iconcheckboxoutline from '~/assets/fonts/icons/icon-checkbox-outline.svg';





type FilterProductSideBarProps = {
  isActive?: boolean;
  data?: any;
};

export function FilterProductSideBar({ isActive, data }: FilterProductSideBarProps) {
  if (!isActive) return null;

  console.log('Data', data);

  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    // 'filter.p.vendor': true,
    // 'filter.v.option.color': true
  });

  const [stickyTop, setStickyTop] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const getElementDistanceTop = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const computedStyles = window.getComputedStyle(element);
      const paddingTop = parseFloat(computedStyles.paddingTop);
      const marginTop = parseFloat(computedStyles.marginTop);
      return paddingTop + marginTop;
    }
    return 0;
  };

  const getElementHeight = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      return element.offsetHeight;
    }
    return 0;
  };

  const calculateStickyTop = () => {
    const breadcrumbsHeight = getElementHeight('.breadcrumbs-section');
    const collectionHeaderHeight = getElementHeight('.collection-page__header');
    const collectionDetailPadding = getElementDistanceTop('.collection-page__detail');
    const mainDetailPadding = getElementDistanceTop('.collection-page__detail');
    const selfDetailPadding = getElementDistanceTop('.filter-form__product');

    const totalHeight = breadcrumbsHeight + collectionHeaderHeight - collectionDetailPadding - mainDetailPadding - selfDetailPadding;
    setStickyTop(totalHeight);
  };

  useEffect(() => {
    calculateStickyTop();
    window.addEventListener('resize', calculateStickyTop);

    return () => {
      window.removeEventListener('resize', calculateStickyTop);
    };
  }, []);

  const IconDropdown = ({ className }: { className: string }) => {
    return (
      <div className={`icon ${className}`}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.9998 11.3252L4.51855 6.8252H13.4811L8.9998 11.3252Z" fill="#000" />
        </svg>
      </div>
    );
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedFilters(prevSelected => 
      prevSelected.includes(optionId) 
        ? prevSelected.filter(item => item !== optionId) 
        : [...prevSelected, optionId]
    );
  };

  const handleReset = () => {
    setSelectedFilters([]);
  };

  return (
    <div
      className="filter-form__product border-gray-200"
      style={{ top: `${stickyTop}px` }}
    >
      <div className="filter-form__product-header">
        <h3 className="title font-medium">Filter</h3>
        <button
          type="button"
          className="btn link-primary text-sm inline-flex font-semibold gap-1 items-center"
          onClick={handleReset}
        >
          <img src={iconreset} alt="reset icon" />
          <span className="link-hover">Reset all</span>
        </button>
        <ul className="filter-result">
          {selectedFilters.map((filter, index) => (
            <li
              onClick={() => handleOptionChange(filter)}
              className="filter-result__item btn" key={index}>
              {filter}
              <img src={iconclose} width='16px' height='16px'/>
            </li>
          ))}
        </ul>
      </div>

      {data.map((item: any) => (
        <div key={item.id} className="filter-form__block border-t border-gray-200 py-6">
          <div className="-mx-2 -my-3 flow-root">
            <button
              type="button"
              className="btn flex w-full items-center justify-between bg-white px-2"
              aria-controls={`filter-block-${item.id}`}
              aria-expanded={expandedSections[item.id]}
              onClick={() => toggleSection(item.id)}
            >
              <h5 className="font-medium">{item.label}</h5>
              <span className="ml-6 flex items-center">
                <IconDropdown className={expandedSections[item.id] ? "expanded" : "collapsed"} />
              </span>
            </button>

            {expandedSections[item.id] && (
              <div
                className={`filter-options__list pt-6 ${
                  item.id === "filter.v.price" ? "filter-options__list--price" :
                  item.id === "filter.v.availability" ? "filter-options__list--availability" :
                  ""
                }`}
                id={`filter-block-${item.id}`}
              >
                {(() => {
                  {/* Nội dung tùy chỉnh cho "filter.v.price" */}
                  switch (item.id) {
                    case "filter.v.price":
                      return (
                        <>
                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('Under $50') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('Under $50')}
                          >
                            <img src={selectedFilters.includes('Under $50') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            Under $50
                          </div>

                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('$50 - $100') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('$50 - $100')}
                          >
                            <img src={selectedFilters.includes('$50 - $100') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            $50 - $100
                          
                          </div>

                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('$100 - $150') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('$100 - $150')}
                          >
                            <img src={selectedFilters.includes('$100 - $150') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            $100 - $150
                          </div>

                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('$150 - $250') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('$150 - $250')}
                          >
                            <img src={selectedFilters.includes('$150 - $250') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            $150 - $250
                           
                          </div>

                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('$250 - $500') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('$250 - $500')}
                          >
                            <img src={selectedFilters.includes('$250 - $500') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            $250 - $500
                          </div>

                          <div 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes('Over $500') ? "selected" : ""}`}
                            onClick={() => handleOptionChange('Over $500')}
                          >
                            <img src={selectedFilters.includes('Over $500') ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                            Over $500
                          </div>
                        </>
                      );
                    {/* Nội dung tùy chỉnh cho "filter.v.availability" */}
                    case "filter.v.availability":
                      return item.values.map((option: any, index: number) => {
                        const inputValue = JSON.parse(option.input);
                        return (
                          <div 
                            key={index} 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes(option.label) ? "selected" : ""}`}
                            onClick={() => handleOptionChange(option.label)}
                            data-input={inputValue}
                          >
                            <div className="min-w-0 flex-1">
                              {option.label}
                            </div>
                          </div>
                        );
                      });

                    default:
                      return item.values.map((option: any, index: number) => {
                        const inputValue = JSON.parse(option.input);
                        return (
                          <div 
                            key={index} 
                            className={`items-center option-item cursor-pointer ${selectedFilters.includes(option.label) ? "selected" : ""}`}
                            onClick={() => handleOptionChange(option.label)}
                            data-input={inputValue}
                          >
                            <div className="min-w-0 flex-1">
                              {option.label}
                            </div>
                          </div>
                        );
                      });
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      ))}


    </div>
  );
}
