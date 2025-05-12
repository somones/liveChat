import React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-12">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Log In to Your Account
        </h1>
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;