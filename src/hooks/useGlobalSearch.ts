import { useState, useCallback } from 'react';
import { Lead } from '../types/lead';
// import { Product } from '../types/product'; // Uncomment if you have products

// Example: You would import your real data sources here
// import { useLeads } from '../context/LeadContext';
// import { useProducts } from '../context/ProductContext';

export interface SearchResult {
  id: string;
  type: 'lead' | 'product';
  label: string;
  description?: string;
  highlight: string[];
  // Add more fields as needed for navigation
}

export function useGlobalSearch() {
  // Replace with your real data sources
  // const { leads } = useLeads();
  // const { products } = useProducts();
  const leads: Lead[] = [];
  // const products: Product[] = [];

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((query: string) => {
    setLoading(true);
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    // Search leads
    const leadResults = leads
      .filter(lead =>
        lead.name.toLowerCase().includes(q) ||
        lead.title.toLowerCase().includes(q) ||
        lead.tags.some(tag => tag.toLowerCase().includes(q)) ||
        lead.enrichment?.company?.name?.toLowerCase().includes(q)
      )
      .map(lead => ({
        id: lead.id,
        type: 'lead' as const,
        label: lead.name,
        description: lead.title + ' @ ' + (lead.enrichment?.company?.name || ''),
        highlight: [q],
      }));
    // Search products (if you have them)
    // const productResults = products.filter(...)
    // setResults([...leadResults, ...productResults]);
    setResults(leadResults);
    setLoading(false);
  }, [leads]);

  return { results, search, loading };
} 