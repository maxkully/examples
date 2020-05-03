import React from 'react';
import { Helmet } from 'react-helmet';
import Dashboard from "components/Dashboard";

export default function App() {
  return (
    <div>
      <Helmet
        titleTemplate="%s - Big Data Technologies"
        defaultTitle="Big Data Technologies"
      >
        <meta name="description" content="Big Data Technologies code exercise" />
      </Helmet>
      <Dashboard />
    </div>
  );
}
