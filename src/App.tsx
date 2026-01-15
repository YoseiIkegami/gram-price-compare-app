import { useState } from 'react';
import Calculator from './pages/Calculator';
import About from './pages/About';

type Tab = 'calculator' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'about' && <About />}
      </main>

      {/* タブバー */}
      <nav className="border-t border-border bg-surface">
        <div className="flex">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 min-h-[56px] transition-opacity ${
              activeTab === 'calculator'
                ? 'text-primary'
                : 'text-muted'
            }`}
            style={{
              opacity: activeTab === 'calculator' ? 1 : 0.6,
            }}
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs font-medium">計算</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-4 min-h-[56px] transition-opacity ${
              activeTab === 'about'
                ? 'text-primary'
                : 'text-muted'
            }`}
            style={{
              opacity: activeTab === 'about' ? 1 : 0.6,
            }}
          >
            <svg
              className="w-7 h-7 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-medium">About</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
