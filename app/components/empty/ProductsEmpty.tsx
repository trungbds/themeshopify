import { Link } from "@remix-run/react";

type ProductsEmpty = {
    title?: string;
}

export default function ProductsEmpty({title} : ProductsEmpty){
    return(
        <section>
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-8 col-start-3 text-center">
                        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                        <div className="mt-4">
                            <h2 className="text-xl">No products found</h2>
                            <p className="mt-2">Please add some products to see them here.</p>
                        </div>
                        <Link
                            className="btn btn-primary mt-4" 
                            to="/"
                        >
                            Return to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}