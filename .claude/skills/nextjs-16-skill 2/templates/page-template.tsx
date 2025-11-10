/**
 * Next.js 16 Page Template
 * 
 * Basic page component with async params and metadata
 */

import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

// Or dynamic metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch data for metadata
  const data = await getData(slug);
  
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
    },
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  // Fetch all possible params
  const items = await getItems();
  
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  
  // Fetch data
  const data = await getData(slug);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-600 mb-8">{data.description}</p>
      
      {/* Your content here */}
      <div className="prose max-w-none">
        {/* Content */}
      </div>
    </main>
  );
}

// Helper functions
async function getData(slug: string) {
  // Implement your data fetching
  const res = await fetch(`https://api.example.com/data/${slug}`, {
    next: { revalidate: 3600, tags: ['data'] },
  });
  return res.json();
}

async function getItems() {
  const res = await fetch('https://api.example.com/items');
  return res.json();
}
