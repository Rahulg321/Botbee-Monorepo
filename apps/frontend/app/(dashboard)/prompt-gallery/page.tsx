import React, { Suspense } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { AddPromptDialog } from "@/components/dialogs/add-prompt-dialog";
import { Button } from "@/components/ui/button";
import { getAllPrompts } from "@/lib/queries";

const prompts = [
  {
    id: "code-expert",
    number: 1,
    title: "Code Expert",
    slug: "/code-expert",
    author: "@masterdee",
    description: "Expert-level coding assistance and code review",
    category: "Development",
  },
  {
    id: "linux-command-expert",
    number: 2,
    title: "Linux Command Expert",
    slug: "/linux-command-expert",
    author: "@maker318",
    description: "Advanced Linux command line operations and scripting",
    category: "System Administration",
  },
  {
    id: "stable-diffusion",
    number: 3,
    title: "Stable Diffusion",
    slug: "/stable-diffusion",
    author: "@stewart",
    description: "AI image generation and prompt engineering",
    category: "AI/ML",
  },
  {
    id: "grammar-check",
    number: 4,
    title: "Grammar Check And Rewrite",
    slug: "/grammar-check",
    author: "@hub",
    description: "Professional writing assistance and grammar correction",
    category: "Writing",
  },
  {
    id: "multi-agents",
    number: 5,
    title: "Multi Agents",
    slug: "/multi-agents",
    author: "@stewart",
    description: "Coordinated AI agent systems and workflows",
    category: "AI/ML",
  },
  {
    id: "document-extraction",
    number: 6,
    title: "Document Information Extraction",
    slug: "/document-information-extraction",
    author: "@billybones",
    description: "Extract and analyze information from documents",
    category: "Data Processing",
  },
  {
    id: "prompt-enhancer",
    number: 7,
    title: "Prompt Enhancer",
    slug: "/prompt-enhancer",
    author: "@kuldeepluvani",
    description: "Improve and optimize AI prompts for better results",
    category: "AI/ML",
  },
  {
    id: "role-playing",
    number: 8,
    title: "Role-Playing",
    slug: "/rp",
    author: "@tsubaki",
    description: "Interactive character roleplay and storytelling",
    category: "Entertainment",
  },
  {
    id: "code-optimization",
    number: 9,
    title: "Code Optimization",
    slug: "/code-optimization",
    author: "@hub",
    description: "Performance optimization and code refactoring",
    category: "Development",
  },
  {
    id: "webcrawler",
    number: 10,
    title: "Webcrawler",
    slug: "/webcrawler",
    author: "@kalleo",
    description: "Web scraping and data extraction automation",
    category: "Data Processing",
  },
];

const PromptGalleryPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-foreground mb-6">
            Prompts
          </h1>

          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">Prompts</span>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Prompts"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <button className="p-2 hover:bg-accent rounded-md transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                asChild
              >
                <Link href="/prompt-gallery/create">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </Link>
              </Button>

              {/* <AddPromptDialog /> */}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4">
                <div className="space-y-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FetchPrompts />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGalleryPage;

const FetchPrompts = async () => {
  const prompts = await getAllPrompts();

  if (!prompts) {
    return <div>No prompts found</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {prompts.length} Prompts
      </h2>

      {prompts.map((prompt, index) => (
        <Link
          key={prompt.id}
          href={`/prompt-gallery/${prompt.id}`}
          className="block group"
        >
          <div className="p-3 rounded-md hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {prompt.title}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
