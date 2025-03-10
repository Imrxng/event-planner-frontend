import { withAuthenticationRequired } from '@auth0/auth0-react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/BrightEventDetail.component.css';
import { useLocation } from 'react-router-dom';
import { Event } from '../types/types';

const BrightEventDetail = () => {
  const location = useLocation();
    const { event }: { event: Event } = location.state || {};  // Haal event op uit de state

  return (
    <div>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <p>{event.type}</p>
            <p>{new Date(event.startDate).toLocaleDateString()}</p>
        </div>
  )
}

const BrighteventsDetailPage = withAuthenticationRequired(BrightEventDetail, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...'/>,
});

export default BrighteventsDetailPage;