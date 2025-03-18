import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import {  useState } from 'react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/CreateEvent.component.css';
import FormEvent from '../components/events/requests/FormEvent';
import { EventFormData } from '../types/types';


const CreateEvent = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>('');

  const { getAccessTokenSilently } = useAuth0();
  const server = import.meta.env.VITE_SERVER_URL;


  if (loading) {
    return <FullscreenLoader content='Requesting event...' />;
  }

  const createEvent = async (eventData: EventFormData) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = await getAccessTokenSilently();
      const response = await fetch(`${server}/api/events`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventData
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSuccessMessage('Your request has been successfully received and is currently being reviewed by an administrator.');
      setErrorMessage('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <FormEvent onSubmit={createEvent} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} succesMessage={succesMessage} errorMessage={errorMessage} method='create' />
  );
};


const CreateEventPage = withAuthenticationRequired(CreateEvent, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...' />,
});
export default CreateEventPage;