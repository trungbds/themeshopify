import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

export default function TodayInterestingItem({ collections }: { collections: any }) {
    const products = collections.collection?.products.nodes || [];
    // const { products } = collections;

    console.log('collectionsTodayInterestingItem',collections);

    return (
        <section className="today-interesting">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 h-full">
                    <div className="col-span-1 sm:col-span-1 md:col-span-1 h-auto md:h-full flex flex-col">
                        <div className="today-interesting__intro">
                            <h2 className="title-selection"> {collections.collection?.title}</h2>
                            <p>{collections.collection?.description}</p>
                        </div>
                    </div>
                    <div className="sm:col-span-3 md:col-span-3">
                        <div className="collections-result">
                            {products.length > 0 ? (
                                <>
                                    <Swiper
                                        modules={[Navigation, PaginationSwiper]}
                                        spaceBetween={8}
                                        slidesPerView={4}
                                        navigation= {{
                                        prevEl: '.carousel-btn-prev',
                                        nextEl: '.carousel-btn-next',
                                        
                                        }}
                                        pagination={{ 
                                            el: '.images-pagination',
                                            type: 'fraction' 
                                        }}
                                    >
                                        {products.map((product: any) => (
                                            <SwiperSlide>
                                                <ProductItemDefault
                                                    type ='dafault'
                                                    key={product.id}
                                                    loading='eager'
                                                    product={product}
                                                    colorVariants={product.options.optionValues || []}
                                                    // onAddToCart={() => handleAddToCart(product.handle)} // Truyền hàm mở modal cho ProductItem
                                                />

                                            </SwiperSlide>
                                            
                                        ))}

                                        <div className="carousel-btn-prev">
                                            <img src={iconchevronleft} alt="" width='24px' height='auto' />
                                            </div>
                                            <div className="carousel-btn-next">
                                            <img src={iconchevronright} alt=""  width='24px' height='auto'/>
                                        </div>

                                    </Swiper>
                                </>
                            ) : (
                                <p>No products available.</p>
                            )}
                        </div>

                    </div>
                </div>

            </div>

        </section>
    );
}
