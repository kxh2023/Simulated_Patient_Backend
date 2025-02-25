import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        throw error;
      }
      
      // If sign-in was successful
      if (data.user) {
        // Navigate to home page
        navigate("/home");
      }
    } catch (error: any) {
      console.error('Error during sign in:', error);
      setErrors({
        form: error.message || 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f5f5] p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-[2.5rem] font-light text-black">Simulated Patients</h1>
            <p className="text-2xl text-black font-light">Welcome Back</p>
          </div>

          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.form}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-normal">
                Email address
              </Label>
              <Input 
                id="email" 
                type="email" 
                className="border-gray-300 bg-white" 
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-normal">
                Password
              </Label>
              <Input 
                id="password" 
                type="password" 
                className="border-gray-300 bg-white" 
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#3B7534] hover:bg-[#2f5c29] text-white font-normal py-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%202.23.05%E2%80%AFPM-4WIoMKd1fCcpSj9bxKroswjCnDmasi.png"
          alt="Doctor with patient"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}