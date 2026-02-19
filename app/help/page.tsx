"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, ChevronDown, Book, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create my first project?",
          a: "Click 'New Project' from your dashboard, select your project type, and follow the step-by-step wizard to input your requirements. Our AI will generate comprehensive designs based on your inputs.",
        },
        {
          q: "What information do I need to provide?",
          a: "You'll need basic details like project type, size, budget range, location, and any specific requirements or preferences. The more details you provide, the better our AI can tailor the designs.",
        },
      ],
    },
    {
      category: "Design & Planning",
      questions: [
        {
          q: "Can I modify the AI-generated designs?",
          a: "Yes! All designs are fully customizable. You can adjust dimensions, change materials, modify layouts, and tweak any aspect using our intuitive editor.",
        },
        {
          q: "How accurate are the budget estimates?",
          a: "Our estimates are based on current market rates and include materials, labor, and contingency. Actual costs may vary based on your location and specific contractor rates.",
        },
      ],
    },
    {
      category: "Contractors",
      questions: [
        {
          q: "How are contractors verified?",
          a: "All contractors undergo a thorough verification process including license checks, portfolio review, and customer feedback analysis before joining our platform.",
        },
        {
          q: "Can I hire multiple contractors?",
          a: "Yes, you can connect with and hire different contractors for different aspects of your project (e.g., one for construction, another for electrical work).",
        },
      ],
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, debit cards, UPI, and bank transfers. Payment terms with contractors are negotiated directly between you and them.",
        },
        {
          q: "Is there a subscription fee?",
          a: "SIID offers both free and premium plans. The free plan includes basic design generation, while premium plans offer advanced features and unlimited projects.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-xl text-muted-foreground mb-8">Search our knowledge base or browse categories below</p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center hover-lift cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">Comprehensive guides and tutorials</p>
            </Card>

            <Card className="p-6 text-center hover-lift cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with our support team</p>
            </Card>

            <Link href="/contact" className="block">
              <Card className="p-6 text-center hover-lift cursor-pointer h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground">Get help via email</p>
              </Card>
            </Link>
          </div>

          <section>
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-xl font-semibold mb-4 text-primary">{category.category}</h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = catIndex * 100 + faqIndex
                      return (
                        <Card
                          key={faqIndex}
                          className="overflow-hidden cursor-pointer hover-lift"
                          onClick={() => setOpenFaq(openFaq === globalIndex ? null : globalIndex)}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold pr-4">{faq.q}</h4>
                              <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                                  openFaq === globalIndex ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                            {openFaq === globalIndex && (
                              <p className="text-muted-foreground mt-4 leading-relaxed animate-slide-up">{faq.a}</p>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-16 text-center bg-muted rounded-lg p-12">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">Our support team is here to assist you</p>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
