import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/store';
import { MessageSquare, Users, Clock, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';

const HomePage: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to ChatApp
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Connect with people from all around the world in real time.
          </p>
          
          {currentUser ? (
            <Link
              to="/chat"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
            >
              Start Chatting
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          
          <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6 max-w-md">
                <h3 className="text-2xl font-semibold mb-3">Secure Conversations</h3>
                <p className="text-blue-100 mb-4">
                  Your conversations are protected with secure authentication and data storage.
                </p>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">End-to-end security</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-sm">
                <h4 className="text-lg font-medium mb-3">Ready to get started?</h4>
                <p className="text-blue-100 mb-4">
                  Join our community of users and start chatting today.
                </p>
                <Link
                  to={currentUser ? "/chat" : "/signup"}
                  className="inline-block bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  {currentUser ? "Go to Chat" : "Create Account"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;