import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileSettings from '../components/user/ProfileSettings';
import { RootState } from '../redux/store';

const ProfilePage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Layout>
      <div className="py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Your Profile
        </h1>
        <ProfileSettings />
      </div>
    </Layout>
  );
};

export default ProfilePage;