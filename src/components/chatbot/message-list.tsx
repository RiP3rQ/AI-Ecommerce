"use client";

import React, { useState } from "react";
import { type MessageType } from "@/types/chat";
import Image from "next/image";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  AI_ASSISTANT_AVATAR_LINK,
  AI_ASSISTANT_NAME,
  USER_AVATAR_LINK,
  USER_NAME,
} from "./constants";
import { Loader } from "../ai-elements/loader";
import { AddToCartModal } from "./add-to-cart-modal";
import { Button } from "@/components/ui/button";

interface ProductVariant {
  variantId: string;
  variantTitle: string;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductWithVariants {
  productId: string;
  productTitle: string;
  availableVariants: ProductVariant[];
}

interface SelectedProduct {
  productId: string;
  variantId: string;
  quantity: number;
}

interface MessageListProps {
  messages: MessageType[];
  status?: string;
  addToolResult: (params: {
    tool: string;
    toolCallId: string;
    output: unknown;
  }) => void;
}

interface MessageBubbleProps {
  message: MessageType;
  status?: string;
  isLastMessage?: boolean;
  addToolResult: (params: {
    tool: string;
    toolCallId: string;
    output: unknown;
  }) => void;
}

const MessageBubble = ({
  message,
  status,
  isLastMessage,
  addToolResult,
}: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const isErrorMessage = message.id.startsWith("error-");
  const isLoadingMessage = message.id.startsWith("loading-");

  // State for add-to-cart modal
  const [addToCartModal, setAddToCartModal] = useState<{
    isOpen: boolean;
    toolCallId: string;
    products: Array<{
      id: string;
      title: string;
      description?: string | null;
      tags: string[] | null;
      variants: Array<{
        id: string;
        title: string;
        price: number;
        currencyCode: string;
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
        inventoryQuantity?: number | null;
      }>;
    }>;
  } | null>(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Image
          src={AI_ASSISTANT_AVATAR_LINK}
          alt={AI_ASSISTANT_NAME}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? "order-first" : ""}`}
      >
        <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isUser ? USER_NAME : AI_ASSISTANT_NAME}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? "bg-blue-600 text-white"
              : isErrorMessage
                ? "bg-red-50 text-red-900 border border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800"
                : isLoadingMessage
                  ? "bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800 animate-pulse"
                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          }`}
        >
          {message.parts.map((part, i) => {
            if (part.type === "text" && message.id.startsWith("loading-")) {
              return (
                <div className="flex items-center gap-4">
                  <Loader className="size-4" />
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                </div>
              );
            } else if (part.type === "text") {
              return (
                <Response key={`${message.id}-${i}`}>{part.text}</Response>
              );
            } else if (part.type === "reasoning") {
              return (
                <Reasoning
                  key={`${message.id}-${i}`}
                  className="w-full"
                  isStreaming={
                    status === "streaming" &&
                    isLastMessage &&
                    i === message.parts.length - 1
                  }
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{part.text}</ReasoningContent>
                </Reasoning>
              );
            } else if (part.type === "step-start") {
              // Skip step-start parts as they're just indicators
              return null;
            } else if (
              part.type === "tool-clientSideConfirmationForCartModification"
            ) {
              const toolPart = part as any;

              // Handle client-side confirmation tool for cart modification
              if (toolPart.state === "input-available") {
                // Transform input data for modal
                const productsForModal = toolPart.input.map(
                  (item: ProductWithVariants) => ({
                    id: item.productId,
                    title: item.productTitle,
                    description: null,
                    tags: null,
                    variants: item.availableVariants.map(
                      (v: ProductVariant) => ({
                        id: v.variantId,
                        title: v.variantTitle,
                        price: v.price,
                        currencyCode: v.currencyCode,
                        availableForSale: v.availableForSale,
                        selectedOptions: v.selectedOptions,
                        inventoryQuantity: null,
                      }),
                    ),
                  }),
                );

                return (
                  <div key={`${message.id}-${i}`} className="mt-4">
                    <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🛒 Ready to add {productsForModal.length}{" "}
                        {productsForModal.length === 1 ? "product" : "products"}{" "}
                        to your cart
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                        Review the products and select your preferred variants
                        and quantities.
                      </p>
                      <Button
                        size="sm"
                        onClick={() =>
                          setAddToCartModal({
                            isOpen: true,
                            toolCallId: toolPart.toolCallId,
                            products: productsForModal,
                          })
                        }
                      >
                        Review & Add to Cart
                      </Button>
                    </div>
                  </div>
                );
              }

              // Show output state
              if (toolPart.state === "output-available") {
                return (
                  <Tool
                    key={`${message.id}-${i}`}
                    defaultOpen={false}
                    className="mt-4"
                  >
                    <ToolHeader type={toolPart.type} state={toolPart.state} />
                    <ToolContent>
                      <ToolInput input={toolPart.input} />
                      <ToolOutput
                        output={toolPart.output}
                        errorText={toolPart.errorText}
                      />
                    </ToolContent>
                  </Tool>
                );
              }

              // Handle error state
              if (toolPart.state === "output-error") {
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
                  >
                    <div className="text-sm font-medium text-red-900 dark:text-red-100">
                      Error: {toolPart.errorText}
                    </div>
                  </div>
                );
              }

              return null;
            } else if (part.type.startsWith("tool-")) {
              const toolPart = part as any; // Type assertion for tool parts
              return (
                <Tool
                  key={`${message.id}-${i}`}
                  defaultOpen={
                    toolPart.state === "output-available" ||
                    toolPart.state === "output-error"
                  }
                  className="mt-4"
                >
                  <ToolHeader type={toolPart.type} state={toolPart.state} />
                  <ToolContent>
                    <ToolInput input={toolPart.input} />
                    <ToolOutput
                      output={toolPart.output}
                      errorText={toolPart.errorText}
                    />
                  </ToolContent>
                </Tool>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
      {isUser && (
        <Image
          src={USER_AVATAR_LINK}
          alt={USER_NAME}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
      )}

      {/* Add to Cart Modal */}
      {addToCartModal && (
        <AddToCartModal
          isOpen={addToCartModal.isOpen}
          onClose={() => {
            setAddToCartModal(null);
            setIsAddingToCart(false);
          }}
          products={addToCartModal.products}
          isLoading={isAddingToCart}
          onConfirm={(selectedItems: SelectedProduct[]) => {
            setIsAddingToCart(true);
            // Send the selected variants back to the backend via addToolResult
            addToolResult({
              tool: "clientSideConfirmationForCartModification",
              toolCallId: addToCartModal.toolCallId,
              output: selectedItems.map((item) => ({
                productVariantId: item.variantId,
                quantity: item.quantity,
              })),
            });
            setAddToCartModal(null);
            setIsAddingToCart(false);
          }}
        />
      )}
    </div>
  );
};

export const MessageList = ({
  messages,
  status,
  addToolResult,
}: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            status={status}
            isLastMessage={index === messages.length - 1}
            addToolResult={addToolResult}
          />
        ))}
      </div>
    </div>
  );
};
