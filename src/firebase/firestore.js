import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// MEMBERS COLLECTION
export const membersCollection = collection(db, 'members');

export const addMember = async (memberData) => {
  try {
    const docRef = await addDoc(membersCollection, {
      ...memberData,
      createdAt: serverTimestamp(),
      isActive: true
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMembers = async () => {
  try {
    const q = query(membersCollection, where('isActive', '==', true), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: members };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateMember = async (id, updateData) => {
  try {
    await updateDoc(doc(db, 'members', id), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// CONTRIBUTIONS COLLECTION
export const contributionsCollection = collection(db, 'contributions');

export const addContribution = async (contributionData) => {
  try {
    const docRef = await addDoc(contributionsCollection, {
      ...contributionData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getWeeklyContributions = async (weekStart, weekEnd) => {
  try {
    const q = query(
      contributionsCollection,
      where('date', '>=', weekStart),
      where('date', '<=', weekEnd),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const contributions = [];
    querySnapshot.forEach((doc) => {
      contributions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: contributions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getMemberContributions = async (memberId) => {
  try {
    const q = query(
      contributionsCollection,
      where('memberId', '==', memberId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const contributions = [];
    querySnapshot.forEach((doc) => {
      contributions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: contributions };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// EXPENSES COLLECTION
export const expensesCollection = collection(db, 'expenses');

export const addExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(expensesCollection, {
      ...expenseData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getExpenses = async (startDate, endDate) => {
  try {
    const q = query(
      expensesCollection,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: expenses };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// WEEKLY SUMMARIES COLLECTION
export const weeklySummariesCollection = collection(db, 'weeklySummaries');

export const addWeeklySummary = async (summaryData) => {
  try {
    const docRef = await addDoc(weeklySummariesCollection, {
      ...summaryData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getWeeklySummaries = async (limit = 10) => {
  try {
    const q = query(weeklySummariesCollection, orderBy('weekStart', 'desc'), limit(limit));
    const querySnapshot = await getDocs(q);
    const summaries = [];
    querySnapshot.forEach((doc) => {
      summaries.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: summaries };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
