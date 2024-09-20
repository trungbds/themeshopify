import { useState, useEffect } from 'react';

type Option = {
  name: string;
  values: string[];
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
  options: Option[];
  variants: Variant[];
  onVariantSelected: (variant: Variant | null) => void; // Callback để truyền kết quả lên component cha
};

export function ProductModalVariantOptions({
  options,
  variants,
  onVariantSelected,
}: ProductModalVariantOptionsProps) {
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});

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
    <div>
      {options.map((option) => (
        <div key={option.name}>
          <h5>
            {option.name}: <span>{selectedValues[option.name] || null }</span>
          </h5>
          {option.values.map((value) => {
            const available = isOptionAvailable(option.name, value);
            const selected = selectedValues[option.name] === value;

            return (
              <button
                key={value}
                className={`product-options-item ${selected ? 'selected' : ''}`}
                onClick={() => handleSelectValue(option.name, value)}
                style={{
                  opacity: available ? 1 : 0.5, // Làm mờ nhưng vẫn có thể chọn
                  fontWeight: selected ? 'bold' : 'normal', // Đậm hơn nếu đang chọn
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
