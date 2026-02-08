"use client";

import { useState } from "react";
import { Card, Button } from "@/components/ui";
import { LoadingState } from "@/components/common";
import { VendorForm } from "@/components/forms/vendor-form";
// import { ImageUpload } from "@/components/common/image-upload";
import { useMyShop, useUpdateVendor } from "@/hooks";
import { uploadService } from "@/services";
import toast from "react-hot-toast";

export default function VendorSettingsPage() {
  const { data: shop, isLoading, refetch } = useMyShop();
  const updateVendor = useUpdateVendor();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingEntrance, setUploadingEntrance] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  const handleSubmit = async (data: any) => {
    await updateVendor.mutateAsync({ id: shop.id, data });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const result = await uploadService.uploadShopLogo(file);
      await updateVendor.mutateAsync({
        id: shop.id,
        data: { shopImages: { ...shop.shopImages, logo: result.url } },
      });
      refetch();
      toast.success("Logo updated successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleEntranceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEntrance(true);
    try {
      const result = await uploadService.uploadShopEntrance(file);
      await updateVendor.mutateAsync({
        id: shop.id,
        data: { shopImages: { ...shop.shopImages, entrancePhoto: result.url } },
      });
      refetch();
      toast.success("Entrance photo updated successfully");
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploadingEntrance(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shop Settings</h1>
        <p className="text-muted-foreground">
          Manage your shop information and appearance
        </p>
      </div>

      {/* Shop Images */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Shop Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Shop Logo</label>
            <div className="relative aspect-square max-w-[200px] rounded-lg overflow-hidden bg-muted">
              {shop.shopImages?.logo ? (
                <img
                  src={shop.shopImages.logo}
                  alt="Shop logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🏪
                </div>
              )}
            </div>
            <label className="mt-2 inline-block">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingLogo}
                asChild
              >
                <span>
                  {uploadingLogo ? "Uploading..." : "Change Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </span>
              </Button>
            </label>
          </div>

          {/* Entrance Photo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Shop Entrance Photo
            </label>
            <div className="relative aspect-video max-w-[300px] rounded-lg overflow-hidden bg-muted">
              {shop.shopImages?.entrancePhoto ? (
                <img
                  src={shop.shopImages.entrancePhoto}
                  alt="Shop entrance"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  📷
                </div>
              )}
            </div>
            <label className="mt-2 inline-block">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingEntrance}
                asChild
              >
                <span>
                  {uploadingEntrance ? "Uploading..." : "Change Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEntranceUpload}
                    className="hidden"
                  />
                </span>
              </Button>
            </label>
          </div>
        </div>
      </Card>

      {/* Shop Details Form */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Shop Details</h2>
        <VendorForm
          initialData={{
            businessName: shop.businessName,
            businessDescription: shop.businessDescription,
            vendorType: shop.vendorType,
            stateId: shop.stateId,
            areaId: shop.areaId,
            marketId: shop.marketId,
            shopNumber: shop.shopNumber,
            shopAddress: shop.shopAddress,
            contactDetails: shop.contactDetails,
            bankDetails: shop.bankDetails,
            categories: shop.categories,
          }}
          onSubmit={handleSubmit}
          isLoading={updateVendor.isPending}
        />
      </Card>
    </div>
  );
}