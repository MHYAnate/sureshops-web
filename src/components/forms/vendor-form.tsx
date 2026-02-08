"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Select } from "@/components/ui";
import { useLocation } from "@/hooks";
import { vendorSchema, VendorInput } from "@/lib/validations";
import { VENDOR_TYPES, NIGERIAN_BANKS } from "@/lib/constants";

interface VendorFormProps {
  initialData?: Partial<VendorInput>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function VendorForm({ initialData, onSubmit, isLoading }: VendorFormProps) {
  const {
    states,
    areas,
    markets,
    selectedState,
    selectedArea,
    setSelectedState,
    setSelectedArea,
    setSelectedMarket,
  } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<VendorInput>({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData || {
      vendorType: "market_shop",
      contactDetails: { phone: "" },
      bankDetails: {},
      categories: [],
    },
  });

  // Watch values for rendering
  const stateId = watch("stateId");
  const areaId = watch("areaId");
  const marketId = watch("marketId");
  const vendorType = watch("vendorType");

  // Sync initialData with location state on mount/edit
  useEffect(() => {
    if (initialData?.stateId) {
      const state = states.find((s) => s.id === initialData.stateId);
      if (state) setSelectedState(state);
    }
    if (initialData?.areaId) {
      const area = areas.find((a) => a.id === initialData.areaId);
      if (area) setSelectedArea(area);
    }
    if (initialData?.marketId) {
      const market = markets.find((m) => m.id === initialData.marketId);
      if (market) setSelectedMarket(market);
    }
  }, [initialData, states, areas, markets, setSelectedState, setSelectedArea, setSelectedMarket]);

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleStateChange = (stateId: string) => {
    const state = states.find((s) => s.id === stateId);
    setSelectedState(state || null);
    setValue("stateId", stateId, { shouldValidate: true });
    setValue("areaId", "", { shouldValidate: true });
    setValue("marketId", undefined, { shouldValidate: true });
    setSelectedArea(null);
    setSelectedMarket(null);
  };

  const handleAreaChange = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    setSelectedArea(area || null);
    setValue("areaId", areaId, { shouldValidate: true });
    setValue("marketId", undefined, { shouldValidate: true });
    setSelectedMarket(null);
  };

  const handleMarketChange = (marketId: string) => {
    const market = markets.find((m) => m.id === marketId);
    setSelectedMarket(market || null);
    setValue("marketId", marketId || undefined, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Business Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Business Information
        </h3>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Name <span className="text-destructive">*</span>
          </label>
          <Input
            {...register("businessName")}
            error={errors.businessName?.message}
            placeholder="Your shop or business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("businessDescription")}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Tell customers about your business, what you sell, specialties..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Vendor Type <span className="text-destructive">*</span>
          </label>
          <Select
            value={vendorType}
            onChange={(value) => setValue("vendorType", value as any, { shouldValidate: true })}
            options={VENDOR_TYPES}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Choose the type that best describes your business location
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              State <span className="text-destructive">*</span>
            </label>
            <Select
              key={`state-${states.length}`} // Force re-render if states change
              value={stateId || ""}
              onChange={handleStateChange}
              options={states.map((s) => ({ value: s.id, label: s.name }))}
              placeholder="Select state"
              error={errors.stateId?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Area <span className="text-destructive">*</span>
            </label>
            <Select
              key={`area-${selectedState?.id || 'none'}-${areas.length}`} // Re-render when state changes
              value={areaId || ""}
              onChange={handleAreaChange}
              options={areas.map((a) => ({ value: a.id, label: a.name }))}
              placeholder={selectedState ? "Select area" : "Select state first"}
              disabled={!selectedState || areas.length === 0}
              error={errors.areaId?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Market / Mall</label>
            <Select
              key={`market-${selectedArea?.id || 'none'}-${markets.length}`} // Re-render when area changes
              value={marketId || ""}
              onChange={handleMarketChange}
              options={[
                { value: "", label: "None (Home-based / Street)" },
                ...markets.map((m) => ({ value: m.id, label: m.name })),
              ]}
              placeholder={selectedArea ? "Select market" : "Select area first"}
              disabled={!selectedArea || markets.length === 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Shop Number</label>
            <Input
              {...register("shopNumber")}
              placeholder="e.g., Shop 45, Stall 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Floor</label>
            <Input
              {...register("shopFloor" as any)}
              placeholder="e.g., Ground Floor, 2nd Floor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Block</label>
            <Input
              {...register("shopBlock" as any)}
              placeholder="e.g., Block A, Plaza B"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Shop Address</label>
          <Input
            {...register("shopAddress")}
            placeholder="Full address for customers to find you"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Landmark</label>
          <Input
            {...register("landmark" as any)}
            placeholder="Nearby landmark for easy location"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("contactDetails.phone")}
              placeholder="08012345678"
              error={errors.contactDetails?.phone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              WhatsApp Number
            </label>
            <Input
              {...register("contactDetails.whatsapp")}
              placeholder="WhatsApp number (if different)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              {...register("contactDetails.email")}
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              {...register("contactDetails.website" as any)}
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Instagram</label>
            <Input
              {...register("contactDetails.instagram" as any)}
              placeholder="@yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Facebook</label>
            <Input
              {...register("contactDetails.facebook" as any)}
              placeholder="facebook.com/yourpage"
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Bank Details
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (For customers to make direct payments)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <Select
              value={watch("bankDetails.bankName") || ""}
              onChange={(value) => setValue("bankDetails.bankName", value, { shouldValidate: true })}
              options={[
                { value: "", label: "Select bank" },
                ...NIGERIAN_BANKS.map((bank) => ({ value: bank, label: bank })),
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Name</label>
            <Input
              {...register("bankDetails.accountName")}
              placeholder="Account holder name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Account Number
            </label>
            <Input
              {...register("bankDetails.accountNumber")}
              placeholder="10-digit account number"
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Operating Hours
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Opening Time</label>
            <Input
              type="time"
              {...register("operatingHours.openingTime" as any)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Closing Time</label>
            <Input
              type="time"
              {...register("operatingHours.closingTime" as any)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operating Days</label>
          <div className="flex flex-wrap gap-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input hover:bg-muted cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={day}
                    {...register("operatingHours.operatingDays" as any)}
                    className="rounded border-input"
                  />
                  <span className="text-sm">{day.slice(0, 3)}</span>
                </label>
              )
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">
          Product Categories
        </h3>
        <p className="text-sm text-muted-foreground">
          Select the categories of products you sell
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            "Electronics",
            "Fashion",
            "Phones",
            "Computers",
            "Accessories",
            "Home & Garden",
            "Health & Beauty",
            "Sports",
            "Food & Groceries",
            "Baby & Kids",
            "Automotive",
            "Books",
          ].map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input hover:bg-muted cursor-pointer"
            >
              <input
                type="checkbox"
                value={category}
                {...register("categories")}
                className="rounded border-input"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-border">
        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {initialData ? "Update Shop" : "Create Shop"}
        </Button>
      </div>
    </form>
  );
}