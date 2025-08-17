import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const characters = [
  {
    id: 1,
    name: "Llama3-Uncensored",
    creator: "@zillomab",
    image: "/placeholder.svg?height=200&width=200",
    description: "Unrestricted AI model for open conversations",
    category: "General",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: 2,
    name: "Codewriter",
    creator: "@vianch",
    image: "/placeholder.svg?height=200&width=200",
    description: "Specialized coding assistant and developer companion",
    category: "Development",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    name: "Based Dolphin Mixtral",
    creator: "@hub",
    image: "/placeholder.svg?height=200&width=200",
    description: "Advanced reasoning model with enhanced capabilities",
    category: "Advanced",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    id: 4,
    name: "Multi Agent",
    creator: "@stewart",
    image: "/placeholder.svg?height=200&width=200",
    description: "Collaborative AI system with multiple specialized agents",
    category: "Productivity",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    id: 5,
    name: "ChatGPT-4-Uncensored",
    creator: "@uaquax",
    image: "/placeholder.svg?height=200&width=200",
    description: "Enhanced GPT-4 model without content restrictions",
    category: "General",
    gradient: "from-teal-500 to-green-600",
  },
  {
    id: 6,
    name: "Sarah, A Loving And...",
    creator: "@chmurli",
    image: "/placeholder.svg?height=200&width=200",
    description: "Empathetic companion AI with emotional intelligence",
    category: "Companion",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    id: 7,
    name: "Blackhat Hacker",
    creator: "@darkside",
    image: "/placeholder.svg?height=200&width=200",
    description: "Cybersecurity expert for ethical hacking guidance",
    category: "Security",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    id: 8,
    name: "Code Companion",
    creator: "@devmaster",
    image: "/placeholder.svg?height=200&width=200",
    description: "AI pair programmer for collaborative development",
    category: "Development",
    gradient: "from-green-400 to-emerald-600",
  },
  {
    id: 9,
    name: "Image Generative AI",
    creator: "@artbot",
    image: "/placeholder.svg?height=200&width=200",
    description: "Creative AI specialized in image generation and art",
    category: "Creative",
    gradient: "from-yellow-400 to-amber-600",
  },
];

const CharactersPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Models</h1>
            <p className="text-muted-foreground text-lg">
              Choose from our collection of specialized AI models, each with
              unique personalities and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <Link key={character.id} href={`/characters/${character.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="p-0">
                    <div
                      className={`relative h-48 bg-gradient-to-br ${character.gradient} overflow-hidden`}
                    >
                      <img
                        src={character.image || "/placeholder.svg"}
                        alt={character.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white"
                      >
                        {character.category}
                      </Badge>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                          {character.name}
                        </h3>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {character.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">
                          {character.creator}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharactersPage;
