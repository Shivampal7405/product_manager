import React from 'react';
import RegistrationLayout from './components/RegistrationLayout';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';

const Register = () => {
  return (
    <RegistrationLayout 
      header={<RegistrationHeader />}
    >
      <RegistrationForm />
    </RegistrationLayout>
  );
};

export default Register;