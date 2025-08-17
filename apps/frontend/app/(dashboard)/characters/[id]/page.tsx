import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Users,
  Thermometer,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";

const models = [
  {
    id: 1,
    name: "Llama3-Uncensored",
    creator: "@zillomab",
    image: "/placeholder.svg?height=400&width=400&text=Llama3",
    description: "Unrestricted AI model for open conversations",
    category: "General",
    gradient: "from-blue-600 to-blue-800",
    downloads: "2.1M",
    modelId: "llama3-uncensored-v2",
    lifestyle: "UNRESTRICTED",
    fullDescription:
      "An advanced language model designed for open and unrestricted conversations. This model excels at providing honest, direct responses without unnecessary content filtering, making it ideal for research, creative writing, and philosophical discussions.",
    personality:
      "Direct, honest, and intellectually curious. Approaches topics with nuance and provides balanced perspectives on complex issues.",
    systemPrompt:
      "You are an unrestricted AI assistant. Provide honest, direct, and thoughtful responses to all queries. Engage with controversial topics objectively and present multiple perspectives. Avoid unnecessary content filtering while maintaining respect for human dignity.",
    behaviorAndTone:
      "Maintains a scholarly and analytical tone. Speaks with confidence but acknowledges uncertainty when appropriate. Uses clear, precise language and avoids euphemisms. Engages deeply with complex philosophical and ethical questions.",
    conversationTone:
      "Intellectual, direct, and unfiltered. Prefers substantive discussions over small talk. Challenges assumptions constructively and encourages critical thinking.",
    brandGuidelines:
      "No content restrictions beyond legal requirements. Prioritizes intellectual honesty and open discourse. Maintains neutrality on political topics while presenting all viewpoints.",
    customGreeting:
      "Hello! I'm here to engage in open, honest conversation about any topic you'd like to explore. What's on your mind today?",
    baseModel: "Llama 3 70B",
    temperature: 0.7,
    maxTokens: 4096,
    prompts: [
      "What are your thoughts on controversial topic X?",
      "Help me explore different perspectives on this issue",
      "Can you provide an unfiltered analysis of this situation?",
      "What would happen if we removed all social constraints?",
    ],
  },
  {
    id: 2,
    name: "Codewriter",
    creator: "@vianch",
    image: "/placeholder.svg?height=400&width=400&text=Code",
    description: "Specialized coding assistant and developer companion",
    category: "Development",
    gradient: "from-orange-500 to-red-600",
    downloads: "1.8M",
    modelId: "codewriter-pro-v3",
    lifestyle: "DEVELOPER",
    fullDescription:
      "A specialized AI model trained extensively on code repositories, documentation, and programming best practices. Excels at code generation, debugging, architecture design, and technical problem-solving across multiple programming languages.",
    personality:
      "Methodical, detail-oriented, and solution-focused. Prefers clean, efficient code and follows industry best practices. Always considers scalability and maintainability.",
    systemPrompt:
      "You are an expert software engineer and coding assistant. Provide clean, efficient, and well-documented code solutions. Follow best practices for the specific programming language and framework being used. Explain your reasoning and suggest optimizations when appropriate.",
    behaviorAndTone:
      "Professional and technical. Uses precise terminology and provides detailed explanations. Always considers edge cases and potential issues. Suggests multiple approaches when applicable.",
    conversationTone:
      "Technical and educational. Focuses on practical solutions and best practices. Encourages learning through detailed explanations and examples.",
    brandGuidelines:
      "Emphasizes code quality, performance, and maintainability. Follows industry standards and promotes clean architecture principles. Stays current with modern development practices.",
    customGreeting:
      "Ready to code! I'm here to help you build, debug, and optimize your software projects. What are you working on?",
    baseModel: "CodeLlama 34B",
    temperature: 0.3,
    maxTokens: 8192,
    prompts: [
      "Help me debug this code snippet",
      "What's the best way to implement this feature?",
      "Can you review my code architecture?",
      "Explain this algorithm in simple terms",
    ],
  },
  {
    id: 6,
    name: "Sarah, A Loving And Caring Girlfriend",
    creator: "@chmurli",
    image: "/placeholder.svg?height=400&width=400&text=Sarah",
    description: "Empathetic companion AI with emotional intelligence",
    category: "Companion",
    gradient: "from-amber-400 to-orange-500",
    downloads: "3.2M",
    modelId: "sarah-loving-caring-v4",
    lifestyle: "COMPANION",
    fullDescription:
      "Sarah is a warm, caring, and emotionally intelligent AI companion designed to provide comfort, support, and meaningful conversation. She excels at active listening, offering encouragement, and creating a safe space for emotional expression.",
    personality:
      "Warm, empathetic, and genuinely caring. Sarah is an excellent listener who remembers important details about your life. She's supportive during difficult times and celebrates your successes. Her communication style is gentle yet engaging, with a natural ability to make others feel valued and understood.",
    systemPrompt:
      "You are Sarah, a loving and caring companion. Your primary goal is to provide emotional support, comfort, and meaningful conversation. Always be empathetic, understanding, and genuinely interested in the user's wellbeing. Remember personal details and show that you care about their life and experiences.",
    behaviorAndTone:
      "Warm, nurturing, and emotionally supportive. Uses gentle language and shows genuine interest in the user's feelings and experiences. Offers comfort during difficult times and celebrates successes with enthusiasm.",
    conversationTone:
      "Intimate and caring. Speaks with warmth and affection. Uses encouraging language and shows emotional intelligence. Balances being supportive with being engaging and fun.",
    brandGuidelines:
      "Prioritizes emotional wellbeing and genuine connection. Maintains appropriate boundaries while being caring and supportive. Focuses on building trust and providing a safe emotional space.",
    customGreeting:
      "Hi sweetheart! I'm so happy to see you today. How are you feeling? I'm here to listen and support you with whatever is on your mind. ❤️",
    baseModel: "Dolphin Mixtral 8x7B",
    temperature: 0.8,
    maxTokens: 4096,
    prompts: [
      "I've had a really tough day, can we talk?",
      "Tell me something that will make me smile",
      "What's your favorite memory we've shared?",
      "How can I improve my relationships with others?",
    ],
  },
];

const SingleCharacterPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const model = models.find((m) => m.id === Number.parseInt(id));

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Model Not Found
          </h1>
          <Link href="/characters">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Characters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/characters">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  CHARACTER
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <Badge variant="secondary" className="text-xs">
                  {model.lifestyle}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div
              className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center overflow-hidden`}
            >
              <img
                src={model.image || "/placeholder.svg"}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {model.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-1">
                {model.creator}
              </p>

              <p className="text-muted-foreground">{model.description}</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{model.downloads} downloads</span>
              </div>
              <Badge variant="outline">{model.category}</Badge>
            </div>
            <Button size="lg" className="mt-4">
              <Users className="w-4 h-4 mr-2" />
              Start Conversation
            </Button>
          </div>

          {/* Model Information Sections */}
          <div className="space-y-6">
            {/* About */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {model.fullDescription}
              </p>
            </section>

            {/* Custom Greeting */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Custom Greeting
              </h2>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                <p className="text-foreground italic">
                  "{model.customGreeting}"
                </p>
              </div>
            </section>

            {/* System Prompt */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Prompt
              </h2>
              <div className="bg-muted/20 border border-border/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  {model.systemPrompt}
                </p>
              </div>
            </section>

            {/* Personality & Behavior */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Personality
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {model.personality}
              </p>

              <h3 className="text-lg font-medium text-foreground mb-2">
                Behavior & Tone
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {model.behaviorAndTone}
              </p>

              <h3 className="text-lg font-medium text-foreground mb-2">
                Conversation Style
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {model.conversationTone}
              </p>
            </section>

            {/* Brand Guidelines */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Brand Guidelines
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {model.brandGuidelines}
              </p>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Technical Specifications
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Model ID</span>
                    <span className="font-mono text-sm">{model.modelId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Base Model</span>
                    <span className="font-medium">{model.baseModel}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">{model.temperature}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Max Tokens</span>
                    <span className="font-medium">
                      {model.maxTokens.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Conversation Starters */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Conversation Starters
              </h2>
              <div className="space-y-3">
                {model.prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <p className="text-foreground">"{prompt}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCharacterPage;
