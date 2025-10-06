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
import { Chrome, Mail, Lock, ArrowRight, Sparkles, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Login Submitted",
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
    <div className="w-full space-y-8">
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
          Welcome Back!
        </h1>
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Sign in to continue your journey
        </p>
      </div>

      {/* Social Login */}
      <Button
        variant="outline"
        className="h-14 w-full border-2 border-blue-500 text-base font-bold text-blue-600 shadow-lg transition-all hover:scale-105 hover:border-blue-600 hover:bg-blue-50 hover:shadow-xl"
        onClick={handleGoogleSignIn}
      >
        <Chrome className="mr-3 h-6 w-6" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t-2 border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm font-bold uppercase">
          <span className="bg-white px-4 text-gray-500 dark:bg-gray-800">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-gray-700 dark:text-gray-300">
                  Email address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      placeholder="name@example.com"
                      className="h-[58px] border-2 border-gray-300 pl-20 text-base font-medium shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="font-semibold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-gray-700 dark:text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="h-[58px] border-2 border-gray-300 pl-20 text-base font-medium shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="font-semibold" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-2" />
              <label
                htmlFor="remember"
                className="text-base font-semibold leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-base font-bold text-blue-600 transition-colors hover:text-purple-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-16 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-purple-300"
          >
            Sign in to your account
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </form>
      </Form>

      <Card className="border-2 border-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-purple-900/20">
        <p className="text-center text-base font-semibold text-gray-700 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-black text-transparent hover:from-purple-600 hover:to-pink-600"
          >
            Create free account
          </Link>
        </p>
      </Card>

      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-lg dark:from-emerald-900/20 dark:to-teal-900/20">
        <p className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
          <Shield className="mr-1 inline h-4 w-4 text-emerald-600" />
          By signing in, you agree to our{" "}
          <Link href="/terms" className="font-bold text-emerald-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-bold text-emerald-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
