import { Heart, Info, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  minOrder: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, category, price, minOrder, imageUrl } = product;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg p-0">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-3 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 rounded-full shadow-md"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
        <h3 className="mt-2 font-semibold text-foreground">
          {name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
