import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const TestsInProgress = () => {
  const { scores, loading, error, fetchScores, setSelectedTest, userUid } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (userUid) fetchScores();
  }, [userUid, fetchScores]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-gray-500" /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (scores.length === 0) return <p className="text-center text-gray-500 mt-5">No test scores available.</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-black">⌛️ Tests In Progress</h1>
      <div className="overflow-x-auto">
        <div className="flex gap-4 w-max pb-2">
          {scores.map((score, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition min-w-[175px]" onClick={() => {
              setSelectedTest(score);
              router.push(`/breakdown/${index}`);
            }}>
              <CardHeader>
                <CardTitle>SAT Test 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Date:</strong> {new Date(score.date.seconds * 1000).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestsInProgress;
