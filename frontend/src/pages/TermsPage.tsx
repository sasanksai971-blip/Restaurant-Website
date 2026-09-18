import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TermsModal } from '../components/TermsModal';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <TermsModal isOpen={true} onClose={() => window.history.back()} />
      </main>
      <Footer />
    </div>
  );
};
