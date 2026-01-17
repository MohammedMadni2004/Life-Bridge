import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Layers, Shirt, Gem, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = {
  shirt: Shirt,
  gem: Gem,
  "shopping-bag": ShoppingBag,
  home: Home,
};

interface NavigationDropdownProps {
  title: string;
  icon?: string;
  categories: Array<{
    label: string;
    href: string;
    subcategories?: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

export function NavigationDropdown({ title, icon, categories }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const IconComponent = icon && iconMap[icon as keyof typeof iconMap];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  const handleCategoryMouseEnter = (categoryLabel: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHoveredCategory(categoryLabel);
  };

  const handleCategoryMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  const handleSubmenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSubmenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button 
        variant="ghost" 
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 h-auto"
      >
        {IconComponent && <IconComponent className="h-4 w-4" />}
        <span>{title}</span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="py-2">
            {categories.map((category, index) => (
              <div key={category.label} className="relative">
                {category.subcategories && category.subcategories.length > 0 ? (
                  <div
                    className="relative"
                    onMouseEnter={() => handleCategoryMouseEnter(category.label)}
                    onMouseLeave={handleCategoryMouseLeave}
                  >
                    <div className="flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer">
                      <a href={category.href} className="flex-1 hover:text-blue-600">
                        {category.label}
                      </a>
                      <ChevronRight className="h-3 w-3 text-gray-400 ml-2" />
                    </div>
                    
                    {/* Submenu */}
                    {hoveredCategory === category.label && (
                      <div 
                        className="absolute left-full top-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 ml-1"
                        onMouseEnter={handleSubmenuMouseEnter}
                        onMouseLeave={handleSubmenuMouseLeave}
                      >
                        <div className="p-2">
                          <a
                            href={category.href}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md mb-2 transition-colors"
                          >
                            <Layers className="h-3 w-3 mr-2" />
                            View All {category.label}
                          </a>
                          <div className="border-t border-gray-100 mb-2"></div>
                          {category.subcategories.map((subcategory) => (
                            <a
                              key={subcategory.label}
                              href={subcategory.href}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                            >
                              {subcategory.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={category.href}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    {category.label}
                  </a>
                )}
                {index < categories.length - 1 && (
                  <div className="border-t border-gray-100 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}