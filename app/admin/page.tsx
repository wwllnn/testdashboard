"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Roboto } from 'next/font/google';
import { Bree_Serif } from 'next/font/google';


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const breeSerif = Bree_Serif({ subsets: ['latin'], weight: '400' });


interface TestScore {
  id: string;
  userId: string;
  date: { seconds: number; nanoseconds: number };
  answers: any;
  answers2: any;
  answers3: any;
  answers4: any;
  scores: number[];
  complete: boolean;
  docId: string;
  missedQ: number[];
  name: string;
  email: string;
}

const ADMIN_EMAILS = ["william@educate-one.com", 
  "vvllxn@gmail.com", 
  "sugarland@educate-one.com",
  "nayolyi@educate-one.com",
  "s.james@educate-one.com",
  "matt.shafer@educate-one.com",
  "ross.c@educate-one.com",
  "tutor6@educate-one.com"
];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { setSelectedTest } = useAuthStore();
  const router = useRouter();

  const [scores, setScores] = useState<TestScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (authLoading) return;

    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      router.push("/");
      return;
    }

    fetchAllScores();
  }, [user, authLoading]);

  const fetchAllScores = async () => {
    try {
      setLoading(true);
      const scoresQuery = query(collection(db, "testScores"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(scoresQuery);
      const scoresData: TestScore[] = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as TestScore),
      }));
      setScores(scoresData);
      setLoading(false);
    } catch (err) {
      setError("Error fetching scores");
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-4">Loading admin dashboard...</div>;
  }

  const paginatedScores = scores.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const totalPages = Math.ceil(scores.length / pageSize);

  return (
    <div className={`${roboto.className} pl-64 pr-64 pt-10`}>
      <h1 className="text-2xl font-bold">Recent Student Tests</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full border-collapse table-fixed bg-white text-sm text-gray-800 border-2 border-gray-300">
          <thead className="text-gray-400 font-semibold bg-gray-100">
            <tr>
              <th className="p-3 text-left border-2 border-gray-300">NAME</th>
              <th className="p-3 text-left border-2 border-gray-300">EMAIL</th>
              <th className="p-3 text-left border-2 border-gray-300">DATE</th>
              <th className="p-3 text-left border-2 border-gray-300">SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium">
            {paginatedScores.map((score) => (
              <tr
                key={score.docId}
                className="cursor-pointer hover:bg-gray-100 transition duration-150"
                onClick={() => {
                  setSelectedTest(score);
                  router.push(`/breakdown/${score.docId}`);
                }}
              >
                <td className="p-3 border-2 border-gray-300">{score.name}</td>
                <td className="p-3 border-2 border-gray-300">{score.email}</td>
                <td className="p-3 border-2 border-gray-300">
                  {new Date(score.date.seconds * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}<br />
                  {new Date(score.date.seconds * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </td>
                <td className="p-3 border-2 border-gray-300">{score.scores[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="text-sm font-medium text-blue-600 disabled:text-gray-300"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
            disabled={currentPage + 1 >= totalPages}
            className="text-sm font-medium text-blue-600 disabled:text-gray-300"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
