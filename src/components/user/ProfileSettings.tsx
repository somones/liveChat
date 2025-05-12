import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/slices/userSlice';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import Avatar from '../chat/Avatar';
import { Camera, Check } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  if (!currentUser) {
    return null;
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      // Get current user
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      
      // Update profile in Firebase Auth
      await updateProfile(user, {
        displayName: displayName,
      });
      
      // Update profile in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName,
      });
      
      // Update user in Redux store
      dispatch(setUser({
        ...currentUser,
        displayName: displayName,
      }));
      
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setErrorMessage('Failed to update profile');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="relative">
          <Avatar 
            src={currentUser.photoURL} 
            name={currentUser.displayName}
            size="lg"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{currentUser.displayName}</h3>
          <p className="text-gray-600 dark:text-gray-300">{currentUser.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Joined {new Date(currentUser.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isUpdating || !displayName.trim() || displayName === currentUser.displayName}
          className={`w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md font-medium ${
            isUpdating || !displayName.trim() || displayName === currentUser.displayName
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700'
          }`}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;