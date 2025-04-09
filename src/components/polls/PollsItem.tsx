import foto from '../../assets/images/brightest_logo_small.webp';
import "../../styles/pollsitem.component.css";
import VoteItem from './voteItem';
const PollsItem= () => {
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
            </div>
            <div className="vote-content">
                <VoteItem />
                <VoteItem />
                <VoteItem />
                <VoteItem />
            </div>
            <div className="footer-content">
                <p>created by: <span>John Doe</span></p>
                <button>View Details</button>
            </div>
        </div>
    );
};

export default PollsItem;