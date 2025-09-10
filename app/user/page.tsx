import Products from "@/components/user/Products";
import { getProducts } from "../actions/userActions/user-products";
import { useState, useEffect } from "react";
import { IProduct } from "@/models/admin/ProductSchema";

export default function Page() {
    const [prod, setProd] = useState<IProduct[] | undefined>([]);
    useEffect(() => {
        async function fetchProd() {
            const t = await getProducts();
            setProd(t);
        }
        fetchProd();
    }, []);
    console.log("products from the page = ", prod);
    if (!prod) {
        return "empty array"
    }

    return (
        <div>
            <Products products={prod} />
        </div>
    );
}
