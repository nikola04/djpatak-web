import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Example function to fetch user account from MongoDB
export async function fetchUserAccount(userId: string, provider: string) {
  const client = await clientPromise;
  const db = client.db('djpatak');
  const accountsCollection = db.collection('accounts');

  try {
    const userAccount = await accountsCollection.findOne({ userId: new ObjectId(userId), provider });

    if (!userAccount) return null
    return userAccount;
  } catch (error) {
    console.error('Error fetching user account:', error);
    return null;
  } finally {
    // await client.close();
  }
}
