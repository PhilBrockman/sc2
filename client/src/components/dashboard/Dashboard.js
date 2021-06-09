import React from 'react';
import Userfront from "@userfront/react";


export const Dashboard = () => {
  Userfront.init("xbrx87bw");
  const SignupForm = Userfront.build({
    toolId: "ldnoak"
  });

  const LoginForm = Userfront.build({
    toolId: "klmral"
  });

  return(
    <>
      <LoginForm />
      <h2>Dashboard</h2>
      <SignupForm />
    </>
  );
}