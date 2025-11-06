'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import NewsCard from '@/components/NewsCard'
import { newsArticles, categories, getFeaturedArticles, getArticlesByCategory } from '@/lib/newsData'

export default function NoticiasPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [visibleArticles, setVisibleArticles] = useState(8)
  
  const featuredArticles = getFeaturedArticles()
  const filteredArticles = getArticlesByCategory(selectedCategory)
  const displayedArticles = filteredArticles.slice(2, visibleArticles + 2) // Skip featured articles

  const loadMore = () => {
    setVisibleArticles(prev => prev + 6)
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Noticias
          </h1>
          <p className="text-gray-400 text-lg">
            Las últimas noticias del mundo del fútbol
          </p>
        </div>

        {/* Featured News Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-green-500 w-1 h-8 mr-3"></span>
            Top News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredArticles.map(article => (
              <NewsCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="sticky top-16 z-40 bg-black py-4 mb-8 -mx-4 px-4">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setVisibleArticles(8)
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {displayedArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleArticles + 2 < filteredArticles.length && (
          <div className="text-center">
            <button
              onClick={loadMore}
              className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/50"
            >
              Cargar más noticias
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">InFootball</h3>
            <p className="text-gray-400 mt-2">Tu fuente de información deportiva</p>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 InFootball. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </main>
  )
}
