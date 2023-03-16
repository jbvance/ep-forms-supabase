import React from "react";

function AspectRatio(props) {
  return (
    <div
      className="AspectRatio"
      style={{
        paddingBottom: (1 / props.ratio) * 100 + "%",
      }}
    >
      <div className="AspectRatio__inner">{props.children}</div>
    </div>
  );
}

export default AspectRatio;
