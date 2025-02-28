import { create } from 'zustand';
import { auth, db } from './firebase'; // Adjust path based on your project structure
import { collection, getDocs, query, where, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Define the TestScore type
interface TestScore {
  userId: string;
  date: { seconds: number; nanoseconds: number };
  answers: any;
  answers2: any;
  answers3: any;
  answers4: any;
  scores: number[];
}

// Define Zustand store state and actions
interface AuthState {
  userUid: string | null;
  scores: TestScore[];
  loading: boolean;
  error: string | null;
  selectedTest: TestScore | null;
  setSelectedTest: (test: TestScore | null) => void;
  fetchScores: () => Promise<void>;
  listenForAuthChanges: () => void;
}

// Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  userUid: null,
  scores: [],
  loading: false,
  error: null,
  selectedTest: null,

  // Set selected test for details page
  setSelectedTest: (test) => set({ selectedTest: test }),

  // Fetch test scores from Firestore
  fetchScores: async () => {
    const { userUid } = get();
    if (!userUid) {
      set({ scores: [], loading: false });
      return;
    }

    try {
      set({ loading: true });

      const testsQuery = query(collection(db, 'testScores'), where('userId', '==', userUid));
      const querySnapshot = await getDocs(testsQuery);

      let scoresData: TestScore[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        userId: doc.data().userId,
        date: doc.data().date,
        answers: doc.data().answers,
        answers2: doc.data().answers2,
        answers3: doc.data().answers3,
        answers4: doc.data().answers4,
        scores: doc.data().scores,
      }));

      // Sort scores by date (latest first)
      scoresData = scoresData.sort((a, b) => new Date(b.date.seconds * 1000).getTime() - new Date(a.date.seconds * 1000).getTime());

      set({ scores: scoresData, loading: false });
    } catch (err) {
      set({ error: 'Error fetching scores: ' + (err instanceof Error ? err.message : 'Unknown error'), loading: false });
    }
  },

  // Listen for authentication state changes
  listenForAuthChanges: () => {
    onAuthStateChanged(auth, (user) => {
      set({ userUid: user ? user.uid : null });
      if (user) {
        get().fetchScores(); // Fetch scores when user logs in
      }
    });
  },
}));
