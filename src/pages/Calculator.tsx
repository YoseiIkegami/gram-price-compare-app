import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { calculatePricePerGram, compareProducts, type Product } from '../lib/calculator';
import ProductCard from '../components/ProductCard';

const INITIAL_PRODUCTS: Product[] = [
  {
    label: '商品1',
    index: 1,
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
  {
    label: '商品2',
    index: 2,
    price: 0,
    weight: 0,
    pricePerGram: 0,
  },
];

const PRICE_COMPARISON_TOLERANCE = 0.01;
const INPUT_FOCUS_DELAY_MS = 100;

export default function Calculator() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const priceInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const weightInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  useEffect(() => {
    products.forEach((product) => {
      if (!priceInputRefs.current[product.index]) {
        priceInputRefs.current[product.index] = null;
      }
      if (!weightInputRefs.current[product.index]) {
        weightInputRefs.current[product.index] = null;
      }
    });
  }, [products]);

  const handlePriceChange = useCallback((productIndex: number, price: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((p) => p.index === productIndex);
      if (index !== -1) {
        updated[index].price = price;
        updated[index].pricePerGram = calculatePricePerGram(price, updated[index].weight);
      }
      return updated;
    });
  }, []);

  const handleWeightChange = useCallback((productIndex: number, weight: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((p) => p.index === productIndex);
      if (index !== -1) {
        updated[index].weight = weight;
        updated[index].pricePerGram = calculatePricePerGram(updated[index].price, weight);
      }
      return updated;
    });
  }, []);

  const handleLabelChange = useCallback((productIndex: number, label: string) => {
    setProducts((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((p) => p.index === productIndex);
      if (index !== -1) {
        updated[index].label = label;
      }
      return updated;
    });
  }, []);

  const handleAddProduct = useCallback(() => {
    if (isAddingProduct || products.length >= 4) return;

    setIsAddingProduct(true);

    setProducts((prev) => {
      const maxIndex = prev.reduce((max, product) => (product.index > max ? product.index : max), 0);
      const nextIndex = maxIndex + 1;

      const newProduct: Product = {
        label: `商品${nextIndex}`,
        index: nextIndex,
        price: 0,
        weight: 0,
        pricePerGram: 0,
      };

      setTimeout(() => {
        const inputRef = priceInputRefs.current[nextIndex];
        if (inputRef) {
          inputRef.focus();
        }
        setIsAddingProduct(false);
      }, INPUT_FOCUS_DELAY_MS);

      return [...prev, newProduct];
    });
  }, [isAddingProduct, products.length]);

  const handleRemoveProduct = useCallback((index: number) => {
    setProducts((prev) => {
      const removedIndex = prev.findIndex((p) => p.index === index);
      if (removedIndex !== -1) {
        delete priceInputRefs.current[index];
        delete weightInputRefs.current[index];
        return prev.filter((_, i) => i !== removedIndex);
      }
      return prev;
    });
  }, []);

  const handleClear = useCallback(() => {
    setProducts((prev) => {
      prev.forEach((product) => {
        delete priceInputRefs.current[product.index];
        delete weightInputRefs.current[product.index];
      });
      return INITIAL_PRODUCTS.map((p) => ({ ...p }));
    });
    setEditingLabel(null);
  }, []);

  const comparison = useMemo(
    () => compareProducts(products, PRICE_COMPARISON_TOLERANCE),
    [products]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="flex items-center justify-between bg-background border-b border-border px-6 py-4">
        <button
          onClick={handleClear}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-error/10 border border-error rounded-lg transition-opacity hover:opacity-80 active:opacity-70"
        >
          <svg className="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-error">クリア</span>
        </button>

        {products.length < 4 && (
          <button
            onClick={handleAddProduct}
            disabled={isAddingProduct}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-surface border border-border rounded-lg transition-opacity hover:opacity-80 active:opacity-70 disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-semibold text-primary">追加</span>
          </button>
        )}
      </header>

      {/* コンテンツ */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <div className="mb-4 space-y-4 md:space-y-6">
          {products.map((item) => (
            <ProductCard
              key={item.index}
              label={item.label}
              price={item.price}
              weight={item.weight}
              pricePerGram={item.pricePerGram}
              isCheapest={comparison.cheapestIndexes.includes(item.index)}
              isEditing={editingLabel === item.index}
              onPriceChange={(price) => handlePriceChange(item.index, price)}
              onWeightChange={(weight) => handleWeightChange(item.index, weight)}
              onLabelChange={(label) => handleLabelChange(item.index, label)}
              onRemove={() => handleRemoveProduct(item.index)}
              onEditLabel={() => {
                setEditingLabel(editingLabel === item.index ? null : item.index);
              }}
              showRemove={products.length > 2}
              priceInputRef={(el) => {
                priceInputRefs.current[item.index] = el;
              }}
              weightInputRef={(el) => {
                weightInputRefs.current[item.index] = el;
              }}
            />
          ))}
        </div>

        {/* 最安商品サマリー */}
        {comparison.cheapestIndexes.length > 0 && (() => {
          const cheapestProducts = products.filter((p) =>
            comparison.cheapestIndexes.includes(p.index)
          );
          const cheapestPricePerGram = cheapestProducts[0]?.pricePerGram || 0;
          const cheapestLabels = cheapestProducts.map((p) => p.label).join('・');

          return (
            <div className="rounded-2xl p-6 md:p-8 mb-4 bg-surface border-2 border-primary shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl md:text-4xl">👑</span>
                <span className="text-base md:text-lg font-semibold text-muted">最安商品</span>
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl md:text-4xl font-bold text-primary">{cheapestLabels}</span>
                <span className="text-3xl md:text-5xl font-semibold text-primary">
                  {cheapestPricePerGram.toFixed(2)}
                </span>
                <span className="text-lg md:text-xl text-primary">円/g</span>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
