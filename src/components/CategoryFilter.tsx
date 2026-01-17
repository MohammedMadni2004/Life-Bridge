import React, { useEffect, useState } from 'react';

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

interface CategoryFilterProps {
  products: Product[];
  categories: Category[];
  onFilterChange: (filteredProducts: Product[], activeCategory: string) => void;
  colorScheme?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  products,
  categories,
  onFilterChange,
  colorScheme = "orange",
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [categoryList, setCategoryList] = useState(categories);

  useEffect(() => {
    filterProducts(activeCategory);
  }, [activeCategory, products]);

  const filterProducts = (categoryName: string) => {
    let filteredProducts = products;
    
    if (categoryName !== 'All') {
      filteredProducts = products.filter(product => product.category === categoryName);
    }
    
    onFilterChange(filteredProducts, categoryName);
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    
    // Update category active states
    const updatedCategories = categoryList.map(cat => ({
      ...cat,
      active: cat.name === categoryName
    }));
    setCategoryList(updatedCategories);
    
    filterProducts(categoryName);
  };

  const getActiveButtonClasses = () => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200";
    const colorMappings = {
      orange: "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-600/30",
      blue: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30",
      pink: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30",
      emerald: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30",
    };
    return colorMappings[colorScheme as keyof typeof colorMappings] || colorMappings.orange;
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categoryList.map((category) => (
        <button
          key={category.name}
          onClick={() => handleCategoryClick(category.name)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            category.active
              ? getActiveButtonClasses()
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-75">
            ({category.count})
          </span>
        </button>
      ))}
    </div>
  );
};
