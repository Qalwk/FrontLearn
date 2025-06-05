import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "../../contexts/LanguageContext";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Mock users
const mockUsers = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-05-28",
  },
  {
    id: "user2",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-05-29",
  },
  {
    id: "user3",
    name: "James Smith",
    email: "james@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-04-15",
  },
  {
    id: "user4",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-05-30",
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-30",
  },
];

export function UsersManagement() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserAction = (action: string, user: any) => {
    // In a real app, these actions would call API endpoints
    console.log(`Action: ${action}, User ID: ${user.id}`);
    
    if (action === "edit") {
      setSelectedUser(user);
      setDialogOpen(true);
    } else if (action === "delete") {
      // Show confirmation dialog in real app
      alert(`User ${user.name} would be deleted in a real app.`);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1>{t("admin.users")}</h1>
        <Button onClick={() => {
          setSelectedUser(null);
          setDialogOpen(true);
        }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8" 
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction("edit", user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction("reset-password", user)}>
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction("delete", user)}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center p-4">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Dialog (Add/Edit) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? "Make changes to the user account here." 
                : "Fill in the details to create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                defaultValue={selectedUser?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                defaultValue={selectedUser?.email || ""}
                className="col-span-3"
              />
            </div>
            {!selectedUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="text-right">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right">
                Role
              </label>
              <select
                id="role"
                defaultValue={selectedUser?.role || "user"}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <select
                id="status"
                defaultValue={selectedUser?.status || "active"}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}