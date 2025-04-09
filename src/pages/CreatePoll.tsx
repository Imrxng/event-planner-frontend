import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import {  useState } from 'react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/CreateEvent.component.css';
import { PollFormData } from '../types/types';
import FormPoll from '../components/events/requests/FormPoll';

const CreatePoll = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>('');

  const { getAccessTokenSilently } = useAuth0();
  const server = import.meta.env.VITE_SERVER_URL;

  if (loading) {
    return <FullscreenLoader content='Requesting poll...' />;
  }

  const createPoll = async (pollData: PollFormData) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = await getAccessTokenSilently();
      const response = await fetch(`${server}/api/polls`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pollData
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSuccessMessage('Your poll was succesfully created.');
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
    <FormPoll onSubmit={createPoll} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} succesMessage={succesMessage} errorMessage={errorMessage} method='create' />
  );
};


const CreatePollPage = withAuthenticationRequired(CreatePoll, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...' />,
});
export default CreatePollPage;