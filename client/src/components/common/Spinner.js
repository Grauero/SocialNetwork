import React from 'react';

import spinner from './spinner.gif';

const Spinner = () => (
  <div>
    <img
      src={spinner}
      alt="Loading..."
      style={{
        width: '80px',
        margin: 'auto',
        display: 'block'
      }}
    />
  </div>
);

export default Spinner;
