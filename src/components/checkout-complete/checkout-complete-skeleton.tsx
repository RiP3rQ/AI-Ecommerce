import { Separator } from "@radix-ui/react-dropdown-menu";
import { Package, Truck } from "lucide-react";
import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function CheckoutCompleteSkeleton(): ReactNode {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header Skeleton */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-80 mx-auto mb-2" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
  
        {/* Order Confirmation Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Order Items Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Multiple order items skeleton */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                  {/* Product Image Skeleton */}
                  <Skeleton className="w-20 h-20 rounded-md shrink-0" />
  
                  {/* Product Details Skeleton */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            <Separator className="my-4" />
  
            {/* Order Summary Skeleton */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* What's Next Card Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <Skeleton className="h-6 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Three steps skeleton */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
  
        {/* Contact Information Card Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }