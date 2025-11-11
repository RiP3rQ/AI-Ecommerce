"use client";

import React, { useEffect, useState } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import {
  ChatAddToolApproveResponseFunction,
  ReasoningUIPart,
  ToolApprovalRequest,
  ToolUIPart,
} from "ai";
import { Price } from "../custom-price";
import { Card } from "../ui/card";

interface SelectedProduct {
  productId: string;
  variantId: string;
  quantity: number;
}

interface MessageListProps {
  messages: MessageType[];
  status?: string;
  addToolOutput: (params: {
    tool: string;
    toolCallId: string;
    output: unknown;
  }) => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  isAuthenticated: boolean;
}

interface MessageBubbleProps {
  message: MessageType;
  status?: string;
  isLastMessage?: boolean;
  addToolOutput: (params: {
    tool: string;
    toolCallId: string;
    output: unknown;
  }) => void;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}

const MessageBubble = ({
  message,
  addToolOutput,
  addToolApprovalResponse,
}: MessageBubbleProps) => {
  const { user } = useAuth();
  const isUser = message.role === "user";
  const isErrorMessage =
    message.id.startsWith("error-") ||
    message.id.startsWith("access-denied-message");
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

  // State to store products from Step 1 (addToCartProductInformations)
  // This will be used in Step 2 (clientSideConfirmationForCartModification)
  const [productsFromStep1, setProductsFromStep1] = useState<Array<{
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
  }> | null>(null);

  // Extract products from Step 1 tool output when message updates
  useEffect(() => {
    const addToCartPart = message.parts.find(
      (part: any) =>
        part.type === "tool-addToCartProductInformations" &&
        part.state === "output-available",
    );

    if (addToCartPart) {
      const toolPart = addToCartPart as any;
      const productsData = toolPart.output?.products;

      if (productsData && productsData.length > 0 && !productsFromStep1) {
        const transformedProducts = productsData.map((product: any) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          tags: product.tags,
          variants: product.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title,
            price: variant.price,
            currencyCode: variant.currencyCode,
            availableForSale: variant.availableForSale,
            selectedOptions: variant.selectedOptions,
            inventoryQuantity: variant.inventoryQuantity,
          })),
        }));

        setProductsFromStep1(transformedProducts);
      }
    }
  }, [message, productsFromStep1]);

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
                <div
                  className="flex items-center gap-4"
                  key={`${message.id}-${i}`}
                >
                  <Loader className="size-4" />
                  <Response key={`${message.id}-${i}`}>{part.text}</Response>
                </div>
              );
            } else if (part.type === "text") {
              return (
                <Response key={`${message.id}-${i}`}>{part.text}</Response>
              );
            } else if (part.type === "reasoning") {
              const reasoningPart = part as ReasoningUIPart;
              return (
                <Reasoning
                  key={`${message.id}-${i}`}
                  className="w-full"
                  defaultOpen={reasoningPart.state === "streaming"}
                  isStreaming={reasoningPart.state === "streaming"}
                >
                  <ReasoningTrigger />
                  <ReasoningContent>{reasoningPart.text}</ReasoningContent>
                </Reasoning>
              );
            } else if (part.type === "step-start") {
              // Skip step-start parts as they're just indicators
              return null;
            } else if (
              part.type === "tool-addToCartProductInformations" &&
              part.state === "output-available"
            ) {
              // STEP 1: Display product data from addToCartProductInformations output
              // Product data is extracted via useEffect and stored in productsFromStep1 state
              const toolPart = part as any;

              // Display the tool result
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
            } else if (
              part.type === "tool-clientSideConfirmationForCartModification"
            ) {
              const toolPart = part as any;

              // STEP 2: Handle client-side confirmation tool for cart modification
              if (toolPart.state === "input-available") {
                // Use products from Step 1 state
                if (!productsFromStep1 || productsFromStep1.length === 0) {
                  return (
                    <div
                      key={`${message.id}-${i}`}
                      className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
                    >
                      <div className="text-sm font-medium text-red-900 dark:text-red-100">
                        Error: No product data available from Step 1. Please try
                        again.
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={`${message.id}-${i}`} className="mt-4">
                    <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        🛒 Ready to add {productsFromStep1.length}{" "}
                        {productsFromStep1.length === 1
                          ? "product"
                          : "products"}{" "}
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
                            products: productsFromStep1,
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
            } else if (
              part.type === "tool-removeFromCart" &&
              part.state === "approval-requested"
            ) {
              // Handle removeFromCart approval request
              const invocation = part.input as {
                items: Array<{
                  productId: string;
                  productTitle: string;
                  quantity: number;
                  variantCurrencyCode: string;
                  variantPrice: number;
                  variantTitle: string;
                }>;
              };

              return (
                <div key={`${message.id}-${i}`} className="mt-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                      🗑️ Confirm Cart Removal
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                      I need your approval to remove the following items from
                      your cart. This action cannot be undone.
                    </p>
                    <Card className="space-y-3 py-0 mt-0 mb-4">
                      {invocation.items.map((item, index) => (
                        <div
                          key={`${item.productId}-${index}`}
                          className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-white px-4 py-3 shadow-sm transition hover:border-amber-400 dark:border-amber-700 dark:bg-gray-900"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-gray-900 dark:text-amber-100">
                              {item.productTitle}
                            </span>
                            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                              x{item.quantity}
                            </span>
                          </div>
                          <div className="flex flex-row gap-4 text-xs text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Variant:</span>
                              <span>{item.variantTitle}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Price:</span>
                              <Price
                                amount={item.variantPrice.toString()}
                                currencyCode={item.variantCurrencyCode}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </Card>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.approval.id,
                            approved: false,
                          })
                        }
                      >
                        Reject Removal
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.approval.id,
                            approved: true,
                          })
                        }
                      >
                        Confirm Removal
                      </Button>
                    </div>
                  </div>
                </div>
              );
            } else if (
              part.type === "tool-removeFromCart" &&
              part.state === "output-available"
            ) {
              // Handle removeFromCart output
              const toolPart = part as any;
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
            } else if (part.type.startsWith("tool-")) {
              const toolPart = part as ToolUIPart;
              return (
                <Tool
                  key={`${message.id}-${i}`}
                  defaultOpen={toolPart.state === "output-error"}
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
            setProductsFromStep1(null);
          }}
          products={addToCartModal.products}
          isLoading={isAddingToCart}
          onConfirm={(selectedItems: SelectedProduct[]) => {
            setIsAddingToCart(true);
            if (!user?.id) {
              console.error("User not authenticated");
              setIsAddingToCart(false);
              return;
            }

            // Return the output for the clientSideConfirmationForCartModification tool
            // The AI will then automatically call saveTheFrontendSelectedProductToCart with this data
            addToolOutput({
              tool: "clientSideConfirmationForCartModification",
              toolCallId: addToCartModal.toolCallId,
              output: {
                userId: user.id,
                selectedItems: selectedItems.map((item) => ({
                  productVariantId: item.variantId,
                  quantity: item.quantity,
                })),
              },
            });
            setAddToCartModal(null);
            setIsAddingToCart(false);
            setProductsFromStep1(null);
          }}
        />
      )}
    </div>
  );
};

export const MessageList = ({
  messages,
  status,
  addToolOutput,
  addToolApprovalResponse,
  isAuthenticated,
}: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <div className="space-y-4">
        {!isAuthenticated && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-amber-900 dark:text-amber-100">
                🔐 Authentication Required
              </div>
            </div>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Please sign in to interact with our AI assistant and add products
              to your cart.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            addToolOutput={addToolOutput}
            addToolApprovalResponse={addToolApprovalResponse}
          />
        ))}
      </div>
    </div>
  );
};
