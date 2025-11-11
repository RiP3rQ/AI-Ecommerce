"use client";

import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNoticeModal(): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] border-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-6 p-8">
          {/* Icon Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Desktop Experience Only
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              This is a Minimum Viable Product (MVP) designed exclusively for desktop experiences.
              For the best browsing experience, please visit us on a device with a screen width of at least 650px.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-blue-700 dark:text-blue-300">
                <Monitor className="h-5 w-5" />
                <span>Recommended: 650px+ screen width</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            I Understand
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mobile support coming soon in future updates!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
