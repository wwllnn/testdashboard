import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import Link from 'next/link';

type TestBarProps = {
  module: number;
};

// Define time limits (in seconds) for each module
const MODULE_TIME_LIMITS: { [key: number]: number } = {
  0: 11 * 60 + 11, // Module 0: 11 minutes and 11 seconds
  1: 15 * 60,      // Module 1: 15 minutes
  2: 20 * 60,      // Module 2: 20 minutes
  3: 10 * 60,      // Module 3: 10 minutes
};

const TestBar: React.FC<TestBarProps> = ({ module }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true); // State to control dialog visibility
  const [timeLeft, setTimeLeft] = useState(MODULE_TIME_LIMITS[module] || 0); // Timer state in seconds

  // Reset timer when module changes
  useEffect(() => {
    setTimeLeft(MODULE_TIME_LIMITS[module] || 0);
  }, [module]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timeLeft into MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Exit confirmation dialog
  const handleExit = () => {
    const confirmExit = window.confirm("Are you sure you want to exit without saving?");
    if (confirmExit) {
      window.location.href = "/"; // Redirect to home
    }
  };

  return (
    <>
      <div className='flex justify-between items-center px-10 py-2 mb-4 text-white bg-blue-900'>
        <div>
          <h1 className='py-2 text-lg font-semibold'>
            Section 1, Module {module + 1}: Reading and Writing
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
                Directions
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Directions</DialogTitle>
                <DialogDescription className='py-5 text-slate-700'>
                  The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).
                </DialogDescription>
                <DialogDescription className='text-slate-700'>
                  All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Timer */}
        <div className='absolute left-1/2 transform -translate-x-1/2 text-xl font-bold'>
          {formatTime(timeLeft)}
        </div>

        {/* Exit Button with Confirmation */}
        <Button
          onClick={handleExit}
          className="text-white bg-transparent hover:bg-blue-700 border-2 border-solid"
          aria-label="Exit without saving"
        >
          Exit without saving
        </Button>
      </div>
    </>
  );
};

export default TestBar;