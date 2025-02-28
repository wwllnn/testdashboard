"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import TestScores from "@/components/TestScores";

export default function Home() {
  const { listenForAuthChanges, userUid } = useAuthStore();

  useEffect(() => {
    listenForAuthChanges();
  }, [listenForAuthChanges]);

  return (
    <div className="flex flex-col bg-gray-100 text-gray-900 font-sans">
      {/* Hero Section for Non-Logged-In Users */}
      {!userUid && (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-20 px-6">
          <h1 className="text-4xl font-bold mb-6">Welcome to Education One!</h1>
          <p className="text-xl mb-8">Track your test scores and improve with ease.</p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                Register
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Show Dashboard if Logged In */}
      {userUid && (
        <section className="container mx-auto py-16 px-6 text-center flex justify-center">
          <div className="bg-white max-w-4xl text-gray-800 p-8 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <div className="">
              <TestScores />
            </div>
            <div className="mt-6">
              <Link href="/test">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                  Go to Test Page
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {["Track Progress", "Get Insights", "Improve Faster"].map((feature, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 rounded-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{feature}</h3>
                <p className="text-gray-600">Our advanced analytics help you achieve better results.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold text-gray-800 hover:text-gray-900">How do I track my test scores?</AccordionTrigger>
              <AccordionContent className="text-gray-600 text-lg">Your test scores are automatically saved in your dashboard.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl font-semibold text-gray-800 hover:text-gray-900">Is this app free to use?</AccordionTrigger>
              <AccordionContent className="text-gray-600 text-lg">Yes! Our app is completely free to help students track and improve.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl font-semibold text-gray-800 hover:text-gray-900">How often are scores updated?</AccordionTrigger>
              <AccordionContent className="text-gray-600 text-lg">Scores update in real-time as you complete tests.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl font-semibold text-gray-800 hover:text-gray-900">Can I access my history?</AccordionTrigger>
              <AccordionContent className="text-gray-600 text-lg">Yes, you can view past test scores and trends in your dashboard.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="container mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-2xl hover:text-gray-400 transition duration-300"><FaFacebook /></a>
            <a href="#" className="text-2xl hover:text-gray-400 transition duration-300"><FaTwitter /></a>
            <a href="#" className="text-2xl hover:text-gray-400 transition duration-300"><FaInstagram /></a>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Your App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}