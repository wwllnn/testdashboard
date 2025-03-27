import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const TestsInProgress = () => {
  const { incompleteScores, loading, error, fetchIncompleteScores, setSelectedTest, userUid } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (userUid) fetchIncompleteScores();
  }, [userUid, fetchIncompleteScores]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-gray-500" /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (incompleteScores.length === 0) return <p className="text-center text-gray-500 mt-5">No test scores available.</p>;

  return (
    <div className="p-6 text-white">
      <div className="overflow-x-auto">
        <div className="flex gap-4 w-max pb-2">
          {incompleteScores.map((score, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition min-w-[200px] max-w-[200px]" onClick={() => {
              setSelectedTest(score);
              router.push(`/test`);
            }}>
              <CardHeader>
                <CardTitle>SAT Test 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                {new Date(score.date.seconds * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}{" "}
                <br/>
                {new Date(score.date.seconds * 1000).toLocaleTimeString("en-US", {
                  hour: "numeric", // 🔹 Use "numeric" instead of "2-digit" to remove leading zero
                  minute: "2-digit",
                  hour12: true
                })}                
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestsInProgress;
