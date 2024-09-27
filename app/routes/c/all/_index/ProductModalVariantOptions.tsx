import {Image, type VariantOption,  VariantSelector } from '@shopify/hydrogen';
import { useState, useEffect } from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';

type Option = {
  name: string;
  values: string[];
  optionValues: any[];
};

type SelectedOption = {
  name: string;
  value: string;
};

type Variant = {
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  id: string;
  price: { amount: string; currencyCode: string };
};

type ProductModalVariantOptionsProps = {
  handle: string;
  options: Option[];
  variants:  Array<ProductVariantFragment>;
  onVariantSelected: (variant: Variant | null) => void; // Callback để truyền kết quả lên component cha
};

export function ProductModalVariantOptions({
  options,
  handle,
  variants,
  onVariantSelected,
}: ProductModalVariantOptionsProps) {
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});

  const optionsHandle = options.map(option => {
    const hasColor = option.optionValues.some(value => value.swatch && value.swatch.color);
    return {
      name: option.name,
      values: option.values,
      isVariantColor: hasColor
    };

  });

  const createVariantsArray = (optionsHandle: any[], variants: any[]) =>  {
    const result = optionsHandle.map(option => {

        if (option.isVariantColor) {
            const expandedValues = option.values.map((value :any) => {
                const variant = variants.find(v => v.selectedOptions.some((opt :any) => opt.name === option.name && opt.value === value));
                if (variant) {
                    return {
                        value: value,
                        image: variant.image,
                    };
                } else {
                    return { value };
                }
            });

            return {
                ...option,
                values: expandedValues
            };
        }

        // Nếu không phải là isVariantColor, giữ nguyên cấu trúc
        return option;
    });

    return result;
  };

  const variantsArray = createVariantsArray(optionsHandle, variants);

  useEffect(() => {
    const findSelectedVariant = () => {
      if (Object.keys(selectedValues).length !== options.length) {
        onVariantSelected(null); // Nếu chưa đủ các tùy chọn, không có biến thể nào được chọn
        return;
      }

      const matchingVariant = variants.find((variant) =>
        variant.selectedOptions.every(
          (opt) => selectedValues[opt.name] === opt.value
        )
      );

      onVariantSelected(matchingVariant || null);
    };

    findSelectedVariant();
  }, [selectedValues, options, variants, onVariantSelected]);

  const handleSelectValue = (optionName: string, value: string) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [optionName]: value,
    }));
  };

  const isOptionAvailable = (optionName: string, value: string): boolean => {
    const filteredVariants = variants.filter((variant) => {
      return Object.entries(selectedValues).every(([name, selectedValue]) => {
        if (name === optionName) return true; // Bỏ qua nhóm hiện tại
        return variant.selectedOptions.some(
          (opt) => opt.name === name && opt.value === selectedValue
        );
      });
    });

    return filteredVariants.length > 0 && filteredVariants.some(
      (variant) =>
        variant.selectedOptions.some(
          (opt) => opt.name === optionName && opt.value === value
        ) && variant.availableForSale
    );
  };


  return (
    <>
      {variantsArray.map((option) => (
        <div key={option.name} className='product-form__item'>
          <h5 className='product-form__item--header'>
            {option.name}: <span>{selectedValues[option.name] || <span className='no-selection'>*no selection yet </span> }</span>
          </h5>

          <div className='product-options-grid'>
            { option.isVariantColor ? (
                option.values.map((value: any) => {
                  const selected = selectedValues[option.name] === value.value;
                  const available = isOptionAvailable(option.name, value.value);
                  return (
                    <button key={value.name} className={`product-options-item variant-color  ${selected ? 'selected' : ''}`}>
                      <Image
                        alt={value.image.altText || value.name}  // Cung cấp giá trị cho thuộc tính alt
                        aspectRatio="1/1"
                        data={value.image}
                        loading="lazy"
                        height={73}
                        width={73}
                        onClick={() => handleSelectValue(option.name, value.value)}
                        style={{
                          opacity: available ? 1 : 0.5,
                        }}
                      />
                    </button>
                  );
                })
            ) : (
              option.values.map((value:any) => {

                const available = isOptionAvailable(option.name, value);
                const selected = selectedValues[option.name] === value;
                
                return (
                  <button
                    key={value}
                    className={`product-options-item ${selected ? 'selected' : ''}`}
                    onClick={() => handleSelectValue(option.name, value)}
                    style={{
                      opacity: available ? 1 : 0.5, // Làm mờ nhưng vẫn có thể chọn
                    }}
                  >
                    {value}
              
                  </button>
                );
              })
            )}

          </div>

            
          
        </div>
      ))}

      
    </>
  );
}
