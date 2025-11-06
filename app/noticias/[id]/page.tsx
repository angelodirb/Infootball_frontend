'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import NewsCard from '@/components/NewsCard'
import { getArticleById, getRelatedArticles } from '@/lib/newsData'
import { Clock, User, Share2, Facebook, Twitter, ArrowLeft } from 'lucide-react'

export default function NoticiaDetallePage() {
  const params = useParams()
  const articleId = parseInt(params.id as string)
  const article = getArticleById(articleId)

  if (!article) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Noticia no encontrada</h1>
          <Link href="/noticias" className="text-green-500 hover:underline">
            Volver a noticias
          </Link>
        </div>
      </main>
    )
  }

  const relatedArticles = getRelatedArticles(articleId, article.category)

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-green-500 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/noticias" className="hover:text-green-500 transition-colors">
            Noticias
          </Link>
          <span>/</span>
          <span className="text-white">{article.category}</span>
        </nav>

        {/* Back Button */}
        <Link 
          href="/noticias"
          className="inline-flex items-center text-green-500 hover:text-green-400 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a noticias
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <article className="lg:col-span-2">
            {/* Category Badge */}
            <span className="inline-block bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
              {article.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-6 border-b border-gray-800">
              <span className="flex items-center">
                <User size={18} className="mr-2" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Clock size={18} className="mr-2" />
                {article.readTime} de lectura
              </span>
              <span>{new Date(article.date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              <p className="text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">El momento clave</h2>
              
              <p className="text-gray-400 mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Análisis táctico</h2>
              
              <p className="text-gray-400 mb-4">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>

              <p className="text-gray-400 mb-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-800">
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm">
                #{article.category}
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm">
                #Fútbol
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm">
                #Deportes
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-800">
              <span className="text-gray-400 font-medium">Compartir:</span>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Facebook size={18} />
                Facebook
              </button>
              <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                <Twitter size={18} />
                Twitter
              </button>
              <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                <Share2 size={18} />
                Más
              </button>
            </div>
          </article>

          {/* Sidebar - Related Articles */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-green-500 w-1 h-8 mr-3"></span>
                Noticias relacionadas
              </h3>
              <div className="space-y-6">
                {relatedArticles.map(relatedArticle => (
                  <NewsCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          </aside>
        </div>
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
