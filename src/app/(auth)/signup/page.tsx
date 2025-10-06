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
import { Chrome, Mail, Lock, User, ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
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
    <div className="w-full space-y-8">
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-4">
            <Rocket className="h-10 w-10 text-white" />
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-base font-bold text-white">
          <Sparkles className="mr-1 h-4 w-4" />
          Start Free - No Credit Card Required
        </Badge>
        <h1 className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
          Join 50,000+ Winners
        </h1>
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Create your account and start automating
        </p>
      </div>

      {/* Social Login */}
      <Button
        variant="outline"
        className="h-14 w-full border-2 border-blue-500 text-base font-bold text-blue-600 shadow-lg transition-all hover:scale-105 hover:border-blue-600 hover:bg-blue-50 hover:shadow-xl"
        onClick={handleGoogleSignIn}
      >
        <Chrome className="mr-3 h-6 w-6" />
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t-2 border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm font-bold uppercase">
          <span className="bg-white px-4 text-gray-500 dark:bg-gray-800">
            Or sign up with email
          </span>
        </div>
      </div>

      {/* Signup Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-gray-700 dark:text-gray-300">
                  Full name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <Input
                      placeholder="John Doe"
                      className="h-[58px] border-2 border-gray-300 pl-20 text-base font-medium shadow-md focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
                      placeholder="Create a strong password"
                      className="h-[58px] border-2 border-gray-300 pl-20 text-base font-medium shadow-md focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="font-semibold" />
                <p className="mt-2 text-sm font-semibold text-gray-600">
                  Must be 8+ characters with uppercase letter and number
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-4 space-y-0 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1 border-2"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-black text-transparent hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-black text-transparent hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage className="font-semibold" />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-16 w-full bg-gradient-to-r from-orange-600 to-red-600 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 hover:from-orange-700 hover:to-red-700 hover:shadow-red-300"
          >
            Create your free account
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </form>
      </Form>

      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 shadow-lg dark:from-purple-900/20 dark:to-pink-900/20">
        <p className="text-center text-base font-semibold text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-black text-transparent hover:from-blue-600 hover:to-purple-600"
          >
            Sign in here
          </Link>
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-100 to-cyan-100 p-4 text-center shadow-lg dark:from-blue-900/30 dark:to-cyan-900/30">
          <p className="text-2xl font-black text-blue-600">Free</p>
          <p className="text-sm font-bold text-gray-600">Forever Plan</p>
        </Card>
        <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 to-teal-100 p-4 text-center shadow-lg dark:from-emerald-900/30 dark:to-teal-900/30">
          <p className="text-2xl font-black text-emerald-600">No</p>
          <p className="text-sm font-bold text-gray-600">Credit Card</p>
        </Card>
        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 p-4 text-center shadow-lg dark:from-purple-900/30 dark:to-pink-900/30">
          <p className="text-2xl font-black text-purple-600">2 min</p>
          <p className="text-sm font-bold text-gray-600">Setup Time</p>
        </Card>
      </div>
    </div>
  );
}
