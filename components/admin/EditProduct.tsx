import { editProduct } from "@/app/actions/productActions/admin-product";

export default function EditProduct({ params }: { params: { id: string } }) {
  return (
    <form
      action={async (formData) => {
        "use server";

        const updates = {
          name: formData.get("name") as string,
          price: Number(formData.get("price")),
          stock: Number(formData.get("stock")),
          "variants.0.price": Number(formData.get("variant0price")),
          "variants.0.stock": Number(formData.get("variant0stock")),
        };

        await editProduct({ id: params.id, updates });
      }}
      className="flex flex-col gap-4 max-w-md"
    >
      <label>
        Name:
        <input name="name" type="text" className="border p-2 w-full" />
      </label>
      <label>
        Price:
        <input name="price" type="number" className="border p-2 w-full" />
      </label>
      <label>
        Stock:
        <input name="stock" type="number" className="border p-2 w-full" />
      </label>
      <fieldset className="border p-3">
        <legend>Variant 0</legend>
        <label>
          Price:
          <input name="variant0price" type="number" className="border p-2 w-full" />
        </label>
        <label>
          Stock:
          <input name="variant0stock" type="number" className="border p-2 w-full" />
        </label>
      </fieldset>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
