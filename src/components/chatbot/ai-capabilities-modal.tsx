"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sparkles, ShoppingCart, Shirt, Star } from "lucide-react";
import { AiToolCategory, type AiToolDto } from "@/app/api/ai/ai-tools/dto";

interface AiCapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map categories to icons and display names
const categoryConfig = {
  [AiToolCategory.PRODUCT_DISCOVERY]: {
    icon: Sparkles,
    displayName: "Product Discovery",
    description: "Find and explore products",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  [AiToolCategory.CART_MANAGEMENT]: {
    icon: ShoppingCart,
    displayName: "Cart Management",
    description: "Manage your shopping cart",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  [AiToolCategory.OUTFIT_STYLING]: {
    icon: Shirt,
    displayName: "Outfit & Styling",
    description: "Get style recommendations",
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  [AiToolCategory.PRODUCT_RECOMMENDATIONS]: {
    icon: Star,
    displayName: "Smart Recommendations",
    description: "Personalized suggestions",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
};

export function AiCapabilitiesModal({
  isOpen,
  onClose,
}: AiCapabilitiesModalProps) {
  const [tools, setTools] = useState<AiToolDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tools.length === 0) {
      fetchTools();
    }
  }, [isOpen]);

  const fetchTools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/ai-tools");
      if (!response.ok) {
        throw new Error("Failed to fetch AI capabilities");
      }
      const data = await response.json();
      setTools(data.tools);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Group tools by category
  const toolsByCategory = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<AiToolCategory, AiToolDto[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            AI Assistant Capabilities
          </DialogTitle>
          <DialogDescription>
            Discover everything our AI shopping assistant can help you with.
            Simply ask in natural language!
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="text-sm font-medium text-red-900 dark:text-red-100">
              {error}
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {Object.entries(toolsByCategory).map(([category, categoryTools]) => {
                const config = categoryConfig[category as AiToolCategory];
                const Icon = config.icon;

                return (
                  <div key={category} className="space-y-3">
                    <div
                      className={`flex items-center gap-3 rounded-lg ${config.bgColor} ${config.borderColor} border px-4 py-3`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${config.color}`}>
                          {config.displayName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                      <span
                        className={`rounded-full ${config.bgColor} px-3 py-1 text-xs font-medium ${config.color}`}
                      >
                        {categoryTools.length}{" "}
                        {categoryTools.length === 1 ? "tool" : "tools"}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {categoryTools.map((tool) => (
                        <div
                          key={tool.name}
                          className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                        >
                          <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {!isLoading && !error && tools.length > 0 && (
          <div className="mt-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-purple-950 dark:to-blue-950">
            <p className="text-center text-sm text-gray-700 dark:text-gray-300">
              💡 <span className="font-semibold">Pro Tip:</span> Just chat
              naturally! Try asking "Show me popular products" or "Add this to
              my cart"
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

