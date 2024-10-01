import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

// Swiper
import { Navigation,  Pagination as PaginationSwiper  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

export default function BestSellerSelection({ collectionsList }: { collectionsList: any }) {
    const { items } = collectionsList;
    const [activeIndex, setActiveIndex] = useState(0);
    const fetcher = useFetcher(); // Đặt fetcher ở đây

    // Bestseller 
    const getProductsBestSeller = (handle: string) => {
        fetcher.load(`/${handle}/bestseller`);
    };

    // Chuyển item và index vào handleSelect
    const handleSelect = (item: any, index: number) => {
        getProductsBestSeller(item.resource?.handle);
        setActiveIndex(index); // Cập nhật trạng thái khi nhấp vào dựa trên index
    };

    // Lấy tất cả các sản phẩm từ fetcher.data khi thành công
    const products = fetcher.data?.collection?.products.nodes || [];

    // useEffect để gọi handleSelect với item đầu tiên khi component mount
    useEffect(() => {
        if (items.length > 0) {
            handleSelect(items[0], 0); // Gọi handleSelect với item đầu tiên và index 0
        }
    }, [items]); // Chạy khi items thay đổi

    return (
        <section className="bestseller">
            <div className="container">
                <div className="text-center border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px items-baseline bestseller-list">
                        <h2 className="title-selection"> Best Seller</h2>
                        {items.map((item: any, index: number) => (
                            <li key={index}>
                                <a  
                                    onClick={() => handleSelect(item, index)} // Gọi handleSelect với cả item và index
                                    className={`inline-block rounded-t-lg ${
                                        activeIndex === index
                                            ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                            : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                    }`}
                                    aria-current={activeIndex === index ? "page" : undefined}
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="collections-result">
                    {products.length > 0 ? (
                        <>
                        <Swiper
                            key = 'bestseller-swiper'
                            modules={[Navigation, PaginationSwiper]}
                            spaceBetween={8}
                            slidesPerView={5}
                            navigation= {{
                            prevEl: '.carousel-btn-prev.bestseller-swiper__btn-prev',
                            nextEl: '.carousel-btn-next.bestseller-swiper__btn-next',
                            
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
                                        colorVariants={product.options || []}
                                        // onAddToCart={() => handleAddToCart(product.handle)} // Truyền hàm mở modal cho ProductItem
                                    />

                                </SwiperSlide>
                                
                            ))}

                            <div className="carousel-btn-prev bestseller-swiper__btn-prev">
                                <img src={iconchevronleft} alt="" width='24px' height='auto' />
                                </div>
                                <div className="carousel-btn-next bestseller-swiper__btn-next">
                                <img src={iconchevronright} alt=""  width='24px' height='auto'/>
                            </div>

                        </Swiper>
                            
                        </>
                    ) : (
                        <p className='not-found'>No products available.</p>
                    )}
                </div>
            </div>
                
        </section>
    );
}
