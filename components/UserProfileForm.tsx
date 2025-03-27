"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { toast } from "sonner";

type FormData = {
  zipCode: string;
  fullName: string;
};

interface UserProfileFormProps {
  onComplete: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onComplete }) => {
  const { user, userData, refreshUserData } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    zipCode: userData?.zipCode || "",
    fullName: userData?.fullName || "",
  });

  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email,
        updatedAt: new Date(),
      });

      await refreshUserData();
      toast.success("Profile updated successfully!");
      onComplete();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 shadow-xl border">
      <CardHeader>
        <CardTitle className="text-xl">
                <p>Before you continue, please complete your profile.
                </p></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="e.g. 90210"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "See Score"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
