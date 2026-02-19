import { AITrainingInterface } from "@/components/ai-training-interface"

export const metadata = {
  title: "AI Training - SIID",
  description: "Explore 1000+ technical Q&A pairs about the SIID project",
}

export default function AITrainingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Training Knowledge Base</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive technical documentation with 1000+ questions and answers covering all aspects of the SIID
            platform
          </p>
        </div>

        <AITrainingInterface />
      </div>
    </div>
  )
}
