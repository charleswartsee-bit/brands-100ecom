/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Info, 
  X, 
  ShoppingBag, 
  ExternalLink, 
  CheckCircle2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// --- CONFIGURATION ---
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx8qfjTjAStkuDsilfx5rivbyjVbReGSTtBfnEPe6pTj817DKuR4F4gG9BY15_DOJuZ/exec";
const CATEGORY = 'Skincare';

// --- DATA ---
const PRODUCTS = [
  { id: "sk1", name: "Hyaluronic Acid Serum", type: "Serum · 30ml", tags: ["Hydrating", "Anti-aging"], description: "Packed with four types of hyaluronic acid targeting different skin layers for deep, multi-layer hydration. Skin feels moisturized from the inside out.", ingredients: "Water, Propanediol, Glycerin, Sodium Hyaluronate Crosspolymer, Sodium Hyaluronate, Sodium Acetylated Hyaluronate, Hydrolyzed Sodium Hyaluronate, Pentylene Glycol, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin", supplierUrl: "https://app.supliful.com/catalog/hyaluronic-acid-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F2a0fc30962405509ea1a59697a9fc1f15d015705-2048x2048.jpg&w=1280&q=85", price: 12.99 },
  { id: "sk2", name: "PDRN Brightening Serum", type: "Serum · 30ml", tags: ["Brightening", "Rejuvenating"], description: "Advanced brightening serum with PDRN technology to rejuvenate skin, improve tone, and promote a radiant complexion.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/pdrn-brightening-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F6421e6baecda23a06f99c09c7678e0d16ed0388a-2048x2048.jpg&w=1280&q=85", price: 14.99 },
  { id: "sk3", name: "Kojic Acid Turmeric Soap", type: "Bar Soap · 100g", tags: ["Brightening", "Even tone"], description: "Combines Turmeric and Kojic Acid to enhance skin radiance and promote a more even-looking complexion.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/kojic-acid-turmeric-soap", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2Ff3b8a8d2d08755e215ec73623b6897d1646660a3-2048x2048.jpg&w=1280&q=85", price: 8.99 },
  { id: "sk4", name: "Vitamin C Serum", type: "Serum · 30ml", tags: ["Antioxidant", "Brightening"], description: "Powerful antioxidant serum that brightens skin tone, reduces dark spots, and protects against environmental damage.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/vitamin-c-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F02e38ac1697203a7e99baa00631bdb6c68bff6d2-2048x2048.jpg&w=1280&q=85", price: 11.99 },
  { id: "sk5", name: "Raw Shea Butter", type: "Body Butter · 100g", tags: ["Nourishing", "Body care"], description: "Pure unrefined shea butter for deep skin nourishment. Rich in vitamins A and E, ideal for dry skin and body care.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/raw-shea-butter", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F70086213641750968c58050fe58fbd13a9576b31-2048x2048.jpg&w=1280&q=85", price: 9.99 },
  { id: "sk6", name: "Sleep + Collagen Cream", type: "Night Cream · 50ml", tags: ["Anti-aging", "Night repair"], description: "Overnight collagen-boosting cream that works while you sleep to firm, hydrate, and rejuvenate skin.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/sleep-plus-collagen-cream", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F54c2f784d0057a653c5cc10a69af5b4dedd85ee4-2048x2048.jpg&w=1280&q=85", price: 15.99 },
  { id: "sk7", name: "Skin Firming Cream", type: "Cream · 50ml", tags: ["Firming", "Anti-aging"], description: "Targeted firming cream designed to tighten and tone skin, improving elasticity and reducing sagging.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/skin-firming-cream", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2Ff6ff12974d89aad6c931eb1f6a33fd9ad23d8f54-2048x2048.jpg&w=1280&q=85", price: 14.99 },
  { id: "sk8", name: "Retinol Peptide Face Serum", type: "Serum · 30ml", tags: ["Anti-aging", "Repair"], description: "Advanced formula combining retinol with peptides to reduce fine lines, wrinkles, and improve skin texture.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/retinol-peptide-face-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2Ffc754cc450ab832de731436842169d0d21f151e3-2048x2048.jpg&w=1280&q=85", price: 13.99 },
  { id: "sk9", name: "10% Niacinamide Serum", type: "Serum · 30ml", tags: ["Pore control", "Oil balance"], description: "High-concentration niacinamide serum that minimizes pores, controls oil production, and evens skin tone.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/10-percent-niacinamide-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F1d0296f05c94cca01a2b11ddb7f4d2b7546cb13b-2048x2048.jpg&w=1280&q=85", price: 12.99 },
  { id: "sk10", name: "Watermelon Hydration Moisturizer", type: "Moisturizer · 50ml", tags: ["Hydrating", "Lightweight"], description: "Lightweight watermelon-infused moisturizer that locks in hydration for all skin types. Refreshing daily formula.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/watermelon-hydration-moisturizer", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F790b40c2ca2659099c64b7e4c04bc57d82ee1850-2048x2048.jpg&w=1280&q=85", price: 13.99 },
  { id: "sk11", name: "Gentle Cleansing Gel", type: "Cleanser · 120ml", tags: ["Gentle", "Daily"], description: "Powered by Activated Charcoal, this gel gently clears pores and refreshes skin with Vitamin E and Aloe Vera.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/gentle-cleansing-gel", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F9ea9fe7a436104c7b3c9ff7faeeb71eb216a7253-2048x2048.jpg&w=1280&q=85", price: 11.99 },
  { id: "sk12", name: "Dark Spot Serum", type: "Serum · 30ml", tags: ["Dark spots", "Even tone"], description: "Targeted serum formulated to reduce hyperpigmentation and dark spots for a more even, radiant complexion.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/dark-spot-serum-normal-skin", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F5d08fc1b4bfbbb69b022252e5ab14f54dd687316-2048x2048.jpg&w=1280&q=85", price: 13.99 },
  { id: "sk13", name: "Anti-Aging Moisturizer", type: "Moisturizer · 50ml", tags: ["Anti-aging", "Hydrating"], description: "Rich anti-aging moisturizer to reduce signs of aging while providing deep, lasting hydration.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/anti-aging-moisturizer", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F4a9c689ff56ee1311fb28263dcb0106d2d95fb82-2048x2048.jpg&w=1280&q=85", price: 14.99 },
  { id: "sk14", name: "Skin Hydration Cream", type: "Cream · 50ml", tags: ["Hydrating", "All skin types"], description: "A must-have moisturizer that locks in hydration and caters to all skin types for smooth, supple skin.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/skin-hydration-cream", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2Fcc05128df99df86d4a12f7f4f7252d08c15e2fb6-2048x2048.jpg&w=1280&q=85", price: 12.99 },
  { id: "sk15", name: "Tallow Cream — Peaceful Night", type: "Night Cream · 50ml", tags: ["Nourishing", "Night care"], description: "Tallow-based night cream for deep nourishment and skin recovery during sleep. Natural and calming formula.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/tallow-cream-peaceful-night", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F7c21043868a070e80eb974181d7f8fbe2625fe1a-2048x2048.jpg&w=1280&q=85", price: 15.99 },
  { id: "sk16", name: "Vitamin Glow Serum", type: "Serum · 30ml", tags: ["Glow", "Vitality"], description: "A formula designed to rejuvenate and enhance your skin's vitality without irritating the skin. Visible glow after first use.", ingredients: "See supplier page for full ingredient list", supplierUrl: "https://app.supliful.com/catalog/vitamin-glow-serum", image: "https://app.supliful.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fg0smbdlu%2Fproduction%2F1117c43c38115856f4704468cc9baece981226be-2048x2048.jpg&w=1280&q=85", price: 13.99 }
];

interface Product {
  id: string;
  name: string;
  type: string;
  tags: string[];
  description: string;
  ingredients: string;
  supplierUrl: string;
  image: string;
  price: number;
}

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  onInfo: () => void;
  index: number;
}

function ProductCard({ product, isSelected, isDisabled, onToggle, onInfo, index }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!isDisabled ? { y: -4 } : {}}
      className="relative"
    >
      <Card 
        className={cn(
          "glass group relative overflow-hidden transition-all duration-500 cursor-pointer border-border/50",
          isSelected && "border-primary ring-1 ring-primary shadow-[0_0_30px_rgba(124,58,237,0.3)]",
          isDisabled && "opacity-30 grayscale pointer-events-none"
        )}
        onClick={onToggle}
      >
        <CardContent className="p-5">
          {/* Image Area */}
          <div className="aspect-square rounded-xl bg-[#0F0D1A] border border-border/30 mb-5 flex items-center justify-center relative overflow-hidden">
            {product.image && !imageError ? (
              <img 
                src={product.image} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <>
                <ShoppingBag className="w-10 h-10 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl opacity-20 grayscale group-hover:grayscale-0 transition-all">✨</span>
              </>
            )}
            
            <AnimatePresence>
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 z-20"
                >
                  <Check className="text-white w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              size="icon" 
              variant="ghost"
              className="absolute top-3 left-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-primary/40 z-30 w-8 h-8 border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                onInfo();
              }}
            >
              <Info className="w-4 h-4 text-white" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="font-bold text-base leading-tight text-white group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-xs text-secondary-foreground font-medium">{product.type}</p>
            
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.tags.map(tag => (
                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#0F0D1A] border border-border/20 text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={cn(
              "w-full rounded-full h-10 text-xs font-bold transition-all",
              isSelected 
                ? "bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30" 
                : "purple-gradient text-white shadow-lg shadow-primary/20 hover:opacity-90"
            )}
          >
            {isSelected ? "Remove from Brand" : "Add to Brand"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    brandName: '',
    notes: ''
  });

  const isMaxReached = selectedIds.length >= 4;

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (isMaxReached) {
        toast.error("⚠️ Maksimòm 4 pwodui. Retire youn pou ajoute yon lòt.", {
          className: "glass border-primary text-white",
        });
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length !== 4) {
      toast.error("You must select exactly 4 products");
      return;
    }

    setIsSubmitting(true);
    const selectedProducts = PRODUCTS.filter(p => selectedIds.includes(p.id));
    
    const payload = {
      niche: CATEGORY.toLowerCase(),
      products: selectedProducts.map(p => p.name),
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      brand_name: formData.brandName,
      notes: formData.notes
    };

    console.log("PAYLOAD:", JSON.stringify(payload));

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Client: Submission error details:', error);
      toast.error("Soumisyon echwe. Tanpri tcheke si koneksyon ou bon oswa si scénario Make la aktif.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <ConfirmationView selectedIds={selectedIds} formData={formData} />;
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-primary/30">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* Header */}
      <header className="relative pt-10 pb-8 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-primary/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <img 
            src="https://res.cloudinary.com/dd1gxvgji/image/upload/v1775770152/Ajouter_un_titre_19_2_shvdvh.png"
            alt="100% ECOM Logo"
            className="w-12 h-12 rounded-xl object-cover shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            referrerPolicy="no-referrer"
          />
          <span className="text-lg font-bold tracking-tight text-white">100% ECOM</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white"
        >
          Chwazi Pwodui <span className="text-primary">Skincare</span> pou Mak ou a
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-secondary-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Chwazi egzakteman 4 pwodui pou kapab kòmanse mak pèsonèl ou a.
        </motion.p>
      </header>

      {/* Sticky Selection Counter */}
      <div className="sticky top-0 z-50 px-6 py-4">
        <motion.div 
          layout
          className="max-w-xl mx-auto glass rounded-full py-3 px-8 flex items-center justify-between shadow-2xl shadow-black/80"
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((dot) => (
                <motion.div 
                  key={dot}
                  animate={{ 
                    backgroundColor: dot <= selectedIds.length ? 'var(--color-primary)' : 'transparent',
                    borderColor: dot <= selectedIds.length ? 'var(--color-primary)' : 'var(--color-secondary)',
                    boxShadow: dot <= selectedIds.length ? '0 0 10px rgba(124,58,237,0.5)' : 'none'
                  }}
                  className="w-3 h-3 rounded-full border-2"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">
              {selectedIds.length} / 4 selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedIds.length === 4 ? (
              <span className="text-sm font-bold text-[#34D399] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Selection complete
              </span>
            ) : (
              <span className="text-sm font-medium text-secondary-foreground">
                Choose {4 - selectedIds.length} more
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Product Grid */}
      <main className="px-6 mt-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {PRODUCTS.map((product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              isSelected={selectedIds.includes(product.id)}
              isDisabled={isMaxReached && !selectedIds.includes(product.id)}
              onToggle={() => toggleSelection(product.id)}
              onInfo={() => setModalProduct(product)}
              index={index}
            />
          ))}
        </div>

        {/* Submit Section */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-32 max-w-2xl mx-auto"
            >
              <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-white mb-3">Soumèt Pwodui ou Chwazi yo</h2>
                  <p className="text-secondary-foreground">Fill in your details and we'll prepare your custom brand package.</p>
                </div>

                <div className="space-y-4 mb-12">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Selected Products</h3>
                  {selectedIds.map((id, idx) => {
                    const product = PRODUCTS.find(p => p.id === id);
                    return (
                      <motion.div 
                        layout
                        key={id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded-full purple-gradient flex items-center justify-center text-[10px] font-bold text-white">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-white text-sm">{product?.name}</p>
                            <p className="text-[10px] text-secondary-foreground">{product?.type}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleSelection(id)}
                          className="rounded-full hover:bg-destructive/20 hover:text-destructive w-8 h-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-secondary-foreground ml-1">Full Name *</Label>
                      <Input 
                        id="name" 
                        required 
                        placeholder="John Doe"
                        className="rounded-xl bg-[#0F0D1A] border-[#1E1A35] focus:border-primary h-12 px-5 text-white placeholder:text-white/20"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-secondary-foreground ml-1">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="john@example.com"
                        className="rounded-xl bg-[#0F0D1A] border-[#1E1A35] focus:border-primary h-12 px-5 text-white placeholder:text-white/20"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-secondary-foreground ml-1">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+1 (555) 000-0000"
                        className="rounded-xl bg-[#0F0D1A] border-[#1E1A35] focus:border-primary h-12 px-5 text-white placeholder:text-white/20"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-xs font-bold uppercase tracking-wider text-secondary-foreground ml-1">Desired Brand Name</Label>
                      <Input 
                        id="brand" 
                        placeholder="Luxe Glow"
                        className="rounded-xl bg-[#0F0D1A] border-[#1E1A35] focus:border-primary h-12 px-5 text-white placeholder:text-white/20"
                        value={formData.brandName}
                        onChange={e => setFormData({...formData, brandName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-secondary-foreground ml-1">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Tell us about your vision..."
                      className="rounded-2xl bg-[#0F0D1A] border-[#1E1A35] focus:border-primary min-h-[120px] p-5 text-white placeholder:text-white/20"
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.name || !formData.email || selectedIds.length !== 4}
                    className="w-full rounded-full h-14 text-lg font-bold purple-gradient text-white hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : selectedIds.length < 4 ? (
                      <>Select 4 products to continue</>
                    ) : (
                      <>Submit Selection (4 products) <ArrowRight className="ml-2 w-5 h-5" /></>
                    )}
                  </Button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!modalProduct} onOpenChange={() => setModalProduct(null)}>
        <DialogContent className="max-w-[500px] w-[90%] bg-[#08061A] border-primary/20 rounded-[2.5rem] p-0 shadow-[0_0_50px_rgba(124,58,237,0.2)] backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {modalProduct && (
            <>
              <div className="relative h-48 bg-[#12101F] flex items-center justify-center border-b border-primary/10 shrink-0">
                <div className="absolute inset-0 bg-radial-gradient from-primary/20 to-transparent pointer-events-none" />
                <div className="w-full h-full relative z-10">
                  {modalProduct.image ? (
                    <img 
                      src={modalProduct.image} 
                      alt={modalProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 rounded-[1.5rem] bg-[#0F0D1A] border border-primary/20 flex items-center justify-center text-primary/20">
                        <ShoppingBag size={60} strokeWidth={1} />
                        <span className="absolute inset-0 flex items-center justify-center text-5xl opacity-10">✨</span>
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setModalProduct(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/40 backdrop-blur-md hover:bg-primary/40 text-white z-20 border border-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
                <div className="space-y-3">
                  <Badge variant="outline" className="border-primary/40 text-primary rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest bg-primary/5">
                    {modalProduct.type}
                  </Badge>
                  <DialogTitle className="text-2xl md:text-3xl font-extrabold text-white leading-tight block w-full">
                    {modalProduct.name}
                  </DialogTitle>
                  <p className="text-2xl font-extrabold text-primary">
                    ${modalProduct.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Description</h4>
                    <p className="text-secondary-foreground text-base leading-relaxed">{modalProduct.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {modalProduct.ingredients.split(',').map((ingredient, i) => (
                        <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-secondary-foreground font-medium">
                          {ingredient.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button 
                    asChild
                    variant="outline"
                    className="flex-1 rounded-full h-12 border-primary text-primary hover:bg-primary/10 font-bold text-sm"
                  >
                    <a href={modalProduct.supplierUrl} target="_blank" rel="noopener noreferrer">
                      View Full Details on Supplier Site →
                    </a>
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedIds.includes(modalProduct.id)) {
                        toggleSelection(modalProduct.id);
                      }
                      setModalProduct(null);
                    }}
                    className={cn(
                      "flex-1 rounded-full h-12 font-bold text-white shadow-lg text-sm",
                      selectedIds.includes(modalProduct.id) 
                        ? "bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30" 
                        : "purple-gradient hover:opacity-90 shadow-primary/20"
                    )}
                  >
                    {selectedIds.includes(modalProduct.id) ? "Remove from Brand" : "Close"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConfirmationView({ selectedIds, formData }: { selectedIds: string[], formData: any }) {
  const selectedProducts = PRODUCTS.filter(p => selectedIds.includes(p.id));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-primary/20 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full glass rounded-[3.5rem] p-10 md:p-20 text-center shadow-2xl relative z-10"
      >
        <div className="w-24 h-24 rounded-full bg-[#34D399]/10 flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(52,211,153,0.2)] border border-[#34D399]/20">
          <CheckCircle2 className="w-12 h-12 text-[#34D399]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Pwodui ou yo soumèt!</h1>
        <p className="text-secondary-foreground text-lg md:text-xl mb-12 leading-relaxed">
          Mèsi <span className="text-white font-bold">{formData.name.split(' ')[0]}</span>. Nou resevwa seleksyon ou an pou <span className="text-primary font-bold">{formData.brandName || "mak koutim ou"}</span>.
        </p>

        <div className="bg-white/5 rounded-[2rem] p-8 text-left border border-white/5 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">Seleksyon ou</h3>
          <div className="space-y-5">
            {selectedProducts.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-5">
                <span className="w-8 h-8 rounded-full purple-gradient flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-bold text-white">{p.name}</p>
                  <p className="text-xs text-secondary-foreground">{p.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="rounded-full px-10 h-14 border-primary text-primary hover:bg-primary/10 font-bold text-lg"
        >
          Retounen nan Paj Akèy
        </Button>
      </motion.div>
    </div>
  );
}
