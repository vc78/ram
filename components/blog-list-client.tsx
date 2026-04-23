"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OptimizedImage from "@/components/optimized-image"

type Post = {
    id: number
    title: string
    excerpt: string
    author: string
    date: string
    category: string
    image?: string
    readingTime?: string
}


export default function BlogListClient({ posts }: { posts: Post[] }) {
    const PAGE = 6
    const [visibleCount, setVisibleCount] = useState(Math.min(PAGE, posts.length))
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    
    const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))]

    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === "All" || post.category === activeCategory
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleLoadMore = () => setVisibleCount((v) => Math.min(filteredPosts.length, v + PAGE))


    return (
        <div className="space-y-12">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map(cat => (
                        <Button 
                           key={cat} 
                           variant={activeCategory === cat ? "default" : "outline"}
                           onClick={() => setActiveCategory(cat)}
                           className={`h-10 px-6 rounded-full text-xs font-bold transition-all ${
                               activeCategory === cat ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'hover:border-primary/50'
                           }`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-2xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredPosts.slice(0, visibleCount).map((post) => (
                    <Card key={post.id} className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full bg-card rounded-[2rem]">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img
                                src={post.image || "/images/modern-villa-project.jpg"}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[9px] uppercase tracking-wider px-3 py-1">
                                {post.category}
                            </Badge>
                            {post.readingTime && (
                                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-[10px] font-bold">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {post.readingTime} read
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex flex-col flex-1 space-y-4">
                            <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="pt-6 mt-auto border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold border border-primary/20">
                                        {post.author.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">{post.author}</p>
                                        <p className="text-[10px] text-muted-foreground">{post.date}</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-20 bg-muted/30 rounded-[3rem] border border-dashed border-border">
                    <p className="text-lg font-bold text-muted-foreground">No articles found matching your criteria.</p>
                    <Button variant="link" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="mt-2">Clear all filters</Button>
                </div>
            )}

            <div className="mt-20 text-center">
                {visibleCount < filteredPosts.length ? (
                    <Button 
                       size="lg" 
                       onClick={handleLoadMore}
                       className="h-14 px-10 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Load More Articles
                    </Button>
                ) : filteredPosts.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-1 bg-primary/20 rounded-full mb-2" />
                       <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">End of the line</p>
                    </div>
                )}
            </div>
        </div>
    )

}
