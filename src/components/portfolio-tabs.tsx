"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Dummy Data
const ITEMS_PER_PAGE = 6;

type Category = "environments" | "structures" | "interiors" | "models";

type PortfolioItem = {
  id: number;
  title: string;
  desc: string;
  image: string;
  category: Category;
};

export function PortfolioTabs({ items = [] }: { items?: any[] }) {
  const [activeTab, setActiveTab] = useState<Category>("environments");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items by category
  const filteredItems = items.filter((item) => item.category === activeTab);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (tab: Category) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-neutral-900/50 border border-neutral-800 p-1.5 rounded-full overflow-x-auto max-w-full">
          {[
            { id: "environments", label: "Environments" },
            { id: "structures", label: "Structures" },
            { id: "interiors", label: "Interiors" },
            { id: "models", label: "Models" }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id as Category)}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                activeTab === category.id ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === category.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary-600 rounded-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
      >
        <AnimatePresence mode="popLayout">
          {currentItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-12 text-center text-neutral-500"
            >
              No projects in this category yet.
            </motion.div>
          ) : (
            currentItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-colors"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-neutral-950 cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary-600 p-3 rounded-full transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100">
                      <ZoomIn className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-3 leading-tight">{item.title}</h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                  currentPage === idx + 1 
                    ? "bg-primary-600 text-white border border-primary-500" 
                    : "border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
