"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, Button } from "@/components/ui";
import { adminService } from "@/services/admin.service";
import toast from "react-hot-toast";
import { Database, RefreshCw, Shield, Server } from "lucide-react";

export default function AdminSettingsPage() {
  const seedAdminsMutation = useMutation({
    mutationFn: () => adminService.seedAdmins(),
    onSuccess: () => toast.success("Admin users seeded successfully"),
    onError: () => toast.error("Failed to seed admin users"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          System configuration and maintenance
        </p>
      </div>

      {/* Database Seeding */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Seeding
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Initialize the database with default data. Safe to run multiple times
          — existing records are skipped.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => seedAdminsMutation.mutate()}
            disabled={seedAdminsMutation.isPending}
          >
            {seedAdminsMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Seed Admin Users
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Default Credentials</h3>
          <div className="text-xs text-muted-foreground space-y-1 font-mono">
            <p>Super Admin: superadmin@sureshops.com / SuperAdmin@123!</p>
            <p>Admin: admin@sureshops.com / Admin@123!</p>
            <p>Vendor: vendor@sureshops.com / Vendor@123!</p>
            <p>User: user@sureshops.com / User@123!</p>
          </div>
        </div>
      </Card>

      {/* App Info */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Server className="h-5 w-5" />
          Application Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Version</span>
            <p className="font-medium">1.0.0 (MVP)</p>
          </div>
          <div>
            <span className="text-muted-foreground">Environment</span>
            <p className="font-medium">
              {process.env.NODE_ENV || "development"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-muted-foreground">API URL</span>
            <p className="font-medium font-mono text-xs break-all">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}