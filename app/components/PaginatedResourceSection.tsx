import React, { useState, useEffect } from 'react'; 
import { Pagination } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

/**
 * <PaginatedResourceSection> is a component that encapsulates pagination behavior.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{ node: NodesType; index: number }>;
  resourcesClassName?: string;
}) {
  const [currentNodes, setCurrentNodes] = useState<NodesType[]>([]);

  // UseEffect to update nodes when the pagination changes (e.g., next/previous page)
  useEffect(() => {
    if (connection && connection.nodes) {
      setCurrentNodes(connection.nodes);
    }
  }, [connection]);

  return (
    <Pagination connection={connection}>
      {({ nodes, isLoading, PreviousLink, NextLink }) => {
        const resourcesMarkup = currentNodes.map((node, index) => 
          children({ node, index })
        );

        // Lấy thông tin từ pageInfo
        const { pageInfo } = connection;

        return (
          <>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}

            <div className='pagination'>
              {/* Kiểm tra hasPreviousPage */}
              {pageInfo.hasPreviousPage && (
                <Link
                  to={`?direction=previous&cursor=${encodeURIComponent(pageInfo.startCursor)}`}
                  prefetch="intent"
                  className='btn btn-primary link-primary btn-Prev btn-pagination'
                >
                  {isLoading ? <span>Loading...</span> : 
                    <>
                      <img src={iconchevronleft} alt='previous' />
                      <span className='link-hover'>Previous</span>
                    </>
                  }
                </Link>
              )}
              {/* Kiểm tra hasNextPage */}
              {pageInfo.hasNextPage && (
                <Link 
                  to={`?direction=next&cursor=${encodeURIComponent(pageInfo.endCursor)}`}
                  prefetch="intent" 
                  className='btn btn-primary link-primary btn-next btn-pagination'
                >
                  {isLoading ? <span>Loading...</span>: 
                    <>
                      <span className='link-hover'>Next</span>
                      <img src={iconchevronright} alt='next' />
                    </>
                  }
                </Link>
              )}
            </div>

          </>
        );
      }}
    </Pagination>
  );
}
