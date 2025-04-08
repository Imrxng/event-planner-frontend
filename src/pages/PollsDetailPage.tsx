import React from "react";
import foto from "../assets/images/brightest_logo_small.png";
import ProgressBarWithVote from "../components/polls/ProgressBarWithVote";
import "../styles/pollsDetail.component.css";

const PollDetailPage = () => {

  return (
    <div className="details-body">
    <div className="details-card">
      <div className="card-header">
        <h1>what topic would you like for the next tech meetup?</h1>
        <img src={foto} alt="" />
      </div>
      <div className="card-content">
        <p>
          Help us choose the main topic for our upcoming technology meetup in
          march.
        </p>
        <br/>
        <p className="card-description">created by Emma de Vries</p>
        <p className="card-description">created on 15-2-2024</p>
        <div className="votes">
        <form action="">
            <input type="radio" id="html" name="fav_language" value="HTML" />
            <ProgressBarWithVote voteAmount={5} title={''} />
        </form>
        <ProgressBarWithVote voteAmount={10} title={'title'} />
        <ProgressBarWithVote voteAmount={50} title={'title'} />
        <ProgressBarWithVote voteAmount={100} title={'title'} />
        </div>
      </div>
      <div className="card-footer">
        <p>
          created by: <span>John Doe</span>
        </p>
        <button>View Details</button>
      </div>
    </div>
    </div>
  );
};

export default PollDetailPage;
