import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { setUser, clearUser, setUserLoading } from '../redux/slices/userSlice';
import { UserProfile } from '../redux/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setUserLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            dispatch(setUser(userDoc.data() as UserProfile));
          } else {
            // If user document doesn't exist, create basic profile from auth
            const userProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'User',
              photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`,
              createdAt: Date.now(),
            };
            dispatch(setUser(userProfile));
          }
        } catch (error) {
          console.error('Error getting user profile:', error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    });
    
    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth;