import React from 'react';

const PoaHeader = ({ headerText, paragraphText }) => {
  return (
    <React.Fragment>
      <h2 className="PoaHeader">{headerText}</h2>
      <p className="PoaLabelText">{paragraphText}</p>
    </React.Fragment>
  );
};

export default PoaHeader;
