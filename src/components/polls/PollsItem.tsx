import React from 'react';
import foto from '../../assets/images/brightest_logo_small.png';
import "../../styles/pollsitem.component.css";
const PollsItem= () => {
    return (
        <div className='pollsitem-card'>
            <div className="header-content">
                <h1>what topic would you like for the next tech meetup?</h1>
                <button>Report</button>
                <img src={foto} alt="" />
            </div>
            <div className="main-content">
                <p>Help us choose the main topic for our upcoming technology meetup in march.</p>
                <div className="graphs">

                </div>
            </div>
            <div className="footer-content">
                <p>created by: <span>John Doe</span></p>
                <button>View Details</button>
            </div>
        </div>
    );
};

export default PollsItem;