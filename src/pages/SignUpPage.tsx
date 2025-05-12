import React from 'react';
import Layout from '../components/layout/Layout';
import SignUpForm from '../components/auth/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Create a New Account
        </h1>
        <SignUpForm />
      </div>
    </Layout>
  );
};

export default SignUpPage;