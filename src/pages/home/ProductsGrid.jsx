import { Product } from './Product';

export function ProductsGrid({ products, loadCart }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          loadCart={loadCart}
        />
      ))}
    </div>
  );
}