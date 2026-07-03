import ProductsPage from "./ProductsPage";

function NewPage() {
  return <ProductsPage title="New Products" presetFilters={{ sort: "newest" }} />;
}

export default NewPage;
