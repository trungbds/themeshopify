import {createContext, type ReactNode, useContext, useState} from 'react';

type AsideType = 'search' | 'mobile' | 'closed';
type SearchHeaderValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function SearchHeaderExpand({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useSearchExpand();
  const expanded = type === activeType;

  return (
    <div
      className={`search-expand ${expanded ? 'expanded' : ''}`}
    >
      {children}
    </div>
  );
}

const SearchHeader = createContext<SearchHeaderValue | null>(null);

SearchHeaderExpand.Provider = function SearchHeaderExpandProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <SearchHeader.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </SearchHeader.Provider>
  );
};

export function useSearchExpand() {
  const expand = useContext(SearchHeader);
  if (!expand) {
    throw new Error('useSearchExpand must be used within an AsideProvider');
  }
  return expand;
}
