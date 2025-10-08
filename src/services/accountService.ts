import { auth, db } from '@/config/firebase';
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

export async function deleteCurrentUserAccount() {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in');
  const uid = user.uid;

  // Helper to delete all docs matching userId from a collection
  const deleteWhereUser = async (col: string) => {
    const q = query(collection(db, col), where('userId', '==', uid));
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, col, d.id))));
  };

  // Delete cross-collection data
  await Promise.all([
    deleteWhereUser('projects'),
    deleteWhereUser('applications'),
    deleteWhereUser('notifications'),
    deleteWhereUser('user_achievements'),
    deleteWhereUser('user_saved_projects'),
    deleteWhereUser('user_project_likes'),
    deleteWhereUser('user_saved_hackathons'),
  ]);

  // Delete main user document
  await deleteDoc(doc(db, 'users', uid));

  // Finally delete auth account (may require recent login)
  await deleteUser(user);
}
