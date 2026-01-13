"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({
  isOpen,
  title = "Something went wrong",
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl z-[101] overflow-hidden border border-red-100 dark:border-red-900/30"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="mt-8">
                <Button
                  onClick={onClose}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 rounded-xl transition-all shadow-lg shadow-red-200 dark:shadow-none"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
