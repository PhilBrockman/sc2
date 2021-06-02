import React from 'react';
import Userfront from "@userfront/react";


export const Dashboard = () => {
  Userfront.init("xbrx87bw");
  const SignupForm = Userfront.build({
    toolId: "ldnoak"
  });

  return(
    <>
      <h2>Dashboard</h2>
      <SignupForm />
    </>
  );
}