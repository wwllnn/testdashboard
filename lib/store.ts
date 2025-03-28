import { create } from 'zustand';
import { auth, db } from './firebase'; // Adjust path based on your project structure
import { collection, getDocs, query, where, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


// Define the TestScore type
export interface TestScore {
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
  email: string;
  name: string;
}

// Define Zustand store state and actions
interface AuthState {
  userUid: string | null;
  scores: TestScore[];
  incompleteScores: TestScore[];
  loading: boolean;
  error: string | null;
  selectedTest: TestScore | null;
  setSelectedTest: (test: TestScore | null) => void;
  fetchScores: () => Promise<void>;
  fetchIncompleteScores: () => Promise<void>;
  listenForAuthChanges: () => void;
}

// Zustand store
export const useAuthStore = create<AuthState>((set, get) => ({
  userUid: null,
  scores: [],
  incompleteScores: [],
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

      const user = auth.currentUser; // Get authenticated user
      const email = user?.email ?? "No Email";
      const name = user?.displayName ?? "Anonymous"; // Default values if missing

      const testsQuery = query(collection(db, 'testScores'), where('userId', '==', userUid), where("complete", "==", true));
      const querySnapshot = await getDocs(testsQuery);

      let scoresData: TestScore[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        userId: doc.data().userId,
        date: doc.data().date,
        answers: doc.data().answers,
        answers2: doc.data().answers2,
        answers3: doc.data().answers3,
        answers4: doc.data().answers4,
        scores: doc.data().scores,
        complete: doc.data().complete,
        docId: doc.data().docId,
        missedQ: doc.data().missedQ,
        email,
        name
      }));

      // Sort scores by date (latest first)
      scoresData = scoresData.sort((a, b) => new Date(b.date.seconds * 1000).getTime() - new Date(a.date.seconds * 1000).getTime());

      set({ scores: scoresData, loading: false });
    } catch (err) {
      set({ error: 'Error fetching scores: ' + (err instanceof Error ? err.message : 'Unknown error'), loading: false });
    }
  },

  fetchIncompleteScores: async () => {
    const { userUid } = get();
    if (!userUid) {
      set({ incompleteScores: [], loading: false });
      return;
    }

    try {
      set({ loading: true });

      const user = auth.currentUser; // Get authenticated user
      const email = user?.email ?? "No Email";
      const name = user?.displayName ?? "Anonymous"; // Default values if missing

      const incompleteQuery = query(
        collection(db, "testScores"),
        where("userId", "==", userUid),
        where("complete", "==", false) // Filter by incomplete tests
      );
      const querySnapshot = await getDocs(incompleteQuery);

      let incompleteData: TestScore[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        userId: doc.data().userId,
        date: doc.data().date,
        answers: doc.data().answers,
        answers2: doc.data().answers2,
        answers3: doc.data().answers3,
        answers4: doc.data().answers4,
        scores: doc.data().scores,
        complete: doc.data().complete,
        docId: doc.data().docId,
        missedQ: doc.data().missedQ,
        email,
        name
      }));

      // Sort incomplete scores by date (latest first)
      incompleteData = incompleteData.sort(
        (a, b) => new Date(b.date.seconds * 1000).getTime() - new Date(a.date.seconds * 1000).getTime()
      );

      set({ incompleteScores: incompleteData, loading: false });
    } catch (err) {
      set({
        error: "Error fetching incomplete scores: " + (err instanceof Error ? err.message : "Unknown error"),
        loading: false,
      });
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
