/**
 * Next.js 16 Cached Component with PPR Template
 * 
 * Demonstrates Cache Components and Partial Prerendering patterns
 */

import { Suspense } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

// ============================================
// MAIN PAGE - CACHED SHELL
// ============================================

'use cache';
export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Static header - cached */}
      <ProductHeader product={product} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Static product info - cached */}
        <ProductImages images={product.images} />
        
        <div className="space-y-6">
          {/* Static description - cached */}
          <ProductDescription description={product.description} />
          
          {/* Dynamic pricing - NOT cached */}
          <Suspense fallback={<PricingSkeleton />}>
            <LivePricing productId={id} />
          </Suspense>
          
          {/* Dynamic inventory - NOT cached */}
          <Suspense fallback={<StockSkeleton />}>
            <StockStatus productId={id} />
          </Suspense>
          
          {/* Dynamic cart - NOT cached */}
          <Suspense fallback={<div>Loading...</div>}>
            <AddToCartButton productId={id} />
          </Suspense>
        </div>
      </div>
      
      {/* Static specs - cached */}
      <ProductSpecifications specs={product.specs} />
      
      {/* Dynamic reviews - NOT cached */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={id} />
      </Suspense>
      
      {/* Cached recommendations */}
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <RelatedProducts category={product.category} />
      </Suspense>
    </div>
  );
}

// ============================================
// CACHED COMPONENTS
// ============================================

'use cache';
function ProductHeader({ product }: { product: any }) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600">{product.brand}</p>
    </div>
  );
}

'use cache';
function ProductImages({ images }: { images: string[] }) {
  return (
    <div className="space-y-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Product ${index + 1}`}
          className="w-full rounded-lg"
        />
      ))}
    </div>
  );
}

'use cache';
function ProductDescription({ description }: { description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Description</h2>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}

'use cache';
function ProductSpecifications({ specs }: { specs: Record<string, string> }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="border-b pb-2">
            <dt className="font-semibold text-gray-700">{key}</dt>
            <dd className="text-gray-600">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

'use cache';
async function RelatedProducts({ category }: { category: string }) {
  const related = await getRelatedProducts(category);
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// DYNAMIC COMPONENTS (NOT CACHED)
// ============================================

async function LivePricing({ productId }: { productId: string }) {
  // Always fetch fresh pricing data
  const pricing = await getCurrentPrice(productId);
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="text-3xl font-bold mb-2">
        ${pricing.price.toFixed(2)}
      </div>
      {pricing.discount > 0 && (
        <div className="text-red-600">
          Save {pricing.discount}%
        </div>
      )}
    </div>
  );
}

async function StockStatus({ productId }: { productId: string }) {
  // Always fetch fresh inventory
  const stock = await checkInventory(productId);
  
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          stock.available ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span>
        {stock.available
          ? `${stock.quantity} in stock`
          : 'Out of stock'}
      </span>
    </div>
  );
}

async function AddToCartButton({ productId }: { productId: string }) {
  // This component can access user session
  const userId = await getUserId();
  const inCart = await checkIfInCart(userId, productId);
  
  return (
    <button
      className={`w-full py-3 px-6 rounded-lg font-semibold ${
        inCart
          ? 'bg-gray-200 text-gray-800'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {inCart ? 'In Cart' : 'Add to Cart'}
    </button>
  );
}

async function ProductReviews({ productId }: { productId: string }) {
  // Fetch latest reviews (not cached)
  const reviews = await getReviews(productId);
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">
        Customer Reviews ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

// ============================================
// LOADING SKELETONS
// ============================================

function PricingSkeleton() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  );
}

function StockSkeleton() {
  return (
    <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function ProductCard({ product }: { product: any }) {
  return (
    <a href={`/products/${product.id}`} className="block">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-lg mb-2"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
    </a>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="border p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">{review.author}</span>
        <span className="text-yellow-500">
          {'★'.repeat(review.rating)}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}

// ============================================
// DATA FETCHING FUNCTIONS
// ============================================

async function getProduct(id: string) {
  // Cached product data
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 3600, tags: [`product-${id}`] },
  });
  return res.json();
}

async function getCurrentPrice(productId: string) {
  // Always fresh pricing
  const res = await fetch(`https://api.example.com/pricing/${productId}`, {
    cache: 'no-store',
  });
  return res.json();
}

async function checkInventory(productId: string) {
  // Always fresh inventory
  const res = await fetch(`https://api.example.com/inventory/${productId}`, {
    cache: 'no-store',
  });
  return res.json();
}

async function getRelatedProducts(category: string) {
  // Cached recommendations
  const res = await fetch(`https://api.example.com/products?category=${category}`, {
    next: { revalidate: 3600, tags: ['related-products'] },
  });
  return res.json();
}

async function getReviews(productId: string) {
  // Fresh reviews
  const res = await fetch(`https://api.example.com/reviews/${productId}`, {
    cache: 'no-store',
  });
  return res.json();
}

async function getUserId() {
  // Get user from session
  return 'user-id';
}

async function checkIfInCart(userId: string, productId: string) {
  // Check cart status
  return false;
}
