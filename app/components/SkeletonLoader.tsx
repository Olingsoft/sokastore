"use client";

import React from 'react';

// Base Skeleton component with shimmer animation
const Skeleton = ({ className = "", variant = "default" }: { className?: string; variant?: "default" | "circle" | "rect" }) => {
    const baseClasses = "animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]";
    const variantClasses = {
        default: "rounded",
        circle: "rounded-full",
        rect: "rounded-lg"
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
                animation: 'shimmer 2s infinite linear',
            }}
        >
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
        </div>
    );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
    return (
        <div className="block group h-[250px] w-full">
            <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-gray-800 h-full flex flex-col">
                {/* Image Skeleton */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#2A2A2A]">
                    <Skeleton className="w-full h-full" variant="rect" />
                    {/* Category Badge Skeleton */}
                    <div className="absolute top-2 left-2">
                        <Skeleton className="w-16 h-4" variant="default" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-2.5 flex flex-col flex-grow">
                    {/* Title Skeleton */}
                    <Skeleton className="h-4 w-3/4 mb-1" variant="default" />

                    {/* Team Skeleton */}
                    <Skeleton className="h-3 w-1/2 mb-2" variant="default" />

                    {/* Price and Action Skeleton */}
                    <div className="flex items-center justify-between mt-auto">
                        <Skeleton className="h-6 w-16" variant="default" />
                        <Skeleton className="h-4 w-12" variant="default" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Category Badge Skeleton
export const CategoryBadgeSkeleton = () => {
    return (
        <div className="flex-shrink-0 lg:flex-shrink-1 min-w-[120px] lg:min-w-full">
            <Skeleton className="h-10 w-full" variant="default" />
        </div>
    );
};

// Hero Skeleton (for main slider)
export const HeroImageSkeleton = () => {
    return (
        <div className="w-full h-full bg-[#2A2A2A]">
            <Skeleton className="w-full h-full" variant="rect" />
        </div>
    );
};

// Product Detail Page Skeleton
export const ProductDetailSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 grid lg:grid-cols-2 gap-8">
            {/* Image Section Skeleton */}
            <div className="flex flex-col gap-3">
                {/* Main Image */}
                <Skeleton className="w-full h-[500px]" variant="rect" />

                {/* Thumbnail Gallery */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="w-14 h-14" variant="rect" />
                    ))}
                </div>
            </div>

            {/* Details Section Skeleton */}
            <div className="flex flex-col gap-4">
                {/* Title */}
                <Skeleton className="h-8 w-3/4" variant="default" />

                {/* Price */}
                <Skeleton className="h-6 w-24" variant="default" />

                {/* Description */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" variant="default" />
                    <Skeleton className="h-4 w-5/6" variant="default" />
                    <Skeleton className="h-4 w-4/6" variant="default" />
                </div>

                {/* Type Options */}
                <div className="pt-3 border-t border-gray-800">
                    <Skeleton className="h-4 w-16 mb-2" variant="default" />
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-8 w-20" variant="default" />
                        ))}
                    </div>
                </div>

                {/* Size Options */}
                <div>
                    <Skeleton className="h-4 w-16 mb-2" variant="default" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-8 w-12" variant="default" />
                        ))}
                    </div>
                </div>

                {/* Add to Bag Button */}
                <div className="mt-4">
                    <Skeleton className="h-12 w-full" variant="default" />
                </div>
            </div>
        </div>
    );
};

// Related Products Grid Skeleton
export const RelatedProductsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-xl border border-gray-800">
                    <Skeleton className="w-full pb-[100%]" variant="rect" />
                    <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" variant="default" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-5 w-16" variant="default" />
                            <Skeleton className="h-6 w-12" variant="default" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
