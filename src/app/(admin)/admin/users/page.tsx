"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Input,
  Badge,
  Select,
  Modal,
  Avatar,
} from "@/components/ui";
import { LoadingState, Pagination } from "@/components/common";
import { adminService } from "@/services/admin.service";
import { Search, Trash2, Shield } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
  { value: "", label: "All Roles" },
  { value: "user", label: "User" },
  { value: "vendor", label: "Vendor" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search, roleFilter],
    queryFn: () =>
      adminService.getUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      adminService.changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setShowRoleModal(false);
      setSelectedUser(null);
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            options={ROLES}
            className="w-40"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {isLoading ? (
          <LoadingState />
        ) : data?.items && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatar}
                          name={`${user.firstName} ${user.lastName}`}
                          size="sm"
                        />
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          user.role === "super_admin"
                            ? "default"
                            : user.role === "admin"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.isActive ? "success" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Change role"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete user"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete ${user.firstName} ${user.lastName}?`
                              )
                            ) {
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No users found
          </div>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Change Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title="Change User Role"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p>
              Change role for{" "}
              <strong>
                {selectedUser.firstName} {selectedUser.lastName}
              </strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Current role:{" "}
              <Badge variant="outline">{selectedUser.role}</Badge>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.filter((r) => r.value && r.value !== selectedUser.role).map(
                (role) => (
                  <Button
                    key={role.value}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      changeRoleMutation.mutate({
                        id: selectedUser.id,
                        role: role.value,
                      })
                    }
                    disabled={changeRoleMutation.isPending}
                  >
                    {role.label}
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}