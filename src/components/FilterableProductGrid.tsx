import React, { useState } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  minOrder: number;
  imageUrl: string;
}

interface Category {
  name: string;
  count: string;
  active: boolean;
}

interface FilterableProductGridProps {
  allProducts: Product[];
  categories: Category[];
  gridClassName?: string;
  colorScheme?: string;
}

export const FilterableProductGrid: React.FC<FilterableProductGridProps> = ({
  allProducts,
  categories,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
  colorScheme = "orange"
}) => {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleFilterChange = (products: Product[], category: string) => {
    setFilteredProducts(products);
    setActiveCategory(category);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100/50 mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <CategoryFilter
              products={allProducts}
              categories={categories}
              onFilterChange={handleFilterChange}
              colorScheme={colorScheme}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={gridClassName}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
