"use client";
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Check, X } from 'lucide-react';
import { sampletestdata, sampletopics, diff } from '@/lib/data';
import { difference } from 'next/dist/build/utils';
import { Bree_Serif } from 'next/font/google';
import { CiSaveDown2 } from "react-icons/ci";
import { useState } from 'react';
import Fraction from 'fraction.js';


const breeSerif = Bree_Serif({
  subsets: ['latin'],
  weight: '400', // Available weight for Bree Serif
});

const Score = () => {
  const { selectedTest } = useAuthStore();
  const router = useRouter();
  const [isScrollable, setIsScrollable] = useState(true);
  const [showPercentages, setShowPercentages] = useState(false);




  useEffect(() => {
    if (!selectedTest) {
      router.push('/'); // Redirect if no test is selected
    }
  }, [selectedTest, router]);

  if (!selectedTest) return <p className="text-center mt-5">Loading test details...</p>;

  const readingTopics: string[] = [];
  const mathTopics: string[] = [];

  const readingDiff: string[] = [];
  const mathDiff: string[] = [];

  const readingTopicsMap = new Map();
  const mathTopicsMap =  new Map();

  const readingDiffMap = new Map();
  const mathDiffMap = new Map();

  const wrongAnswers: any[] = [];
  const wrongAnswers2: any[] = [];
  const wrongAnswers3: any[] = [];
  const wrongAnswers4: any[] = [];


  sampletestdata[0].forEach((q) => {
    readingTopicsMap.set(q.topic, (readingTopicsMap.get(q.topic) || 0) + 1);
    readingDiffMap.set(q.difficulty, (readingDiffMap.get(q.difficulty) || 0) + 1)
  });

  sampletestdata[1].forEach((q) => {
    readingTopicsMap.set(q.topic, (readingTopicsMap.get(q.topic) || 0) + 1);
    readingDiffMap.set(q.difficulty, (readingDiffMap.get(q.difficulty) || 0) + 1)
  });

  
  sampletestdata[2].forEach((q) => {
    mathTopicsMap.set(q.topic, (mathTopicsMap.get(q.topic) || 0) + 1);
    mathDiffMap.set(q.difficulty, (mathDiffMap.get(q.difficulty) || 0) + 1)

  });

  sampletestdata[3].forEach((q) => {
    mathTopicsMap.set(q.topic, (mathTopicsMap.get(q.topic) || 0) + 1);
    mathDiffMap.set(q.difficulty, (mathDiffMap.get(q.difficulty) || 0) + 1)
  });

  //array of topics of missed questions
  selectedTest.answers.forEach((item: string, index: number) => {
    if (sampletestdata[0][index].answer != selectedTest.answers[index]) {
      readingTopics.push(sampletestdata[0][index].topic);
      readingDiff.push(sampletestdata[0][index].difficulty);
      console.log(selectedTest.answers[index]);
      wrongAnswers.push([index, selectedTest.answers[index]]);
    }
  });

  console.log(wrongAnswers)


  selectedTest.answers2.forEach((item: string, index: number) => {
    if (sampletestdata[1][index].answer != selectedTest.answers2[index]) {
      readingTopics.push(sampletestdata[1][index].topic);
      readingDiff.push(sampletestdata[1][index].difficulty);
      wrongAnswers2.push([index+27, selectedTest.answers2[index]]);
    }
  });


            selectedTest.answers3.forEach((a:any, index: number) => {
              const correctAnswer = sampletestdata[2][index].answer;
          
              // If user's answer or correct answer is null, treat it as incorrect
              if (a === null || correctAnswer === null) {
                  mathTopics.push(sampletestdata[2][index].topic);
                  mathDiff.push(sampletestdata[2][index].difficulty);
                  wrongAnswers3.push([index+54, selectedTest.answers3[index]]);
                  return;
              }
          
              // If the answer is a letter (A, B, C, etc.), compare directly
              if (typeof a === 'string' && /^[A-Za-z]+$/.test(a)) {
                  if (a != correctAnswer) {  
                    mathTopics.push(sampletestdata[2][index].topic);
                    mathDiff.push(sampletestdata[2][index].difficulty);
                    wrongAnswers3.push([index+54, selectedTest.answers3[index]]);
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
                      if (roundedUserDecimal != roundedCorrectDecimal) {  
                        mathTopics.push(sampletestdata[2][index].topic);
                        mathDiff.push(sampletestdata[2][index].difficulty);
                        wrongAnswers3.push([index+54, selectedTest.answers3[index]]);
                      } 
                  } catch (error) {
                      console.error(`Invalid input: ${a} or ${correctAnswer}`);
                      mathTopics.push(sampletestdata[2][index].topic);
                      mathDiff.push(sampletestdata[2][index].difficulty);
                      wrongAnswers3.push([index+54, selectedTest.answers3[index]]);
                  }
              }
          })
          selectedTest.answers4.forEach((a:any, index:number) => {
              const correctAnswer = sampletestdata[3][index].answer;
              // If user's answer or correct answer is null, treat it as incorrect
              if (a === null || correctAnswer === null) {
                  mathTopics.push(sampletestdata[3][index].topic);
                  mathDiff.push(sampletestdata[3][index].difficulty);
                  wrongAnswers4.push([index+76, selectedTest.answers4[index]]);
                  return;
              }
          
              // If the answer is a letter (A, B, C, etc.), compare directly
              if (typeof a === 'string' && /^[A-Za-z]+$/.test(a)) {
                  if (a != correctAnswer) {  
                      mathTopics.push(sampletestdata[3][index].topic);
                      mathDiff.push(sampletestdata[3][index].difficulty);
                      wrongAnswers4.push([index+76, selectedTest.answers4[index]]);
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
                      if (roundedUserDecimal != roundedCorrectDecimal) {  
                        mathTopics.push(sampletestdata[3][index].topic);
                        mathDiff.push(sampletestdata[3][index].difficulty);
                        wrongAnswers4.push([index+76, selectedTest.answers4[index]]);
                      } 
                  } catch (error) {
                      console.error(`Invalid input: ${a} or ${correctAnswer}`);
                      mathTopics.push(sampletestdata[3][index].topic);
                      mathDiff.push(sampletestdata[3][index].difficulty);
                      wrongAnswers4.push([index+76, selectedTest.answers4[index]]);
                  }
              }
          });


  //get topic and difficulty totals, reading and math




  //get diff totals
  const wrongReadingDiffMap = new Map(readingDiffMap);

  for (const difficulty of readingDiff) {
    wrongReadingDiffMap.set(difficulty, wrongReadingDiffMap.get(difficulty) - 1);
  }

  const wrongMathDiffMap = new Map(mathDiffMap);
  for (const difficulty of mathDiff) {
    wrongMathDiffMap.set(difficulty, wrongMathDiffMap.get(difficulty) - 1);
  }


  // get topics

  const wrongReadingTopicsMap = new Map(readingTopicsMap);
  for (const topic of readingTopics) {
    wrongReadingTopicsMap.set(topic, wrongReadingTopicsMap.get(topic) - 1);
  }

  const wrongMathTopicsMap = new Map(mathTopicsMap);
  for (const topic of mathTopics) {
    wrongMathTopicsMap.set(topic, wrongMathTopicsMap.get(topic) - 1);
  }

  const zippedReadingTopicsMap = new Map<string, [number, number]>(
    [...readingTopicsMap.keys()]
      .filter(key => wrongReadingTopicsMap.has(key))
      .map(key => [key, [readingTopicsMap.get(key)!, wrongReadingTopicsMap.get(key)!]])
  );

  console.log(zippedReadingTopicsMap)

  
  const zippedMathTopicsMap = new Map<string, [number, number]>(
    [...mathTopicsMap.keys()]
      .filter(key => wrongMathTopicsMap.has(key))
      .map(key => [key, [mathTopicsMap.get(key)!, wrongMathTopicsMap.get(key)!]])
  );



  function getSatPercentile(score: number) {
    // Adjusted SAT distribution stats
    const mean = 1060;  // Slightly raised mean to lower percentiles overall
    const stdDev = 240; // Increased standard deviation to spread scores out
  
    // Calculate z-score
    const z = (score - mean) / stdDev;
  
    // Convert z-score to percentile
    let percentile = normalCDF(z) * 100;
  
    // Lower percentiles further and ensure 1600 stays at 99%
    if (score >= 1600) return 99;
    if (score >= 1550) return Math.max(percentile - 5, 96);
    if (score >= 1500) return Math.max(percentile - 7, 92);
    if (score >= 1400) return Math.max(percentile - 10, 85);
    if (score >= 1300) return Math.max(percentile - 12, 78);
    if (score >= 1200) return Math.max(percentile - 14, 68);
    if (score >= 1100) return Math.max(percentile - 16, 52);
    if (score >= 1000) return Math.max(percentile - 18, 32);
    if (score >= 900) return Math.max(percentile - 20, 18);
    if (score >= 800) return Math.max(percentile - 22, 7);
    return Math.max(percentile - 23, 1); // Floor it at 1%
  }
  
  // Normal CDF approximation
  function normalCDF(z: number) {
    return (1 + erf(z / Math.SQRT2)) / 2;
  }
  
  // Error function approximation
  function erf(x: number) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
  
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
  
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
    return sign * y;
  }

  const calculatePercentage = (correct: number, total: number) => {
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };
  
  

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 ${breeSerif.className}`}>
      <div className='flex justify-between'>
        <Button variant="outline" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <Button className='flex items-center'>Save as PDF <CiSaveDown2/>
        </Button>
      </div>

      {/* Test Details Card */}
      <Card className="shadow-lg rounded-lg">
      <CardHeader className="flex justify-between">
        <div className='flex justify-between items-center'>
          <CardTitle className="text-2xl font-bold">Digital SAT 1 Overview</CardTitle>
          <CardTitle className="">Date: {new Date(selectedTest.date.seconds * 1000).toLocaleDateString()}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">

          <div>
            <p className={`text-sky-500 text-2xl ${breeSerif.className}`}><strong>Your Total Score:</strong></p> 
            <div className='flex'>
              <p className={`text-9xl ${breeSerif.className}`}>{selectedTest.scores[5]}</p>              
              <p className='ml-1 text-gray-400 self-end'>out of 1600 scale</p>
            </div>
            <div className='flex'>
              <p className="text-gray-600 text-2xl">Reading and Writing: {selectedTest.scores[3]}</p><p className='flex text-gray-500 self-end'>/800</p>
            </div>
            <div className='flex'>
            <p className="text-gray-600 text-2xl">Math: {selectedTest.scores[4]}</p><p className='flex text-gray-500 self-end'>/800</p>
            </div>
            <p className='text-gray-600 mt-2'>Estimated {getSatPercentile(selectedTest.scores[5])} Percentile (of National Test Scores)</p>
          </div>
        </div>
      </CardContent>
      </Card>


      <div className="grid grid-cols-3 gap-4">
        {/* Easy Card */}
        <Card className="shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold text-green-700">Easy</h3>
          <div className='text-lg'>Reading</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongReadingDiffMap.get('Easy')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{readingDiffMap.get('Easy')}</span>
          </div>
          <div className='mt-4 text-lg'>Math</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongMathDiffMap.get('Easy')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{mathDiffMap.get('Easy')}</span>
          </div>
        </Card>
        
        {/* Medium Card */}
        <Card className="shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold text-yellow-500">Medium</h3>
          <div className='text-lg'>Reading</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongReadingDiffMap.get('Medium')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{readingDiffMap.get('Medium')}</span>
          </div>
          <div className='mt-4 text-lg'>Math</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongMathDiffMap.get('Medium')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{mathDiffMap.get('Medium')}</span>
          </div>
        </Card>
        
        {/* Hard Card */}
        <Card className="shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold text-red-700">Hard</h3>
          <div className='text-lg'>Reading</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongReadingDiffMap.get('Hard')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{readingDiffMap.get('Hard')}</span>
          </div>
          <div className='mt-4 text-lg'>Math</div>
          <div className="flex justify-center items-center space-x-1 mt-2">
            <span className="text-gray-700 text-lg">{wrongMathDiffMap.get('Hard')}</span>
            <span className="text-gray-500">out of</span>
            <span className="text-gray-700 text-lg">{mathDiffMap.get('Hard')}</span>
          </div>
        </Card>
      </div>


      {/* Topics Overview */}
      <section className="grid grid-cols-2 gap-4">
        {/* Reading Topics Breakdown */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reading Topics Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(zippedReadingTopicsMap.entries()).map(([topic, [wrong, correct]]) => {
              const total = correct + wrong;
              return (
                <div key={topic} className="flex justify-between">
                  <span className="font-medium">{topic}</span>
                  <span>
                    {showPercentages
                      ? `${calculatePercentage(correct, total)}%`
                      : `${correct} / ${wrong}`}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Math Topics Breakdown */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Math Topics Breakdown</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${isScrollable ? "max-h-[500px] overflow-y-auto" : ""}`}>
            {Array.from(zippedMathTopicsMap.entries()).map(([topic, [wrong, correct]]) => {
              const total = correct + wrong;
              return (
                <div key={topic} className="flex justify-between">
                  <span className="font-medium">{topic}</span>
                  <span className="whitespace-nowrap">
                    {showPercentages
                      ? `${calculatePercentage(correct, total)}%`
                      : `${correct} / ${wrong}`}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-lg rounded-lg p-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Missed Questions</CardTitle>
      </CardHeader>
      <CardContent>
        {wrongAnswers.length > 0 && (
          <>
          <div>Module 1</div>
          <div className="flex gap-1 flex-wrap">
            {wrongAnswers.map(([index, answer], i) => (
              <div key={i} className="flex bg-red-200 text-red-800 p-2 rounded-lg  min-w-100px">
                <span className="font-semibold">{index}:</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
          </>
        )}
      </CardContent>
      <CardContent>
        {wrongAnswers2.length > 0 && (
          <>
          <div>Module 2</div>
          <div className="flex gap-1 flex-wrap">
            {wrongAnswers2.map(([index, answer], i) => (
              <div key={i} className="flex bg-red-200 text-red-800 p-2 rounded-lg  min-w-100px">
                <span className="font-semibold">{index}:</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
          </>
        )}
      </CardContent>
      <CardContent>
        {wrongAnswers3.length > 0 && (
          <>
          <div>Module 3</div>
          <div className="flex gap-1 flex-wrap">
            {wrongAnswers3.map(([index, answer], i) => (
              <div key={i} className="flex bg-red-200 text-red-800 p-2 rounded-lg  min-w-100px">
                <span className="font-semibold">{index}:</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
          </>
        ) }
      </CardContent>
      <CardContent>
        {wrongAnswers4.length > 0 && (
          <>
          <div>Module 4</div>
          <div className="flex gap-1 flex-wrap">
            {wrongAnswers4.map(([index, answer], i) => (
              <div key={i} className="flex bg-red-200 text-red-800 p-2 rounded-lg  min-w-100px">
                <span className="font-semibold">{index}:</span>
                <span>{answer}</span>
              </div>
            ))}
          </div>
          </>
        )}
      </CardContent>
    </Card>

            <div className='flex'>
            <Button onClick={() => setIsScrollable(!isScrollable)} className="mb-4 mr-4 bg-sky-500">
              {isScrollable ? "Show All on One Page" : "Enable Scrolling"}
            </Button>
            <Button onClick={() => setShowPercentages(!showPercentages)} className='bg-sky-500'>
                {showPercentages ? "Show as Fractions" : "Show as Percentages"}
              </Button>
        </div>
    </div>
  );
};

export default Score;