
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Member"]),
});

type UserFormValues = z.infer<typeof userSchema>;

type AddUserDialogProps = {
  children: React.ReactNode;
  onAddUser: (user: UserFormValues) => void;
};

export function AddUserDialog({ children, onAddUser }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Member",
    },
  });

  const onSubmit = (data: UserFormValues) => {
    onAddUser(data);
    toast({
      title: "User Added",
      description: `${data.name} has been added to the workspace.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Invite a new user to your workspace and assign them a role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => form.setValue('role', value as "Admin" | "Member")} defaultValue={form.getValues('role')}>
                <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
