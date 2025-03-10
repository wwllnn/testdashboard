"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import TestQuestion from './TestQuestion'
import TestBar from './TestBar'
import { sampletestdata } from '@/lib/data'
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import { collection, addDoc, serverTimestamp, setDoc, doc, updateDoc } from 'firebase/firestore'
import { useAuthStore } from '@/lib/store';


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

    const { selectedTest } = useAuthStore();
    
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(27).fill(null));
    const [answers2, setAnswers2] = useState(Array(sampletestdata[1].length).fill(null));
    const [answers3, setAnswers3] = useState(Array(sampletestdata[2].length).fill(null));
    const [answers4, setAnswers4] = useState(Array(sampletestdata[3].length).fill(null));
    const [currentDoc, setCurrentDoc] = useState('');

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
            setCurrentDoc(selectedTest.docId)
        }
    }, [selectedTest]);  // Will run when selectedTest changes

    console.log(currentDoc)


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
    
    const calculateScore = () => {
        let calculatedScore = 0;
        let mathScore = 0;
        let readingScore = 0;
        let correctQ = [];
        let missedQ = [];


        answers.forEach((a, index) => {
            if(answers[index] === sampletestdata[0][index].answer){
                calculatedScore++;
                readingScore++;
                correctQ.push(index);
            } else {
                missedQ.push(index);
            }
        })
        answers2.forEach((a, index) => {
            if(answers2[index] === sampletestdata[1][index].answer){
                calculatedScore++;
                readingScore++;
                correctQ.push(index);
            } else {
                missedQ.push(index);
            }
        })
        answers3.forEach((a, index) => {
            if(answers3[index] === sampletestdata[2][index].answer){
                calculatedScore++;
                mathScore++
                correctQ.push(index);
            } else {
                missedQ.push(index);
            }
        })
        answers4.forEach((a, index) => {
            if(answers4[index] === sampletestdata[3][index].answer){
                calculatedScore++;
                mathScore++;
                correctQ.push(index);
            } else {
                missedQ.push(index);
            }
        })
        
        return [calculatedScore, readingScore, mathScore];
    }
    

    const handleSubmit = async () => {
        const scores = calculateScore()
        console.log(currentDoc)
        try {
            if (!selectedTest?.docId){
                const docRef = doc(collection(db, "testScores")); // Reference with custom ID
                await setDoc(docRef, {
                    userId: user.uid,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: true,
                }); // Add or overwrite document
                await updateDoc(docRef, { docId: docRef.id }); // Now docID exists
                setCurrentDoc(docRef.id);
                console.log("Document added with ID:", currentDoc);
            } else {
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
                    complete: true,
                    docId: docRef.id
                })

                console.log("Document updated successfully:", currentDoc);
            }

            router.push('/');
            
          } catch (error) {
            console.error("Error adding document:", error);
          }
    }

    const handleSave = async () => {
        let scores = [0, 0, 0]; 
        console.log("Current Doc ID:", currentDoc);
    
        try {
            if (!selectedTest?.docId) {
                // Create a new document
                const docRef = await addDoc(collection(db, "testScores"), { // Use addDoc instead of doc + setDoc
                    userId: user.uid,
                    date: serverTimestamp(),
                    answers,
                    answers2,
                    answers3,
                    answers4,
                    scores,
                    test: 'SAT 1',
                    complete: false,
                });
    
                await updateDoc(docRef, { docId: docRef.id }); // Store doc ID inside the document
                setCurrentDoc(docRef.id); // Update state
                console.log("Document added with ID:", docRef.id);
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
                            <Button className='w-40 py-6 text-xl ml-1'>Next Module<FaLongArrowAltRight />
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
                            <Button className='w-40 py-6 text-xl ml-1'>Next Module<FaLongArrowAltRight />
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
                            <Button className='w-40 py-6 text-xl ml-1'>Next Module<FaLongArrowAltRight />
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