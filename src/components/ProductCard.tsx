
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProductCardProps = {
  product: Product;
  index: number;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showAddAnimation, setShowAddAnimation] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show animation
    setShowAddAnimation(true);
    
    // Use shorter animation for better performance
    setTimeout(() => {
      addToCart(product, 1, 1);
      setShowAddAnimation(false);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }, 600);
  };

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Format price display based on product category
  const getPriceDisplay = () => {
    if (product.category === "editing") {
      return `₹${product.price} (full package)`;
    }
    return `₹${product.price}/day`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }} // Reduced delay for faster loading
      className="group relative"
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="relative bg-card rounded-lg overflow-hidden border border-border h-full transition-all duration-300 hover:border-primary/50 hover:shadow-md group-hover:translate-y-[-5px]">
          <div className="aspect-[4/3] overflow-hidden bg-black relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              loading="lazy"
              onError={() => {
                // Fallback for failed images
                console.error(`Failed to load image for ${product.name}`);
                setImageLoaded(true); // Stop showing loader even if image fails
              }}
            />
            
            {/* Category badge */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <span className="bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-white">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </div>
            
            {/* Price badge */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3">
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                {getPriceDisplay()}
              </span>
            </div>
            
            {/* Quick actions overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 md:gap-3 transition-all duration-300">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                asChild
              >
                <Link to={`/products/${product.id}`}>
                  <Eye className="h-3 w-3 md:h-4 md:w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="p-3 md:p-4">
            <h3 className="font-medium text-base md:text-lg mb-1 transition-colors group-hover:text-primary line-clamp-1">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">
              {product.description}
            </p>
            
            {/* Availability indicator */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">
                <span className={`inline-block h-2 w-2 rounded-full mr-1 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-primary text-primary hover:bg-primary hover:text-white py-1 h-7"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Simplified Add to Cart Animation for better performance */}
      <AnimatePresence>
        {showAddAnimation && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1.2,
              z: 50 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: -50
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
          >
            <div className="bg-primary text-white rounded-full p-2 md:p-3 shadow-lg relative">
              <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
