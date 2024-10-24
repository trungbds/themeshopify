import { useState, useEffect } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

import { Image } from '@shopify/hydrogen';
import noImage from '~/assets/images/no-image-available.png';

export default function IdealForSeasons({ collections }: { collections: any }) {

    const {collection: { image: collectionImage }} = collections;
    const {
        collection: {
            metafield: {
                references: {
                    nodes
                }
            }
        }
    } = collections;

    return (
        <section className="ideal-seasons">
            <div className="container ideal-seasons__container">
                <div className="ideal-seasons__intro">
                    <h2 className="title-selection"> {collections.collection?.title}</h2>
                    
                </div>
                <div className='ideal-seasons__content'>
                    
                    {nodes.map((node: any, index: number) => (
                        <Image 
                            alt={node.image.altText}  // Cung cấp giá trị cho thuộc tính alt
                            data={node.image}
                            loading="lazy"
                        />
                    ))}
                </div>
                <div className='text-center'>
                    <Link 
                        to="/c/all" 
                        prefetch="intent"
                        className="btn btn-primary link-primary text-center"
                    >
                        <span className='link-hover'>shop now</span>
                    </Link>
                </div>
            </div>

            
        </section>
    );
}
