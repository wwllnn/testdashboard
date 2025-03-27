"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import TestScores from "@/components/TestScores";
import TestsInProgress from "@/components/TestsInProgress";

export default function Home() {
  const { listenForAuthChanges, userUid } = useAuthStore();

  useEffect(() => {
    listenForAuthChanges();
  }, [listenForAuthChanges]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Hero Section for Non-Logged-In Users */}
      {!userUid && (
        <section className="bg-[url('/backgroundlanding.jpg')] bg-cover text-white text-center py-32 px-6 flex">
          <div className="w-1/2"></div>
          <div className="w-[650px] bg-blue-700/90 rounded-2xl p-16 w-1/2 ml-20 border-4 border-gray-100">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Education One's Diagnostic Tool 🍎
            </h1>
            <p className="text-xl mb-8">
              Sign in to take a FREE test and review your strengths and weaknesses!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                  Sign In / Register
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Show Dashboard if Logged In */}
      {userUid && (
        <section className="container mx-auto py-16 px-6 text-center flex justify-center">
          <div className="bg-white max-w-4xl text-gray-800 p-8 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold mb-6">Digital SAT Diagnostic Tool</h1>
            <div className="">
            <h1 className="text-2xl font-bold mb-6 text-black">⌛️ Tests In Progress</h1>
            <TestsInProgress />
            <h1 className="text-2xl font-bold text-black">📊 Recent Test Scores</h1>
            <TestScores />
            
            </div>
            <div className="mt-6">
              <Link href="/test">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                  Go to Test Page 
                  <FaArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!userUid && (
      <section className="container mx-auto py-8 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-700">The Number One Place For SAT Prep</h2>
        <div className="flex justify-center gap-10">
          
          {/* Card 1: Track Progress */}
          <Card className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 rounded-xl max-w-[400px] cursor-default">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 ">📈 Crafted Questions</h3>
              <p className="text-gray-600">Written by a professional team with years of SAT Experience.</p>
            </CardContent>
          </Card>

          {/* Card 2: Get Insights */} 
          <Card className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 rounded-xl max-w-[400px] cursor-default">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🔎 Get Insights</h3>
              <p className="text-gray-600">Identify strengths and weaknesses with detailed analytics.</p>
            </CardContent>
          </Card>

          {/* Card 3: Improve Faster */}

        </div>
      </section>
      )}
    
      <section className="container mx-auto py-12 px-40">
      <a href="https://www.educate-one.com" target="_blank" rel="noopener noreferrer">
        <Card className="bg-white hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Improve Faster</h3>
              <p className="text-gray-600">Need more help? Visit us at educate-one.com or email us at william@educate-one.com! Our professional SAT team with decades of SAT experience are ready to answer any question and give you recommendations to boost your performance efficiently.</p>
            </CardContent>
        </Card>
      </a>
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
            <a href="https://www.instagram.com/educationonesugarland/" className="text-2xl hover:text-gray-400 transition duration-300"><FaInstagram /></a>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Education One. All rights reserved.</p>
          <a href="https://www.educate-one.com" className="text-2xl hover:text-gray-400 transition duration-300">Education One</a>
          </div>
      </footer>
    </div>
  );
}