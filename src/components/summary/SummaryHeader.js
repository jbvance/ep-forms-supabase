import React from 'react';

const SummaryHeader = ({ text }) => {
  return (
    <React.Fragment>
      <h1 className="SummaryHeader">{text}</h1>
    </React.Fragment>
  );
};

export default SummaryHeader;
