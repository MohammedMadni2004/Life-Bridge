import {
  Briefcase,
  ChevronDown,
  Gem,
  Heart,
  Home,
  Menu,
  Search,
  Shirt,
  ShoppingBag,
  Store,
  User
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const iconMap = {
  shirt: Shirt,
  gem: Gem,
  "shopping-bag": ShoppingBag,
  home: Home,
};

interface MobileNavProps {
  clothingItems: {
    title: string;
    icon: string;
    categories: Array<{
      label: string;
      href: string;
      subcategories?: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
  accessoriesItems: {
    title: string;
    icon: string;
    categories: Array<{
      label: string;
      href: string;
      subcategories?: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
  bagsFootwearItems: {
    title: string;
    icon: string;
    categories: Array<{
      label: string;
      href: string;
      subcategories?: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
  homeKitchenItems: {
    title: string;
    icon: string;
    categories: Array<{
      label: string;
      href: string;
      subcategories?: Array<{
        label: string;
        href: string;
      }>;
    }>;
  };
}

interface DropdownState {
  [key: string]: boolean;
}

export function MobileNav({
  clothingItems,
  accessoriesItems,
  bagsFootwearItems,
  homeKitchenItems,
}: MobileNavProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdownState, setDropdownState] = useState<DropdownState>({});

  const toggleDropdown = (key: string) => {
    setDropdownState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const MobileDropdown = ({ 
    title, 
    icon, 
    categories, 
    dropdownKey 
  }: { 
    title: string; 
    icon: string; 
    categories: Array<{ 
      label: string; 
      href: string; 
      subcategories?: Array<{ label: string; href: string }>;
    }>; 
    dropdownKey: string;
  }) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap];
    
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-between p-2 h-auto"
          onClick={() => toggleDropdown(dropdownKey)}
        >
          <div className="flex items-center space-x-3">
            {IconComponent && <IconComponent className="h-4 w-4 text-gray-600" />}
            <span className="font-medium text-left">{title}</span>
          </div>
          <ChevronDown className={`h-3 w-3 text-gray-600 transition-transform duration-200 ${
            dropdownState[dropdownKey] ? 'rotate-180' : ''
          }`} />
        </Button>
      {dropdownState[dropdownKey] && (
        <div className="pl-8 space-y-2">
          {categories.map((category) => (
            <div key={category.label} className="space-y-1">
              <a
                href={category.href}
                className="block px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              >
                {category.label}
              </a>
              {category.subcategories && (
                <div className="pl-4 space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <a
                      key={subcategory.label}
                      href={subcategory.href}
                      className="block px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      {subcategory.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center space-x-2 text-left">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopVerse
              </span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for ShopVerse
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Account & Wishlist */}
            <div className="space-y-1 mb-6">
              <a
                href="#"
                className="flex items-center space-x-3 px-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Account</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Heart className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Wishlist</span>
              </a>
            </div>

            <Separator className="my-4" />

            {/* Navigation Categories */}
            <div className="space-y-2">
              <MobileDropdown
                title={clothingItems.title}
                icon={clothingItems.icon}
                categories={clothingItems.categories}
                dropdownKey="clothing"
              />
              
              <MobileDropdown
                title={accessoriesItems.title}
                icon={accessoriesItems.icon}
                categories={accessoriesItems.categories}
                dropdownKey="accessories"
              />
              
              <MobileDropdown
                title={bagsFootwearItems.title}
                icon={bagsFootwearItems.icon}
                categories={bagsFootwearItems.categories}
                dropdownKey="bagsFootwear"
              />
              
              <MobileDropdown
                title={homeKitchenItems.title}
                icon={homeKitchenItems.icon}
                categories={homeKitchenItems.categories}
                dropdownKey="homeKitchen"
              />

              <a
                href="/corporate-gifting"
                className="flex items-center space-x-3 px-2 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Briefcase className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Corporate Gifting</span>
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setShowMobileSearch(!showMobileSearch)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Toggle search</span>
      </Button>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
          <div className="relative w-full">
            <Input
              type="text"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Search for products, categories, or brands..."
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
