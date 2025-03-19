"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import TestQuestion from './TestQuestion'
import TestBar from './TestBar'
import { sampletestdata } from '@/lib/data'
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { collection, addDoc, serverTimestamp, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import { useAuthStore } from '@/lib/store';
import { Fraction } from 'fraction.js';




import { useRouter } from 'next/navigation'

import { Button } from './ui/button'
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    
  } from "@/components/ui/dialog"
import { toast } from "sonner";



const TestContent = () => {

    const { selectedTest, setSelectedTest } = useAuthStore();
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(27).fill(null));
    const [answers2, setAnswers2] = useState(Array(sampletestdata[1].length).fill(null));
    const [answers3, setAnswers3] = useState(Array(sampletestdata[2].length).fill(null));
    const [answers4, setAnswers4] = useState(Array(sampletestdata[3].length).fill(null));

    const [missedQuestions, setMissedQuestions] = useState<number[]>([])
    

    const [module, setModule] = useState(0);
    const [score, setScore] = useState(0);
    const { user } = useAuth();

    const testId = 'Digital SAT Diagnostic';
    const router = useRouter();
    console.log(selectedTest)

    useEffect(() => {
        if (selectedTest) {
            setAnswers(selectedTest.answers || []);
            setAnswers2(selectedTest.answers2 || []);
            setAnswers3(selectedTest.answers3 || []);
            setAnswers4(selectedTest.answers4 || []);
        }     
        
        return () => {
            setAnswers(Array(27).fill(null))
            setAnswers2(Array(27).fill(null))
            setAnswers3(Array(22).fill(null))
            setAnswers4(Array(22).fill(null))
            setSelectedTest(null)
        };
    }, []);  // Will run when selectedTest changes


    const handleAnswer = (option: String) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = option;
        setAnswers(newAnswers);
    }

    const handleAnswer2 = (option: String) => {
        const newAnswers = [...answers2];
        newAnswers[currentQuestion] = option;
        setAnswers2(newAnswers);
    }

    const handleAnswer3 = (option: String) => {
        const newAnswers = [...answers3];
        newAnswers[currentQuestion] = option;
        setAnswers3(newAnswers);
    }

    const handleAnswer4 = (option: String) => {
        const newAnswers = [...answers4];
        newAnswers[currentQuestion] = option;
        setAnswers4(newAnswers);
    }  

    const totalScore = (scores: number[]) => {
        let totalScore = 0;
    
        let reading = Math.round((scores[1] * 11.11 + 200) / 10) * 10;
        if (reading > 800) reading = 800;
        let math = Math.round((scores[2] * 13.64 + 200) / 10) * 10;
        if (math > 800) math = 800;
    
        totalScore = math + reading;
    
        return totalScore;
      }
    
      const getReadingScore = (score: number) => {
      
        let reading = Math.round((score * 11.11) / 10) * 10  + 200;
        if (reading > 800) reading = 800;
    
        return reading;
      }
    
      const getMathScore = (score: number) => {
        let math = Math.floor((score * 13.64) / 10) * 10 + 200;
        if (math > 800) math = 800;
        return math;
      };
    
    const calculateScore = () => {
        const readingTopics: string[] = [];
        const mathTopics: string[] = [];
      
        const readingDiff: string[] = [];
        const mathDiff: string[] = [];

        let calculatedScore = 0;
        let mathScore = 0;
        let readingScore = 0;
        let correctQ = [];
        let missedQ: number[] = [];

        


        answers.forEach((a, index) => {
            if(answers[index] === sampletestdata[0][index].answer){
                calculatedScore++;
                readingScore++;
                correctQ.push(index);
            } else {
                missedQ.push(index);
                readingTopics.push(sampletestdata[0][index].topic);
                readingDiff.push(sampletestdata[0][index].difficulty);
            }
        })
        answers2.forEach((a, index) => {
            if(answers2[index] === sampletestdata[1][index].answer){
                calculatedScore++;
                readingScore++;
                correctQ.push(index);
            } else {
                missedQ.push(index);
                readingTopics.push(sampletestdata[1][index].topic);
                readingDiff.push(sampletestdata[1][index].difficulty);
            }
        })
        answers3.forEach((a, index) => {
            const correctAnswer = sampletestdata[2][index].answer;
        
            // If user's answer or correct answer is null, treat it as incorrect
            if (a === null || correctAnswer === null) {
                missedQ.push(index);
                mathTopics.push(sampletestdata[2][index].topic);
                mathDiff.push(sampletestdata[2][index].difficulty);
                return;
            }
        
            // If the answer is a letter (A, B, C, etc.), compare directly
            if (typeof a === 'string' && /^[A-Za-z]+$/.test(a)) {
                if (a === correctAnswer) {  
                    calculatedScore++;
                    mathScore++;
                    correctQ.push(index);
                } else {
                    missedQ.push(index);
                    mathTopics.push(sampletestdata[2][index].topic);
                    mathDiff.push(sampletestdata[2][index].difficulty);
                }
            } 
            // Convert both user input and correct answer to numbers for comparison
            else {
                try {
                    let userDecimal: number;
                    let correctDecimal: number;
        
                    // Function to convert a string input (fraction/decimal) to a number
                    const parseToDecimal = (value: string | number): number => {
                        if (typeof value === "string") {
                            return value.includes("/") ? new Fraction(value).valueOf() : parseFloat(value);
                        }
                        return value;
                    };
        
                    // Convert user input and correct answer
                    userDecimal = parseToDecimal(a);
                    correctDecimal = parseToDecimal(correctAnswer);
        
                    // Round both numbers to 3 decimal places
                    const roundedUserDecimal = Math.round(userDecimal * 1000) / 1000;
                    const roundedCorrectDecimal = Math.round(correctDecimal * 1000) / 1000;
        
                    // Compare the rounded decimals
                    if (roundedUserDecimal === roundedCorrectDecimal) {  
                        calculatedScore++;
                        mathScore++;
                        correctQ.push(index);
                    } else {
                        missedQ.push(index);
                        mathTopics.push(sampletestdata[2][index].topic);
                        mathDiff.push(sampletestdata[2][index].difficulty);
                    }
                } catch (error) {
                    console.error(`Invalid input: ${a} or ${correctAnswer}`);
                    missedQ.push(index); 
                    mathTopics.push(sampletestdata[2][index].topic);
                    mathDiff.push(sampletestdata[2][index].difficulty);
                }
            }
        });
        answers4.forEach((a, index) => {
            const correctAnswer = sampletestdata[3][index].answer;
            // If user's answer or correct answer is null, treat it as incorrect
            if (a === null || correctAnswer === null) {
                missedQ.push(index);
                mathTopics.push(sampletestdata[3][index].topic);
                mathDiff.push(sampletestdata[3][index].difficulty);
                return;
            }
        
            // If the answer is a letter (A, B, C, etc.), compare directly
            if (typeof a === 'string' && /^[A-Za-z]+$/.test(a)) {
                if (a === correctAnswer) {  
                    calculatedScore++;
                    mathScore++;
                    correctQ.push(index);
                } else {
                    missedQ.push(index);
                    mathTopics.push(sampletestdata[3][index].topic);
                    mathDiff.push(sampletestdata[3][index].difficulty);
                }
            } 
            // Convert both user input and correct answer to numbers for comparison
            else {
                try {
                    let userDecimal: number;
                    let correctDecimal: number;
        
                    // Function to convert a string input (fraction/decimal) to a number
                    const parseToDecimal = (value: string | number): number => {
                        if (typeof value === "string") {
                            return value.includes("/") ? new Fraction(value).valueOf() : parseFloat(value);
                        }
                        return value;
                    };
        
                    // Convert user input and correct answer
                    userDecimal = parseToDecimal(a);
                    correctDecimal = parseToDecimal(correctAnswer);
        
                    // Round both numbers to 3 decimal places
                    const roundedUserDecimal = Math.round(userDecimal * 1000) / 1000;
                    const roundedCorrectDecimal = Math.round(correctDecimal * 1000) / 1000;
        
                    // Compare the rounded decimals
                    if (roundedUserDecimal === roundedCorrectDecimal) {  
                        calculatedScore++;
                        mathScore++;
                        correctQ.push(index);
                    } else {
                        missedQ.push(index);
                        mathTopics.push(sampletestdata[3][index].topic);
                        mathDiff.push(sampletestdata[3][index].difficulty);
                    }
                } catch (error) {
                    console.error(`Invalid input: ${a} or ${correctAnswer}`);
                    missedQ.push(index); 
                    mathTopics.push(sampletestdata[3][index].topic);
                    mathDiff.push(sampletestdata[3][index].difficulty);
                }
            }
        });

        const reading = getReadingScore(readingScore);
        const math = getMathScore(mathScore);
        const total = reading + math;
        setMissedQuestions(missedQ);


        
        return [calculatedScore, readingScore, mathScore, reading, math, total];
    }
    

    const handleSubmit = async () => {
        const scores = calculateScore()
    
        try {
            if (!selectedTest) {
                // Create a new document
                const docRef = await addDoc(collection(db, "testScores"), { // Use addDoc instead of doc + setDoc
                    userId: user.uid,
                    name: user.displayName,
                    email: user.email,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: true,
                    missedQ: missedQuestions,
                });
                await updateDoc(docRef, { docId: docRef.id }); // Store doc ID inside the document
                console.log("New Doc Added:", docRef.id);

            } else {
                // Update existing document
                const docRef = doc(db, "testScores", selectedTest.docId);
                await updateDoc(docRef, {
                    userId: user.uid,
                    name: user.displayName,
                    email: user.email,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: true,
                    missedQ: missedQuestions,
                    docId: selectedTest.docId
                });
                console.log("Document updated successfully:", selectedTest.docId);
            }
            setAnswers(Array(27).fill(null))
            setAnswers2(Array(27).fill(null))
            setAnswers3(Array(27).fill(null))
            setAnswers4(Array(27).fill(null))

            setSelectedTest(null);
            toast.success("Test Saved");
            router.push("/");

        } catch (error) {
            console.error("Error saving document:", error);
        }
    }

    const handleSave = async () => {
        let scores = [0, 0, 0]; 
    
        try {
            console.log(selectedTest)
            if (!selectedTest) {
                // Create a new document
                const docRef = await addDoc(collection(db, "testScores"), { // Use addDoc instead of doc + setDoc
                    userId: user.uid,
                    name: user.displayName,
                    email: user.email,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: false,
                    missedQ: missedQuestions
                });    
                await updateDoc(docRef, { docId: docRef.id }); // Store doc ID inside the document
                const docSnap = await getDoc(docRef);

                console.log("New Doc Added:", docSnap.data());
                if (docSnap.exists()) {
                    await setSelectedTest(docSnap.data());
                }
                console.log(selectedTest)

            } else {
                // Update existing document
                const docRef = doc(db, "testScores", selectedTest.docId);
                await updateDoc(docRef, {
                    userId: user.uid,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: false,
                    missedQ: missedQuestions,
                    docId: selectedTest.docId
                });

                console.log("Document updated successfully:", selectedTest.docId);
            }
            toast.success("Test Saved");

        } catch (error) {
            console.error("Error saving document:", error);
        }
    };
    

    return (
        <div className='bg-gray-900 h-full'>
        <TestBar module={module}/>
        <div className='flex justify-center items-center'>
            <div className='flex justify-center mr-10'>
                <div className='justify-center align-center'>
                    {module == 0 && sampletestdata[0].map((item, index) =>
                    <Button onClick={() => setCurrentQuestion(index)} key={index} className={`inline-flex items-center justify-center w-8 h-8 border-2 
                    border-white rounded-full text-lg mx-2 text-white text-sm p-0 ${answers[index] != null ? 'bg-white text-gray-900' : ''}`}>
                        {index + 1}
                    </Button>
                    )}
                    {module == 1 && sampletestdata[1].map((item, index) =>
                    <Button onClick={() => setCurrentQuestion(index)} key={index} className={`inline-flex items-center justify-center w-8 h-8 border-2 
                    border-white rounded-full text-lg mx-2 text-white text-sm p-0 ${answers2[index] != null ? 'bg-white text-gray-900' : ''}`}>
                        {index + 1}
                    </Button>
                    )}
                    {module == 2 && sampletestdata[2].map((item, index) =>
                    <Button onClick={() => setCurrentQuestion(index)} key={index} className={`inline-flex items-center justify-center w-8 h-8 border-2 
                    border-white rounded-full text-lg mx-2 text-white text-sm p-0 ${answers3[index] != null ? 'bg-white text-gray-900' : ''}`}>
                        {index + 1}
                    </Button>
                    )}
                    {module == 3 && sampletestdata[3].map((item, index) =>
                    <Button onClick={() => setCurrentQuestion(index)} key={index} className={`inline-flex items-center justify-center w-8 h-8 border-2 
                    border-white rounded-full text-lg mx-2 text-white text-sm p-0 ${answers4[index] != null ? 'bg-white text-gray-900' : ''}`}>
                        {index + 1}
                    </Button>
                    )}
                </div>
            </div>
            <Button className='bg-gray-800 hover:bg-gray-700' onClick={handleSave}>Save Progress</Button>

        </div>

        <div>
            {module == 0 && <TestQuestion module={module} number={currentQuestion} answers={answers} handleA={handleAnswer}></TestQuestion>}
            {module == 1 && <TestQuestion module={module} number={currentQuestion} answers={answers2} handleA={handleAnswer2}></TestQuestion>}
            {module == 2 && <TestQuestion module={module} number={currentQuestion} answers={answers3} handleA={handleAnswer3}></TestQuestion>}
            {module == 3 && <TestQuestion module={module} number={currentQuestion} answers={answers4} handleA={handleAnswer4}></TestQuestion>}

            <div className='absolute left-1/2 -translate-x-1/2'>
                {(currentQuestion != 0) &&
                    <Button className='w-40 py-6 text-xl mr-1 bg-gray-800 hover:bg-gray-700' onClick={() => setCurrentQuestion(prev => prev - 1)}><FaLongArrowAltLeft />
                    Previous</Button>
                }
                {(currentQuestion != sampletestdata[module].length - 1) &&
                    <Button className='w-40 py-6 text-xl ml-1 bg-gray-800 hover:bg-gray-700' onClick={() => setCurrentQuestion(prev => prev + 1)}>Next<FaLongArrowAltRight />
                    </Button>
                }
                {(module == 0 && currentQuestion == sampletestdata[module].length - 1) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='w-40 py-6 text-xl ml-1 bg-gray-800 hover:bg-gray-700'>Next Module<FaLongArrowAltRight />
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Directions</DialogTitle>
                            <DialogDescription className='py-5 text-slate-700'>
                            You cannot return. Are you ready to go to the second reading & writing module?
            
                            </DialogDescription>
                            <DialogClose asChild>
                                <Button onClick={() => {setModule(prev => prev + 1); setCurrentQuestion(0)}}>Go To Module 2</Button>
                            </DialogClose>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }
                {(module == 1 && currentQuestion == sampletestdata[module].length - 1) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='w-40 py-6 text-xl ml-1 bg-gray-800 hover:bg-gray-700'>Next Module<FaLongArrowAltRight />
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Directions</DialogTitle>
                            <DialogDescription className='py-5 text-slate-700'>
                            You cannot return. Are you ready to go to the math section?
            
                            </DialogDescription>
                            <DialogClose asChild>
                                <Button onClick={() => {setModule(prev => prev + 1); setCurrentQuestion(0)}}>Go To Math Section</Button>
                            </DialogClose>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }
                {(module == 2 && currentQuestion == sampletestdata[module].length - 1) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='w-40 py-6 text-xl ml-1 bg-gray-800 hover:bg-gray-700'>Next Module<FaLongArrowAltRight />
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Directions</DialogTitle>
                            <DialogDescription className='py-5 text-slate-700'>
                            You cannot return. Are you ready to go to the second math module?

                            </DialogDescription>
                            <DialogClose asChild>
                                <Button onClick={() => {setModule(prev => prev + 1); setCurrentQuestion(0)}}>Go To Module 2</Button>
                            </DialogClose>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }
                {(module == 3 && currentQuestion == sampletestdata[module].length - 1) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='w-40 py-6 text-xl ml-1 bg-gray-800 hover:bg-gray-700'>Submit Test<FaLongArrowAltRight />
                        </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Directions</DialogTitle>
                            <DialogDescription className='py-5 text-slate-700'>
                            You cannot return. Are you ready to submit your test?

                            </DialogDescription>
                            <DialogClose asChild>
                                <Button className="" onClick={handleSubmit}>Submit Test</Button>
                            </DialogClose>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }

            </div>
 
        </div>

        </div>
  )
}

export default TestContent