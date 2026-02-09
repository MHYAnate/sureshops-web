"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks";
import { Card, Button, Input, Avatar } from "@/components/ui";
import { authService, uploadService } from "@/services";
import { useAuthStore } from "@/store";
import { Camera, Save } from "lucide-react";
import toast from "react-hot-toast";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Valid phone number required"),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const result = await uploadService.uploadProductImage(file);
      const updated = await authService.updateProfile({ avatar: result.url } as any);
      setUser(updated);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Avatar */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={user.avatar}
              name={`${user.firstName} ${user.lastName}`}
              size="xl"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-muted-foreground">
              {uploadingAvatar ? "Uploading..." : "Click the camera to change"}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Personal Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name
              </label>
              <Input {...register("firstName")} error={errors.firstName?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <Input {...register("lastName")} error={errors.lastName?.message} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={user.email} disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input {...register("phone")} error={errors.phone?.message} />
          </div>

          <Button type="submit" isLoading={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}