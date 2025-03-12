
import React, { useState, useEffect } from 'react';
import HTMLConverter from '@/components/HTMLConverter';

const Index = () => {
  console.log('Index page rendering');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    console.log('Index page mounted');
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <h1 className="text-xl font-semibold tracking-tight">CleanStyle Converter</h1>
            <p className="text-sm text-muted-foreground">Strip inline styles, apply beautiful typography</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 sm:px-6 py-12 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="space-y-2">
              <div className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-primary/5 text-primary-foreground/70">
                Effortless HTML Styling
              </div>
              <h2 className="text-3xl font-semibold tracking-tight">Clean, Consistent Product Descriptions</h2>
              <p className="text-muted-foreground max-w-3xl">
                Paste your HTML code below to strip all inline styling and apply a clean, modern design with Montserrat headings and Inter body text. Product specifications will be automatically converted to responsive tables.
              </p>
            </div>
          </div>

          <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {mounted && <HTMLConverter />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              CleanStyle Converter — Streamlining product descriptions with clean typography
            </p>
            <div className="text-sm text-muted-foreground">
              Designed with precision and simplicity
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
