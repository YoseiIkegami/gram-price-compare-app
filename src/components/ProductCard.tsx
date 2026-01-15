import { useRef, useState, useEffect, useCallback } from 'react';
import { cn, normalizeNumericInput, normalizeNumericInputText } from '../lib/utils';
import type { Product } from '../lib/calculator';

export interface ProductCardProps {
  label: string;
  price: number;
  weight: number;
  pricePerGram: number;
  isCheapest: boolean;
  isEditing: boolean;
  onPriceChange: (price: number) => void;
  onWeightChange: (weight: number) => void;
  onLabelChange?: (label: string) => void;
  onRemove?: () => void;
  onEditLabel?: () => void;
  showRemove?: boolean;
  priceInputRef?: (el: HTMLInputElement | null) => void;
  weightInputRef?: (el: HTMLInputElement | null) => void;
}

export default function ProductCard({
  label,
  price,
  weight,
  pricePerGram,
  isCheapest,
  isEditing,
  onPriceChange,
  onWeightChange,
  onLabelChange,
  onRemove,
  onEditLabel,
  showRemove = false,
  priceInputRef,
  weightInputRef,
}: ProductCardProps) {
  const labelInputRef = useRef<HTMLInputElement>(null);

  const [priceText, setPriceText] = useState<string>(price === 0 ? '' : price.toString());
  const [weightText, setWeightText] = useState<string>(weight === 0 ? '' : weight.toString());
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isWeightFocused, setIsWeightFocused] = useState(false);

  useEffect(() => {
    if (price === 0) {
      setPriceText('');
    } else {
      const currentPrice = parseFloat(priceText) || 0;
      if (Math.abs(currentPrice - price) > 0.0001) {
        setPriceText(price.toString());
      }
    }
  }, [price]);

  useEffect(() => {
    if (weight === 0) {
      setWeightText('');
    } else {
      const currentWeight = parseFloat(weightText) || 0;
      if (Math.abs(currentWeight - weight) > 0.0001) {
        setWeightText(weight.toString());
      }
    }
  }, [weight]);

  useEffect(() => {
    if (isEditing && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isEditing]);

  const handlePriceSubmit = () => {
    weightInputElementRef.current?.focus();
  };

  const handleWeightSubmit = () => {
    weightInputElementRef.current?.blur();
  };

  const handlePriceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const normalizedText = normalizeNumericInputText(text);
    setPriceText(normalizedText);
    const num = normalizeNumericInput(normalizedText);
    onPriceChange(num);
  };

  const handleWeightTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const normalizedText = normalizeNumericInputText(text);
    setWeightText(normalizedText);
    const num = normalizeNumericInput(normalizedText);
    onWeightChange(num);
  };

  const handlePriceFocus = useCallback(() => {
    setIsPriceFocused(true);
  }, []);

  const handlePriceBlur = useCallback(() => {
    setIsPriceFocused(false);
  }, []);

  const handleWeightFocus = useCallback(() => {
    setIsWeightFocused(true);
  }, []);

  const handleWeightBlur = useCallback(() => {
    setIsWeightFocused(false);
  }, []);

  const priceInputElementRef = useRef<HTMLInputElement | null>(null);
  const weightInputElementRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (priceInputRef) {
      priceInputRef(priceInputElementRef.current);
    }
  }, [priceInputRef]);

  useEffect(() => {
    if (weightInputRef) {
      weightInputRef(weightInputElementRef.current);
    }
  }, [weightInputRef]);

  const handlePriceContainerClick = useCallback(() => {
    priceInputElementRef.current?.focus();
  }, []);

  const handleWeightContainerClick = useCallback(() => {
    weightInputElementRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        'rounded-2xl p-4 border-2 w-full shadow-md',
        isCheapest
          ? 'bg-primary/10 border-primary shadow-primary/20'
          : 'bg-surface border-border shadow-border/10'
      )}
    >
      {/* 商品名ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          {isCheapest && <span className="text-xl">👑</span>}
          {isEditing ? (
            <input
              ref={labelInputRef}
              type="text"
              value={label}
              onChange={(e) => onLabelChange?.(e.target.value)}
              placeholder="名前"
              maxLength={8}
              className="text-sm font-semibold text-foreground px-2 py-1 border border-primary rounded flex-1 outline-none focus:ring-2 focus:ring-primary/20"
              onBlur={() => onEditLabel?.()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditLabel?.();
                }
              }}
            />
          ) : (
            <>
              <span className="text-base font-semibold text-foreground">{label}</span>
              <button
                onClick={() => {
                  onEditLabel?.();
                  setTimeout(() => labelInputRef.current?.focus(), 0);
                }}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="編集"
              >
                <svg
                  className="w-4 h-4 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="削除"
          >
            <svg
              className="w-4.5 h-4.5 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 入力フィールドセクション */}
      <div className="space-y-2">
        {/* 金額入力フィールド */}
        <div
          onClick={handlePriceContainerClick}
          className={cn(
            'flex items-center border-2 rounded-xl bg-background cursor-text transition-colors',
            isPriceFocused ? 'border-primary' : 'border-border'
          )}
        >
          <input
            ref={priceInputElementRef}
            data-price-input={label}
            type="text"
            inputMode="decimal"
            placeholder="金額"
            value={priceText}
            onChange={handlePriceTextChange}
            onFocus={handlePriceFocus}
            onBlur={handlePriceBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePriceSubmit();
              }
            }}
            className="flex-1 text-sm font-medium text-foreground py-2.5 pl-3 pr-2 outline-none bg-transparent"
          />
          <span
            className={cn(
              'text-sm font-medium pr-3',
              isPriceFocused ? 'text-primary' : 'text-muted'
            )}
          >
            円
          </span>
        </div>

        {/* 内容量入力フィールド */}
        <div
          onClick={handleWeightContainerClick}
          className={cn(
            'flex items-center border-2 rounded-xl bg-background cursor-text transition-colors',
            isWeightFocused ? 'border-primary' : 'border-border'
          )}
        >
          <input
            ref={weightInputElementRef}
            data-weight-input={label}
            type="text"
            inputMode="decimal"
            placeholder="内容量"
            value={weightText}
            onChange={handleWeightTextChange}
            onFocus={handleWeightFocus}
            onBlur={handleWeightBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleWeightSubmit();
              }
            }}
            className="flex-1 text-sm font-medium text-foreground py-2.5 pl-3 pr-2 outline-none bg-transparent"
          />
          <span
            className={cn(
              'text-sm font-medium pr-3',
              isWeightFocused ? 'text-primary' : 'text-muted'
            )}
          >
            g
          </span>
        </div>
      </div>

      {/* 計算結果セクション */}
      <div className="border-t-2 border-border pt-3 mt-3">
        <span className="text-xs font-semibold text-muted mb-2 block">単価</span>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-2xl font-bold',
              isCheapest ? 'text-primary' : 'text-foreground'
            )}
          >
            {pricePerGram === 0 ? '—' : pricePerGram.toFixed(2)}
          </span>
          <span className="text-sm text-muted">円/g</span>
        </div>
      </div>
    </div>
  );
}
