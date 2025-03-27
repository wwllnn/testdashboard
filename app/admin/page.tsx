"use client";

import { useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust this path if needed
import { useAuthStore } from '@/lib/store';
import { useRouter } from "next/navigation";


const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// Define TestScore type
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

export default function AdminPage() {
    const { setSelectedTest } = useAuthStore();
    const router = useRouter();

    
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [scores, setScores] = useState<TestScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent form reload
    if (password === 'nayolceo') {
      setAuthenticated(true);
      fetchAllScores();
    } else {
      alert("Incorrect password!");
    }
  };

  // Fetch test scores from Firestore
  const fetchAllScores = async () => {
    try {
      setLoading(true);

      // Firestore query: Order by date (latest first)
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

  // Login form
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold">Admin Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mt-4"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border border-gray-700 mt-4">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date & Time</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.docId} className="cursor-pointer hover:bg-gray-200" onClick={() => {
                setSelectedTest(score);
                router.push(`/breakdown/${score.docId}`);
              }}>
              <td className="border p-2">{score.name}</td>
              <td className="border p-2">{score.email}</td>

              <td className="border p-2">
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
              </td>
              <td className="border p-2">{score.scores[5]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
