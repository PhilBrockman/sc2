import React from 'react';
import Userfront from "@userfront/react";

Userfront.init("xbrx87bw");

const SignupForm = Userfront.build({
  toolId: "ldnoak"
});


export const Dashboard = () => {
  return(
    <>
      <h2>Dashboard</h2>
      <SignupForm />
    </>
  );
}