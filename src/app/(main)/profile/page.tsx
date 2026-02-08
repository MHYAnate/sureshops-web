"use client";

import { useAuth } from "@/hooks";
import { Card, Avatar, Button, Badge } from "@/components/ui";
import { Mail, Phone, Calendar, Edit } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={user.avatar}
            name={`${user.firstName} ${user.lastName}`}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <Badge variant={user.role === "vendor" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
                {user.isEmailVerified && (
                  <Badge variant="success" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <Link href="/profile/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Vendor CTA */}
      {user.role === "user" && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Become a Vendor</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start selling your products on SureShops and reach thousands of customers.
          </p>
          <Button asChild>
            <Link href="/vendor">Start Selling</Link>
          </Button>
        </Card>
      )}

      {user.role === "vendor" && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Vendor Dashboard</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage your shop, products, and view analytics.
          </p>
          <Button asChild>
            <Link href="/vendor/dashboard">Go to Dashboard</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}