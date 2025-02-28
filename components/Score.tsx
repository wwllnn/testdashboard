"use client";
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Check, X } from 'lucide-react';
import { sampletestdata, sampletopics, diff } from '@/lib/data';

const Score = () => {
  const { selectedTest } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!selectedTest) {
      router.push('/'); // Redirect if no test is selected
    }
  }, [selectedTest, router]);

  if (!selectedTest) return <p className="text-center mt-5">Loading test details...</p>;

  const arrayTopics: string[] = [];
  const diffArr: string[] = [];

  selectedTest.answers.forEach((item: string, index: number) => {
    if (sampletestdata[0][index].answer != selectedTest.answers[index]) {
      arrayTopics.push(sampletopics[index]);
      diffArr.push(diff[index]);
    }
  });

  selectedTest.answers2.forEach((item: string, index: number) => {
    if (sampletestdata[1][index].answer != selectedTest.answers2[index]) {
      arrayTopics.push(sampletopics[index + 27]);
      diffArr.push(diff[index + 27]);
    }
  });

  selectedTest.answers3.forEach((item: string, index: number) => {
    if (sampletestdata[2][index].answer != selectedTest.answers3[index]) {
      arrayTopics.push(sampletopics[index + 54]);
      diffArr.push(diff[index + 54]);
    }
  });

  selectedTest.answers4.forEach((item: string, index: number) => {
    if (sampletestdata[3][index].answer != selectedTest.answers4[index]) {
      arrayTopics.push(sampletopics[index + 76]);
      diffArr.push(diff[index + 76]);
    }
  });

  const frequencyMap = new Map();
  sampletopics.forEach((topic) => {
    frequencyMap.set(topic, (frequencyMap.get(topic) || 0) + 1);
  });

  const diffMap = new Map();
  diff.forEach((topic) => {
    diffMap.set(topic, (diffMap.get(topic) || 0) + 1);
  });

  const wrongDiffMap = new Map(diffMap);
  for (const topic of diffArr) {
    wrongDiffMap.set(topic, wrongDiffMap.get(topic) - 1);
  }

  const wrongMap = new Map(frequencyMap);
  for (const topic of arrayTopics) {
    wrongMap.set(topic, wrongMap.get(topic) - 1);
  }

  const zippedMap = new Map<string, [number, number]>(
    [...frequencyMap.keys()]
      .filter(key => wrongMap.has(key))
      .map(key => [key, [frequencyMap.get(key)!, wrongMap.get(key)!]])
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50">
      {/* Back Button */}
      <Button variant="outline" className="mb-6" onClick={() => router.push('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      {/* Test Details Card */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Test Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-gray-700"><strong>Date:</strong> {new Date(selectedTest.date.seconds * 1000).toLocaleDateString()}</p>
              <p className="text-gray-700"><strong>Score:</strong> {selectedTest.scores[0] * 20 + 400}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Overview */}
      <div className="grid grid-cols-3 gap-4">
        {['Easy', 'Medium', 'Hard'].map((level, index) => (
          <Card key={index} className="shadow-lg rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800">{level}</h3>
            <div className="flex justify-center items-center space-x-2 mt-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-gray-700">{wrongDiffMap.get(level)}</span>
              <span className="text-gray-500">/</span>
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">{diffMap.get(level)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Topics Overview */}
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Topics Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from(zippedMap.entries()).map(([topic, count], index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">{topic}</h3>
              <div className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-gray-700">{count[1]}</span>
                <span className="text-gray-500">/</span>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{count[0]}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Score;