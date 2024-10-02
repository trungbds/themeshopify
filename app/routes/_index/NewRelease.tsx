import { ProductItemDefault } from '~/components/custom-components/ProductItemDefault';

type NewReleaseProps  = {
    products: any;
    onSelectProduct: (handle: string)=> void;
}

export default function NewRelease({ products,onSelectProduct }: NewReleaseProps) {

    const productsList = products.products?.nodes || [];

    // Tách sản phẩm theo availableForSale
    const availableForSale = productsList.filter( (product:any) => product.availableForSale);
    const notAvailableForSale = productsList.filter((product:any)=> !product.availableForSale);

    // Lấy 12 sản phẩm ưu tiên
    const selectedProducts = [
        ...availableForSale.slice(0, 12), // Lấy tối đa 12 sản phẩm có availableForSale = true
        ...notAvailableForSale.slice(0, Math.max(0, 12 - availableForSale.length)) // Nếu cần thêm, lấy sản phẩm không có availableForSale
    ].slice(0, 12); // Đảm bảo chỉ lấy 12 sản phẩm
    

    return (
        <section className="new-release">
            <div className="container">
                <h2 className="title-selection"> New Release</h2>

                <div className="products-grid">
                    {selectedProducts.map((product: any) => (
                        <ProductItemDefault
                            type ='default'
                            key={product.id}
                            loading='eager'
                            product={product}
                            colorVariants={product.options || []}
                            onSelectProduct={() => onSelectProduct(product.handle)} 
                        />
                    ))}
                </div>
            </div>
            
        </section>
    );
}
