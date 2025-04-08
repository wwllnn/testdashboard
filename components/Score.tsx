// components/Score.tsx
"use client";

import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { sampletestdata } from '@/lib/data';
import { Bree_Serif } from 'next/font/google';
import { ArrowLeft } from 'lucide-react';
import { CiSaveDown2 } from "react-icons/ci";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

 
// Utilities
import {
  buildFrequencyMap,
  getWrongAnswers,
  adjustWrongMap,
  getSatPercentile,
  calculatePercentage
} from '@/lib/scoreUtils';
import PDFDownloadButton from './PDFDownloadButton';

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });

const Score = () => {
  const { user, userData } = useAuth();
  const { selectedTest } = useAuthStore();
  const router = useRouter();
  const [isScrollable, setIsScrollable] = useState(true);
  const [showPercentages, setShowPercentages] = useState(false);

  if (!selectedTest) return <p className="text-center mt-5">Loading test details...</p>;

  const testDate = new Date(selectedTest.date.seconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTopicsMap = buildFrequencyMap([...sampletestdata[0], ...sampletestdata[1]], 'topic');
  const readingDiffMap = buildFrequencyMap([...sampletestdata[0], ...sampletestdata[1]], 'difficulty');
  const mathTopicsMap = buildFrequencyMap([...sampletestdata[2], ...sampletestdata[3]], 'topic');
  const mathDiffMap = buildFrequencyMap([...sampletestdata[2], ...sampletestdata[3]], 'difficulty');

  const { topics: r1, difficulties: d1, wrongs: wrong1 } = getWrongAnswers(sampletestdata[0], selectedTest.answers, 0);
  const { topics: r2, difficulties: d2, wrongs: wrong2 } = getWrongAnswers(sampletestdata[1], selectedTest.answers2, 27);
  const { topics: m1, difficulties: mD1, wrongs: wrong3 } = getWrongAnswers(sampletestdata[2], selectedTest.answers3, 54);
  const { topics: m2, difficulties: mD2, wrongs: wrong4 } = getWrongAnswers(sampletestdata[3], selectedTest.answers4, 76);

  const readingTopics = [...r1, ...r2];
  const readingDiff = [...d1, ...d2];
  const mathTopics = [...m1, ...m2];
  const mathDiff = [...mD1, ...mD2];

  const wrongAnswers = [...wrong1];
  const wrongAnswers2 = [...wrong2];
  const wrongAnswers3 = [...wrong3];
  const wrongAnswers4 = [...wrong4];

  const correctReadingTopicsMap = adjustWrongMap(readingTopicsMap, readingTopics);
  const correctMathTopicsMap = adjustWrongMap(mathTopicsMap, mathTopics);
  const correctReadingDiffMap = adjustWrongMap(readingDiffMap, readingDiff);
  const correctMathDiffMap = adjustWrongMap(mathDiffMap, mathDiff);

  const zippedReadingTopicsMap = new Map<string, [number, number]>(
    [...readingTopicsMap.keys()]
      .filter(key => correctReadingTopicsMap.has(key))
      .map(key => {
        const total = readingTopicsMap.get(key)!;
        const correct = correctReadingTopicsMap.get(key)!;
        return [key, [total, correct]];
      })
  );

  const zippedMathTopicsMap = new Map<string, [number, number]>(
    [...mathTopicsMap.keys()]
      .filter(key => correctMathTopicsMap.has(key))
      .map(key => {
        const total = mathTopicsMap.get(key)!;
        const correct = correctMathTopicsMap.get(key)!;
        return [key, [total, correct]];
      })
  );


  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 ${breeSerif.className}`}>
      <div className='flex justify-between'>
        <Button variant="outline" onClick={() => router.push('/')}> <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home </Button>
        <PDFDownloadButton
          selectedTest={selectedTest}
          testDate={testDate}
          readingMap={Array.from(zippedReadingTopicsMap.entries())}
          mathMap={Array.from(zippedMathTopicsMap.entries())}
        />
      </div>

      {/* Summary Card */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-2xl font-bold">Digital SAT 1 Overview</CardTitle>
          <CardTitle>Date: {new Date(selectedTest.date.seconds * 1000).toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sky-500 text-2xl"><strong>Your Total Score:</strong></div>
          <div className='flex'>
            <p className={`text-9xl ${breeSerif.className}`}>{selectedTest.scores[5]}</p>
            <p className='ml-1 text-gray-400 self-end'>out of 1600</p>
          </div>
          <div className='text-gray-600 text-2xl'>Reading and Writing: {selectedTest.scores[3]} /800</div>
          <div className='text-gray-600 text-2xl'>Math: {selectedTest.scores[4]} /800</div>
          <p className='text-gray-600 mt-2'>Estimated {getSatPercentile(selectedTest.scores[5])} Percentile</p>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4">
        {[{ label: 'Reading', map: zippedReadingTopicsMap }, { label: 'Math', map: zippedMathTopicsMap }].map(({ label, map }) => (
          <Card key={label} className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{label} Topics Breakdown</CardTitle>
            </CardHeader>
            <CardContent className={`space-y-4 ${label === 'Math' && isScrollable ? 'max-h-[500px] overflow-y-auto' : ''}`}>
              {Array.from(map.entries()).map(([topic, [total, correct]]) => (
                <div key={topic} className="flex justify-between">
                  <span className="font-medium">{topic}</span>
                  <span className="whitespace-nowrap">{showPercentages ? `${calculatePercentage(correct, total)}%` : `${correct} / ${total}`}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
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
