"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User } from "lucide-react" // Assuming Lucide React is installed via Shadcn

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({ title: "Success", description: "Logged in successfully" })
        if (data.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/products")
        }
      } else {
        toast({ variant: "destructive", title: "Error", description: data.error })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 py-12 relative overflow-hidden">
      {/* Subtle background pattern or decoration */}
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080?text=Welcome+Back')] bg-cover bg-center opacity-5 mix-blend-multiply" />
      
      <Card className="w-full max-w-md relative z-10 border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-zinc-900/5 to-zinc-800/5 pb-8 pt-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-zinc-500 to-zinc-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-600">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pb-0">
            <div className="relative space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 pr-4 py-3 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400/50 transition-all duration-200 rounded-xl"
                />
              </div>
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-4 py-3 border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400/50 transition-all duration-200 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white hover:from-zinc-800 hover:to-zinc-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl font-semibold text-lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center space-y-2">
              <Link 
                href="/forgot-password" 
                className="text-sm text-zinc-500 hover:text-zinc-700 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-zinc-600">
                Don't have an account?{" "}
                <Link 
                  href="/signup/customer" 
                  className="font-semibold text-zinc-900 hover:text-zinc-700 transition-colors duration-200 underline underline-offset-2 decoration-zinc-300"
                >
                  Sign up as Customer
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}