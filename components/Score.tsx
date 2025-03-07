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


const breeSerif = Bree_Serif({
  subsets: ['latin'],
  weight: '400', // Available weight for Bree Serif
});

const Score = () => {
  const { selectedTest } = useAuthStore();
  const router = useRouter();

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
  console.log(mathDiffMap)

  //array of topics of missed questions
  selectedTest.answers.forEach((item: string, index: number) => {
    if (sampletestdata[0][index].answer != selectedTest.answers[index]) {
      readingTopics.push(sampletestdata[0][index].topic);
      readingDiff.push(sampletestdata[0][index].difficulty);
    }
  });

  selectedTest.answers2.forEach((item: string, index: number) => {
    if (sampletestdata[1][index].answer != selectedTest.answers2[index]) {
      readingTopics.push(sampletestdata[1][index].topic);
      readingDiff.push(sampletestdata[1][index].difficulty);
      console.log('1' + index)
    }
  });

  selectedTest.answers3.forEach((item: string, index: number) => {
    if (sampletestdata[2][index].answer != selectedTest.answers3[index]) {
      mathTopics.push(sampletestdata[2][index].topic);
      mathDiff.push(sampletestdata[2][index].difficulty);
      console.log('2' + index)

    }
  });

  console.log(mathDiff)


  selectedTest.answers4.forEach((item: string, index: number) => {
    if (sampletestdata[3][index].answer != selectedTest.answers4[index]) {
      mathTopics.push(sampletestdata[3][index].topic);
      mathDiff.push(sampletestdata[3][index].difficulty);
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
              <p className={`text-9xl ${breeSerif.className}`}>{selectedTest.scores[0] * 10 + 400}</p>              
              <p className='ml-1 text-gray-400 self-end'>out of 1600 scale</p>
            </div>
            <div className='flex'>
              <p className="text-gray-600 text-2xl">Reading and Writing: {selectedTest.scores[1] * 10 + 200}</p><p className='flex text-gray-500 self-end'>/800</p>
            </div>
            <div className='flex'>
            <p className="text-gray-600 text-2xl">Math: {selectedTest.scores[2] * 10 + 200}</p><p className='flex text-gray-500 self-end'>/800</p>
            </div>
            <p className='text-gray-600 mt-2'>90th Percentile of National Test Scores</p>
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
      <section className='grid grid-cols-2 gap-4'>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reading Topics Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        {Array.from(zippedReadingTopicsMap.entries()).map(([topic, [wrong, correct]]) => (
          <div key={topic} className="flex justify-between">
            <span className="font-medium">{topic}</span>
            <span>
              <span className="">{correct}</span>
              <span> / </span>
              <span className="">{wrong}</span>
            </span>
          </div>
        ))}
        </CardContent>
      </Card>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Math Topics Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {Array.from(zippedMathTopicsMap.entries()).map(([topic, [wrong, correct]]) => (
          <div key={topic} className="flex justify-between">
            <span className="font-medium">{topic}</span>
            <span className='whitespace-nowrap'>
              <span className="">{correct}</span>
              <span> / </span>
              <span className="">{wrong}</span>
            </span>
          </div>
        ))}
        </CardContent>
      </Card>
      </section>
    </div>
  );
};

export default Score;