import React from 'react';
import Typeau from './Pages/Typeau/Typeau';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div>
      <Helmet>
        <link rel="icon" type="image/x-icon" sizes="16x16" href="/favicon.png"/>
        <title>Typeau</title>
      </Helmet>
      <Typeau />
    </div>
  );
}

export default App;
