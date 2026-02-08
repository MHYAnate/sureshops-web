"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin, Clock, BadgeCheck, Copy, ExternalLink } from "lucide-react";
import { Card, Button, Badge, Avatar } from "@/components/ui";
import { PriceTag, Rating, VerifiedBadge, LocationBadge } from "@/components/common";
import { VendorListing } from "@/types";
import { cn, formatPrice, isOpen as checkIsOpen } from "@/lib/utils";
import toast from "react-hot-toast";

interface PriceComparisonProps {
  vendors: VendorListing[];
  className?: string;
}

export function PriceComparison({ vendors, className }: PriceComparisonProps) {
  const copyBankDetails = (vendor: VendorListing) => {
    if (!vendor.bankDetails) return;
    
    const details = `Bank: ${vendor.bankDetails.bankName}\nAccount Name: ${vendor.bankDetails.accountName}\nAccount Number: ${vendor.bankDetails.accountNumber}`;
    navigator.clipboard.writeText(details);
    toast.success("Bank details copied!");
  };

  const lowestPrice = Math.min(...vendors.map((v) => v.price));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Compare Prices ({vendors.length} shops)
        </h2>
        <Badge variant="outline">
          Lowest: {formatPrice(lowestPrice)}
        </Badge>
      </div>

      <div className="space-y-3">
        {vendors.map((vendor, index) => {
          const isLowest = vendor.price === lowestPrice;
          const vendorIsOpen = vendor.operatingHours
            ? checkIsOpen(vendor.operatingHours.openingTime, vendor.operatingHours.closingTime)
            : true;

          return (
            <Card
              key={vendor.vendorId}
              className={cn(
                "p-4",
                isLowest && "ring-2 ring-primary"
              )}
            >
              {isLowest && (
                <Badge className="absolute -top-2 left-4">Lowest Price</Badge>
              )}

              <div className="flex gap-4">
                {/* Shop Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  {vendor.logo || vendor.entrancePhoto ? (
                    <Image
                      src={vendor.logo || vendor.entrancePhoto!}
                      alt={vendor.businessName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                  )}
                </div>

                {/* Shop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/shops/${vendor.vendorId}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {vendor.businessName}
                        </Link>
                        {vendor.isVerified && <VerifiedBadge size="sm" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Rating value={vendor.rating} size="sm" />
                        <Badge
                          variant={vendorIsOpen ? "success" : "secondary"}
                          className="text-xs"
                        >
                          {vendorIsOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </div>

                    <PriceTag
                      price={vendor.price}
                      originalPrice={vendor.originalPrice}
                      size="md"
                    />
                  </div>

                  {/* Location */}
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {vendor.location.shopNumber && `${vendor.location.shopNumber}, `}
                        {vendor.location.market?.name || vendor.location.area.name}
                      </span>
                    </div>
                    {vendor.location.distance !== undefined && (
                      <span className="text-xs">
                        {vendor.location.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mt-2">
                    {vendor.inStock ? (
                      <Badge variant="success" className="text-xs">
                        In Stock ({vendor.quantity} available)
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${vendor.contactDetails.phone}`)}
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                    
                    {vendor.contactDetails.whatsapp && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${vendor.contactDetails.whatsapp?.replace(/\D/g, "")}`
                          )
                        }
                      >
                        <MessageCircle className="mr-1 h-3 w-3" />
                        WhatsApp
                      </Button>
                    )}

                    {vendor.bankDetails && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyBankDetails(vendor)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Bank Details
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/shops/${vendor.vendorId}`}>
                        View Shop
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}