"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OptimizedImage from "@/components/optimized-image"

type Post = {
    title: string
    excerpt: string
    author: string
    date: string
    category: string
    image?: string
}

export default function BlogListClient({ posts }: { posts: Post[] }) {
    const PAGE = 6
    const [visibleCount, setVisibleCount] = useState(Math.min(PAGE, posts.length))

    const handleLoadMore = () => setVisibleCount((v) => Math.min(posts.length, v + PAGE))

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, visibleCount).map((post, index) => (
                    <Card key={index} className="overflow-hidden hover-lift cursor-pointer group">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                            <OptimizedImage
                                src={post.image || "/images/modern-minimalist-design.jpg"}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                fallback="/images/modern-minimalist-design.jpg"
                            />
                        </div>

                        <div className="p-6">
                            <Badge variant="secondary" className="mb-3">
                                {post.category}
                            </Badge>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>

                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    {post.author}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {post.date}
                                </div>
                            </div>

                            <Link href="#" className="block mt-4">
                                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                    Read More
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center">
                {visibleCount < posts.length ? (
                    <Button size="lg" variant="outline" onClick={handleLoadMore}>
                        Load More Articles
                    </Button>
                ) : (
                    <p className="text-sm text-muted-foreground">You're all caught up — no more articles.</p>
                )}
            </div>
        </>
    )
}
