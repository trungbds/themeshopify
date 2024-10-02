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
                    <Image
                        alt={collectionImage.altText}  // Cung cấp giá trị cho thuộc tính alt
                        data={collectionImage}
                        loading="lazy"
                    />
                    <Swiper
                        className = 'ideal-seasons-swiper'
                        modules={[Navigation, PaginationSwiper]}
                        spaceBetween={32}
                        slidesPerView= {3}
                        navigation= {{
                        prevEl: '.carousel-btn-prev.ideal-seasons__btn-prev',
                        nextEl: '.carousel-btn-next.ideal-seasons__btn-next',
                        
                        }}
                        pagination={{ 
                            el: '.images-pagination',
                            type: 'fraction' 
                        }}
                    >
                        {nodes.map((node: any, index: number) => (
                            <SwiperSlide>
                                <Image 
                                    alt={node.image.altText}  // Cung cấp giá trị cho thuộc tính alt
                                    data={node.image}
                                    loading="lazy"
                                />
                            </SwiperSlide>
                            
                        ))}

                        <div className="carousel-btn-prev ideal-seasons__btn-prev">
                            <img src={iconchevronleft} alt="carousel navigation" width='24px' height='auto' />
                            </div>
                            <div className="carousel-btn-next ideal-seasons__btn-next">
                            <img src={iconchevronright} alt="carousel navigation"  width='24px' height='auto'/>
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
                        

                    </Swiper>
                </div>
            </div>

            
        </section>
    );
}
