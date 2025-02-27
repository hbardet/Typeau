import React from 'react';
import Typeau from './Pages/Typeau/Typeau';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div>
      <Helmet>
        <title>Typeau</title>
      </Helmet>
      <Typeau />
    </div>
  );
}

export default App;
