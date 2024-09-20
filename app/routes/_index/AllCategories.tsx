import { useState, useEffect } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

import noImage from '~/assets/images/no-image-available.png';


// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

export default function AllCategories({ collectionsList }: { collectionsList: any }) {
    const { items } = collectionsList;

    return (
        <section className="all-categories">
            <div className="container">
                <div className="flex flex-wrap -mb-px items-baseline all-categories-list">
                    <h2 className="title-selection"> All categories</h2>

                    <Swiper
                        key = 'all-categories-swiper'
                        modules={[Navigation, PaginationSwiper]}
                        spaceBetween={4}
                        slidesPerView='auto'
                        navigation= {{
                        prevEl: '.carousel-btn-prev.allcategories-swiper__btn-prev',
                        nextEl: '.carousel-btn-next.allcategories-swiper__btn-next',
                        
                        }}
                        pagination={{ 
                            el: '.images-pagination',
                            type: 'fraction' 
                        }}
                    >
                        {items.map((item: any, index: number) => (
                            <SwiperSlide>
                                <Link 
                                    to='/'
                                    className={`all-categories__item link-primary`}
                                    aria-current={index ? "page" : undefined}
                                >
                                    <h4 className='link-hover'>{item.title}</h4> 
                                    <img src={item.resource?.image?.url || noImage}  alt="" width='100%' />
                                </Link>

                            </SwiperSlide>
                            
                        ))}

                        <div className="carousel-btn-prev allcategories-swiper__btn-prev">
                            <img src={iconchevronleft} alt="carousel navigation" width='24px' height='auto' />
                            </div>
                            <div className="carousel-btn-next allcategories-swiper__btn-next">
                            <img src={iconchevronright} alt="carousel navigation"  width='24px' height='auto'/>
                        </div>

                    </Swiper>
                
                </div>
            </div>
            
        </section>
    );
}
