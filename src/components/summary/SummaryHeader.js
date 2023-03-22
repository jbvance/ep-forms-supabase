import React from 'react';

const SummaryHeader = ({ text }) => {
  return (
    <React.Fragment>
      <h4 className="SummaryHeader">{text}</h4>
    </React.Fragment>
  );
};

export default SummaryHeader;
