import { useMatches } from '@remix-run/react';
import { z } from 'zod'; 

type TemplateType = 'default' | 'product' | 'homepage';
type BreadcrumbsProps = {
//   type: TemplateType;
  isActive: Boolean
};

export const breadcrumbTypeSchema = z.enum(['collections','collection']);
export type TBreadcrumbType = z.infer< typeof breadcrumbTypeSchema>

export function Breadcrumbs({isActive}: BreadcrumbsProps){

    const matches = useMatches();
    const deepestRoute = matches.at(-1);

    console.log(matches );

    return (

        <section className='breadcrumbs-section'>
            <div className="container">
                <div className='breadcrumbs'>
                    <ol className='flex items-center whitespace-nowrap breadcrumbs-list'>
                        <li className='inline-flex items-center'>
                            <a className='flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500' href='#'>
                            Home
                            </a>
                            <svg className='shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
                            <path d='M6 13L10 3' stroke='currentColor' stroke-linecap='round'></path>
                            </svg>
                        </li>
                        <li className='inline-flex items-center'>
                            <a className='flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500' href='#'>
                            App Center
                            <svg className='shrink-0 size-5 text-gray-400 dark:text-neutral-600 mx-2' width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
                                <path d='M6 13L10 3' stroke='currentColor' stroke-linecap='round'></path>
                            </svg>
                            </a>
                        </li>
                        <li className='inline-flex items-center text-sm font-semibold text-gray-800 truncate dark:text-neutral-200' aria-current='page'>
                            Application
                        </li>
                    </ol>
                    <div className='helpers-product'>
                        <span>For Help? </span><a href="#">Get in Touch</a>
                    </div>
                </div>  
            </div>
         
        </section>
        
        
    )
} 