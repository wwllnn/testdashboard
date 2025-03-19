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
  0: 32 * 60, // Module 0: 11 minutes and 11 seconds
  1: 32 * 60,      // Module 1: 15 minutes
  2: 35 * 60,      // Module 2: 20 minutes
  3: 35 * 60,      // Module 3: 10 minutes
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
    const confirmExit = window.confirm("Please make sure you have clicked Save Progress if you wish to save before you exit. ");
    if (confirmExit) {
      window.location.href = "/"; // Redirect to home
    }
  };

  return (
    <>
      <div className='flex justify-between items-center px-10 py-2 mb-4 text-white bg-gray-900'>
        <div>
          {module == 0 && ( <h1 className='py-2 text-lg font-semibold'>
            Section 1, Module 1: Reading and Writing
          </h1>)}
          {module == 1 && ( <h1 className='py-2 text-lg font-semibold'>
            Section 1, Module 2: Reading and Writing
          </h1>)}
          {module == 2 && ( <><h1 className='py-2 text-lg font-semibold'>
            Section 2, Module 1: Math
          </h1>

          </>)}
          {module == 3 && ( <h1 className='py-2 text-lg font-semibold'>
            Section 2, Module 2: Math
          </h1>)}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
                Directions
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-2xl'>Directions</DialogTitle>
                {(module < 2) && <><DialogDescription className='py-5 text-slate-700 text-md'>
                  The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).
                </DialogDescription>
                
                <DialogDescription className='text-slate-700 text-lg'>
                  All questions in this section are multiple-choice with four answer choices. Each question has a single best answer. You have 32 minutes for this section.
                </DialogDescription></>}
                {(module >= 2) && (
  <DialogDescription className="py-5 text-slate-700 text-md">
    The questions in this section address a number of important math skills.<br /><br />
    Use of a physical or computer calculator is permitted for all questions. A reference sheet, graphing calculator, and these directions can be accessed throughout the test.<br /><br />
    
    Unless otherwise indicated:<br />
    - All variables and expressions represent real numbers.<br />
    - Figures provided are drawn to scale.<br />
    - All figures lie in a plane.<br /><br />

    For multiple-choice questions, solve each problem and choose the correct answer from the choices provided. Each multiple-choice question has a single correct answer.<br /><br />

    For student-produced response questions, solve each problem and enter your answer as described below.<br /><br />

    - If you find more than one correct answer, enter only one answer.<br />
    - You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.<br />
    - If your answer is a fraction that doesn’t fit in the provided space, enter the decimal equivalent.<br />
    - If your answer is a decimal that doesn’t fit in the provided space, enter it by truncating or rounding at the fourth digit.<br />
    - If your answer is a mixed number, enter it as an improper fraction (7/2) or its decimal equivalent (3.5).<br />
    - Don’t enter symbols such as a percent sign, comma, or dollar sign. <br />

    You have 35 minutes for this section.
  </DialogDescription>
)}


              </DialogHeader>
            </DialogContent>
          </Dialog>

          {module > 1 && <a href="https://www.desmos.com/calculator" target="_blank" rel="noopener noreferrer">
            <Button className='border-2 ml-2'>Graphing Calculator</Button>
          </a>}
        </div>

        {/* Timer */}
        <div className='absolute left-1/2 transform -translate-x-1/2 text-xl font-bold'>
          {formatTime(timeLeft)}
        </div>

        {/* Exit Button with Confirmation */}
        <Button
          onClick={handleExit}
          className="text-white bg-transparent hover:bg-red-700 border-2 border-solid"
          aria-label="Exit without saving"
        >
          Exit to Home
        </Button>
      </div>
    </>
  );
};

export default TestBar;