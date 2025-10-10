"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Chrome } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Account Created",
      description: "This is a placeholder. Backend not connected.",
    });
    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    toast({
      title: "Google Sign-In",
      description: "This is a placeholder. Backend not connected.",
    });
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-base text-slate-600">
          Get started with DocuFlow today
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">
            Or continue with email
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a password" {...field} />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-slate-500">
                  Must be 8+ characters with uppercase and number
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Create account
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
