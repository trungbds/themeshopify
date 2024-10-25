import React, { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";

import iconreset from '~/assets/fonts/icons/icon-reset.svg';
import iconclose from '~/assets/fonts/icons/icon-close.svg';
import iconcheckbox from '~/assets/fonts/icons/icon-checkbox.svg';
import iconcheckboxoutline from '~/assets/fonts/icons/icon-checkbox-outline.svg';
import iconfilter from '~/assets/fonts/icons/icon-filter.svg';
import icondropdown from '~/assets/fonts/icons/icon-dropdown.svg';



type FilterProductSideBarProps = {
  isActive?: boolean;
  data?: any;
  filtersParams?:any;
  collectionId: string;
};

export function FilterProductSideBar({ isActive, data, filtersParams, collectionId }: FilterProductSideBarProps) {
  
  if (!isActive) return null;
  const navigate = useNavigate();


  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    // 'filter.p.vendor': true,
    // 'filter.v.option.color': true
  });

  const [stickyTop, setStickyTop] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<any[]>(filtersParams);
  const [selectedInputValues, setSelectedInputValues] = useState<any[]>(filtersParams);
  
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

  let totalHeight;

  if (window.innerWidth <= 768) { // Kiểm tra nếu là mobile (tối đa 768px)
    // Logic cho mobile
    const headerHeight = getElementHeight('header[class="header"]');
    totalHeight = headerHeight;
  } else {
    // Logic cho desktop
    totalHeight =
      breadcrumbsHeight +
      collectionHeaderHeight -
      collectionDetailPadding -
      mainDetailPadding -
      selfDetailPadding;
  }

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

  const priceOptions = [
    { value: {price:{min:0 ,max:50}}, label: 'Under $50' },
    { value: {price:{min:50 ,max:100}}, label: '$50 - $100' },
    { value: {price:{min:100 ,max:150}}, label: '$100 - $150' },
    { value: {price:{min:150 ,max:250}}, label: '$150 - $250' },
    { value: {price:{min:250 ,max:500}}, label: '$250 - $500' },
    { value: {price:{min:500}}, label: 'Over $500' },
  ];

  const handleOptionChange = (optionValue: any, inputValue?: any, reset?:boolean) => {
    let newSelectedFilters;

    if (reset) {
      navigate(window.location.pathname); // Điều hướng đến URL hiện tại mà không có query params
        return;
    }

    const priceRanges = priceOptions.map(option => option.value);
    // Xử lý trường hợp chọn mức giá, chỉ giữ lại 1 giá trị duy nhất
    if (priceRanges.some(priceRange => 
      JSON.stringify(priceRange) === JSON.stringify(optionValue))) {
      
      setSelectedFilters((prevSelected) => {
        newSelectedFilters = prevSelected.some((item) => JSON.stringify(item) === JSON.stringify(optionValue))
          ? prevSelected.filter((item) => JSON.stringify(item) !== JSON.stringify(optionValue)) // Nếu đã chọn, bỏ chọn
          : [optionValue]; // Nếu chưa chọn, thay thế bằng giá trị mới

        return newSelectedFilters;
      });
    } else {
      // Logic mặc định cho các trường hợp khác
      setSelectedFilters((prevSelected) => {
        newSelectedFilters = prevSelected.some((val) => JSON.stringify(val) === JSON.stringify(inputValue))
          ? prevSelected.filter((val) => JSON.stringify(val) !== JSON.stringify(inputValue)) // Bỏ chọn
          : [...prevSelected, inputValue]; // Thêm giá trị vào mảng nếu chưa tồn tại

        return newSelectedFilters;
      });
    }

    let newInputValues;
    // Xử lý inputValues
    setSelectedInputValues((prevInputValues) => {

      const isPriceValue = optionValue && priceRanges.some(priceRange => JSON.stringify(priceRange) === JSON.stringify(optionValue));

      if(isPriceValue) {
        newInputValues = prevInputValues.some((item) => JSON.stringify(item) === JSON.stringify(optionValue))
        ? prevInputValues.filter((item) => JSON.stringify(item) !== JSON.stringify(optionValue)) // Nếu đã chọn, bỏ chọn
        : [optionValue]; // Nếu chưa chọn, thay thế bằng giá trị mới
      } else {
        newInputValues = prevInputValues.some((val) => JSON.stringify(val) === JSON.stringify(inputValue))
        ? prevInputValues.filter((val) => JSON.stringify(val) !== JSON.stringify(inputValue)) // Bỏ chọn
        : [...prevInputValues, inputValue]; // Thêm giá trị vào mảng nếu chưa tồn tại
      }
      // Xử lý logic chọn/bỏ chọn cho các input values
      // newInputValues = prevInputValues.some((val) => JSON.stringify(val) === JSON.stringify(inputValue))
      //   ? prevInputValues.filter((val) => JSON.stringify(val) !== JSON.stringify(inputValue)) // Bỏ chọn
      //   : [...prevInputValues, inputValue]; // Thêm giá trị vào mảng nếu chưa tồn tại
  
      // Nhóm các giá trị theo `variantOption`, `productVendor`, và `price`
      const groupedInputValues = newInputValues.reduce((acc, curr) => {
        if (curr.variantOption) {
          const { name, value } = curr.variantOption;
          acc['variantOption'] = acc['variantOption'] || [];
          acc['variantOption'].push({ [name]: value }); // Thay đổi định dạng thành { name: value }
        } else if (curr.productVendor) {
          acc['productVendor'] = acc['productVendor'] || [];
          acc['productVendor'].push(curr.productVendor); // Thêm vào danh sách productVendor
        } else if (curr.price) {
          acc['price'] = curr.price; // Chỉ lưu giá trị price duy nhất
        }
        return acc;
      }, {});
  
      // Tạo query param từ groupedInputValues
      const queryParams = Object.entries(groupedInputValues)
        .map(([key, values]) => {
          if (key === 'price') {
            // Encode giá trị price dưới dạng JSON
            return `${key}=${encodeURIComponent(JSON.stringify(values))}`;
          } else if (key === 'variantOption') {
            // Encode `variantOption` với định dạng yêu cầu và mã hóa toàn bộ chuỗi
            return `${key}=${encodeURIComponent(JSON.stringify(values))}`;
          } else if (Array.isArray(values)) {
            // Ép kiểu các giá trị thành chuỗi trước khi mã hóa
            return `${encodeURIComponent(key)}=${(values as string[]).map(value => encodeURIComponent(value)).join(',')}`;
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(values as string)}`;
        })
        .join('&');
  
      const urlNewInputValues = `${window.location.pathname}?${queryParams}`;
      navigate(urlNewInputValues);
      return newInputValues;
    });

  };

  useEffect(() => {
    console.log("Selected Input Values Updated:", selectedInputValues);
    // console.log("selectedFilters Values Updated:", selectedFilters);
    
  }, [selectedInputValues, selectedFilters]);

  // useEffect(() => {
  //   setSelectedFilters([]);
  //   setSelectedInputValues([]);
    
  // }, [window.location.pathname]);
  
  const handleReset = () => {
    setSelectedFilters([]);
    setSelectedInputValues([]);
    handleOptionChange(undefined, undefined, true); 
  };

  return (
    <div
      className={`filter-form__product border-gray-200 ${expandedSections['filter-form__product-content'] ? 'open' : ''}`}
      style={{ top: `${stickyTop}px` }}
    >
      <div 
        className="filter-form__product-header"
        onClick={() => toggleSection('filter-form__product-content')}
        
      >
        <h3 className="title">
          <div className="btn">
            <img src={iconfilter}/>
            <img src={iconfilter}/>
            <span>Filter</span>
          </div>

          { selectedFilters.length > 0 && <span className="filter-count">( {selectedFilters.length} )</span> } 
        </h3>
        <button
          type="button"
          className={`btn link-primary btn-reset text-sm inline-flex font-semibold gap-1 items-center ${selectedFilters.length > 0 ? 'isActived' : ''}`}
          onClick={handleReset}
        >
          <img src={iconreset} alt="reset icon" />
          <span className="link-hover">Reset all</span>
        </button>

        <img className="icon-dropdown" src={icondropdown} alt="icon dropdown" />

        <ul className="filter-result">
          {selectedFilters.map((filter, index) => {
            let filterLabel = '';

            // Kiểm tra filter là loại giá (price)
            if (filter.price) {
              // Tìm trong priceOptions để lấy label tương ứng
              const priceOption = priceOptions.find(option => 
                JSON.stringify(option.value.price) === JSON.stringify(filter.price));
              filterLabel = priceOption ? priceOption.label : '';
            } 
            // Kiểm tra filter là loại vendor (productVendor)
            else if (filter.productVendor) {
              filterLabel = filter.productVendor;
            } 
            // Kiểm tra filter là loại biến thể (variantOption)
            else if (filter.variantOption) {
              filterLabel = filter.variantOption.value;
            }

            return (
              <li
                onClick={() => handleOptionChange(filter, filter)} // Pass empty object for now
                className="filter-result__item btn"
                key={index}
              >
                {filterLabel} {/* Hiển thị nhãn đã xác định */}
                <img src={iconclose} width='16px' height='16px' alt="Remove filter" />
              </li>
            );
          })}

        </ul>
      </div>

      <div className="filter-form__product-content">
        {data.map((item: any) => (
          <div key={item.id} className="filter-form__block border-t border-gray-200">
            <div className="flow-root">
              <button
                type="button"
                className="btn flex w-full items-center justify-between bg-white"
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
                              onClick={() => handleOptionChange({price:{min: 0, max: 50}},{price:{min: 0, max: 50}})}
                              data-input="{price:{min: 0, max: 50}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price:{min: 0, max: 50}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              Under $50
                            </div>

                            <div 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes('$50 - $100') ? "selected" : ""}`}
                              onClick={() => handleOptionChange({price:{min: 50, max: 100}},{price:{min: 50, max: 100}})}
                              data-input="{price:{min: 50, max: 100}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price:{min: 50, max: 100}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              $50 - $100
                            </div>

                            <div 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes('$100 - $150') ? "selected" : ""}`}
                              onClick={() => handleOptionChange({price:{min: 100, max: 150}},{price:{min: 100, max: 150}})}
                              data-input="{price:{min: 100, max: 150}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price:{min: 100, max: 150}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              $100 - $150
                            </div>

                            <div 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes('$150 - $250') ? "selected" : ""}`}
                              onClick={() => handleOptionChange({price:{min: 150, max: 250}},{price:{min: 150, max: 250}})}
                              data-input="{price:{min: 150, max: 250}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price:{min: 150, max: 250}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              $150 - $250
                            
                            </div>

                            <div 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes('$250 - $500') ? "selected" : ""}`}
                              onClick={() => handleOptionChange({price:{min: 250, max: 500}},{price:{min: 250, max: 500}})}
                              data-input="{price:{min: 250, max: 500}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price:{min: 250, max: 500}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              $250 - $500
                            </div>

                            <div 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes('{price:{min: 500}}') ? "selected" : ""}`}
                              onClick={() => handleOptionChange({price:{min: 500}},{price:{min: 500}})}
                              data-input="{price:{min: 500}}"
                            >
                              <img src={selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify({price: {min: 500}})) ? iconcheckbox : iconcheckboxoutline} alt="Checkbox Icon" />
                              Over $500
                            </div>
                          </>
                        );

                      {/* Nội dung tùy chỉnh cho "filter.v.availability" */}
                      case "filter.v.availability":
                        return item.values.map((option: any, index: number) => {
                          // const inputValue = JSON.parse(option.input);
                          const inputValue = JSON.parse(option.input);
                          return (
                            <div 
                              key={index} 
                              className={`items-center option-item cursor-pointer ${selectedFilters.includes(option.label) ? "selected" : ""}`}
                              onClick={() => handleOptionChange(inputValue, inputValue)}
                              data-input={JSON.stringify(inputValue)}
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
                          let check = selectedFilters.some(filter => JSON.stringify(filter) === JSON.stringify(inputValue));

                          return (
                            <div 
                              key={index} 
                              className={`items-center option-item cursor-pointer ${check? "selected" : ""}`}
                              onClick={() => handleOptionChange(inputValue, inputValue)}
                              data-input={JSON.stringify(inputValue)}
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

      

    </div>
  );
}
