import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PricingCalculator from '@/components/PricingCalculator';

interface ProductPageProps {
  params: { slug: string; locale: string };
}

async function getProductData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, {
    next: { revalidate: 60 }, // ISR Strategy
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductData(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Visuals & Certifications */}
        <div className="space-y-6">
          <div className="relative h-96 w-full rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={product.media?.[0] || '/placeholder-export.png'}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Export Certifications Verified
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert: any, idx: number) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  ✓ {cert.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Meta & Interactive B2B Pricing Engine */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
              HS Code: {product.hsCode}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Origin Port: {product.shippingSpecs.portOfOrigin}, India</p>
          </div>

          {/* Tiered FOB Pricing Table */}
          <div className="border rounded-md overflow-hidden border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity Range</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">FOB Price (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {product.priceTiers.map((tier: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-gray-900">
                      {tier.minQuantity} {tier.maxQuantity ? `- ${tier.maxQuantity}` : '+'} {product.minOrderQuantity.unit}
                    </td>
                    <td className="px-4 py-2 font-semibold text-emerald-600">${tier.unitPriceUSD.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Client-Side Price Calculator & RFQ Trigger */}
          <PricingCalculator 
            priceTiers={product.priceTiers} 
            moq={product.minOrderQuantity.value} 
            unit={product.minOrderQuantity.unit}
            productId={product._id}
            incoterms={product.availableIncoterms}
          />
        </div>
      </div>
    </div>
  );
}