import { useState, useEffect } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

// Swiper
import { Navigation,  Pagination as PaginationSwiper, Mousewheel, Keyboard  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import iconchevronright from '~/assets/fonts/icons/icon-chevron-right.svg';
import iconchevronleft from '~/assets/fonts/icons/icon-chevron-left.svg';

type BestSellerSelectionProps = {
    collectionsList: any;
    onSelectProduct: (handle: string)=> void;
}

export default function BestSellerSelection({ collectionsList, onSelectProduct }: BestSellerSelectionProps) {
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
    const collectionhandle = fetcher.data?.collection?.handle || '';
    const collectiontitle = fetcher.data?.collection?.title || '';

    // useEffect để gọi handleSelect với item đầu tiên khi component mount
    useEffect(() => {
        if (items.length > 0) {
            handleSelect(items[0], 0); // Gọi handleSelect với item đầu tiên và index 0
        }
    }, [items]); // Chạy khi items thay đổi

    return (
        <section className="bestseller">
            <div className="container">
                <div className="bestseller-detail text-center border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <h2 className="title-selection"> Best Seller</h2>
                    <ul className="flex flex-wrap -mb-px items-baseline bestseller-list">
                        {items.map((item: any, index: number) => (
                            <li key={index} 
                                className={`${
                                    activeIndex === index
                                        ? "isCurrent"
                                        : ""
                                }`}
                            >
                                <a  
                                    onClick={() => handleSelect(item, index)} // Gọi handleSelect với cả item và index
                                    className={`inline-flex rounded-t-lg`}
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
                            modules={[Navigation, PaginationSwiper, Mousewheel, Keyboard]}
                            spaceBetween={8}
                            slidesPerView='auto'
                            navigation= {{
                            prevEl: '.carousel-btn-prev.bestseller-swiper__btn-prev',
                            nextEl: '.carousel-btn-next.bestseller-swiper__btn-next',
                            
                            }}
                            pagination={{ 
                                el: '.images-pagination',
                                type: 'fraction' 
                            }}

                            breakpoints={{
                                768: { // Trên 768px, không sử dụng cssMode
                                  cssMode: false,
                                },
                                0: { // Dưới 768px, bật cssMode
                                    cssMode: true,
                                    mousewheel: false, // Tắt cuộn bằng bánh xe chuột trên mobile
                                }
                            }}

                            >
                            {products.map((product: any) => (
                                <SwiperSlide>
                                    <ProductItemDefault
                                        type ='default'
                                        key={product.id}
                                        loading='eager'
                                        product={product}
                                        colorVariants={product.options}
                                        onSelectProduct={() => onSelectProduct(product.handle)} // Truyền hàm mở modal cho ProductItem
                                    />
                                </SwiperSlide>
                            ))}

                                <SwiperSlide>
                                    <div className='product-item nav-collection'>
                                        <Link prefetch="intent" 
                                            to={`/c/${collectionhandle}`}>
                                                <span>
                                                    Show more products of 
                                                    <br />
                                                    <strong>{collectiontitle}</strong>
                                                </span>
                                        </Link>
                                    </div>

                                </SwiperSlide>

                            <div className="carousel-btn-prev bestseller-swiper__btn-prev">
                                <img src={iconchevronleft} alt="" width='24px' height='auto' />
                                </div>
                                <div className="carousel-btn-next bestseller-swiper__btn-next">
                                <img src={iconchevronright} alt=""  width='24px' height='auto'/>
                            </div>

                        </Swiper>
                            
                        </>
                    ) : (
                        <p className='not-found'>Currently this collection does not have any products</p>
                    )}
                </div>
            </div>
                
        </section>
    );
}
