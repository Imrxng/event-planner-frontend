import React from "react";


const VoteItem = () => {
  const [progress, setProgress] = React.useState(0);


  return (
    <div className="progress-container">
      <div className="progress-bar" >70% Voted</div>
    </div>
  );
};

export default VoteItem;
