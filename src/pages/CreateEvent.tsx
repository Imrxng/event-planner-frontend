import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/CreateEvent.component.css';
import FormEvent from '../components/events/requests/FormEvent';
import { EventFormData } from '../types/types';
import useAccessToken from '../utilities/getAccesToken';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Unauthorized from '../components/Unauthorized';
import { useState } from 'react';

const CreateEvent = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>('');
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;


  const createEvent = async (eventData: EventFormData) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = await getAccessToken();
      const response = await fetch(`${server}/api/events`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventData })
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
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthenticatedTemplate>
        {loading && <FullscreenLoader content='Requesting event...' />}
        <FormEvent
          onSubmit={createEvent}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          succesMessage={succesMessage}
          errorMessage={errorMessage}
          method='create'
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default CreateEvent;