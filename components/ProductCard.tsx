import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number | string;
  name: string;
  team: string;
  category: string;
  price: number;
  size: string;
  image: string;
  accentColor: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, image, description, team, category, accentColor } = product;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${id}`}>
        <div className="relative h-48 w-full">
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full mb-1 inline-block" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
            {team}
          </span>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{category}</p>
          {description && <p className="text-gray-600 mt-1 text-sm">{description}</p>}
          <p className="text-lg font-bold text-blue-600 mt-2">${price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
}
