import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { Toaster, toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }

    setSignupLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.error("All fields are required");
      return;
    }
    setLoginLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: user.email.trim(),
        password: user.password.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-blue-500">DataMart</h1>
          </div>
          <p className="text-gray-600">Premium datasets for your business</p>
        </div>

        <Card className="shadow-md">
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        onChange={handleChange}
                        value={user.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="********"
                        name="password"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        onChange={handleChange}
                        value={user.password}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    onClick={handleLogin}
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Loading..." : "Login"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        onChange={handleChange}
                        value={user.name}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        name="email"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        onChange={handleChange}
                        value={user.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        name="password"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                        onChange={handleChange}
                        value={user.password}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                    onClick={handleSignup}
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Loading..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Auth;
