import React from 'react';
import foto from '../../assets/images/brightest_logo_small.png';
import ProgressBar from './ProgressBar';
import { Link, Navigate, useNavigate } from 'react-router-dom';
const PollsItem= () => {
    const navigate = useNavigate();
    return (
        <div className='pollsitem-card'>
            <div className="header-content">
                <h1>what topic would you like for the next tech meetup?</h1>
                <div className="header-content-right">
                <button>Report</button>
                <img src={foto} alt="" />
                </div>
            </div>
            <div className="main-content">
                <p>Help us choose the main topic for our upcoming technology meetup in march.</p>
                <div className="graphs">
                <ProgressBar voteAmount={3} title={'title'} />
                <ProgressBar voteAmount={3} title={'title'} />
                <ProgressBar voteAmount={3} title={'title'} />
                <ProgressBar voteAmount={3} title={'title'} />
                </div>
            </div>
            <div className="footer-content">
                <p>created by: <span>John Doe</span></p>
                <button onClick={() => navigate('/PollDetailPage')}>View Details</button>
            </div>
        </div>
    );
};

export default PollsItem;