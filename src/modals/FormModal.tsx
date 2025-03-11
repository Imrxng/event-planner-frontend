import { useState, useEffect, useContext } from 'react';
import '../styles/FormModal.component.css';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from '../context/context';
import { Event } from '../types/types';

interface FormModalProps {
    form: string[];
    event: Event;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const FormModal = ({ form, event, onClose, setEvent }: FormModalProps) => {
    const [answers, setAnswers] = useState<string[]>(new Array(form.length).fill(''));
    const [errors, setErrors] = useState<string[]>(new Array(form.length).fill(''));
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const mongoDbUser = useContext(UserContext);
    const { getAccessTokenSilently } = useAuth0();
    const server = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose(false); 
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleChange = (index: number, value: string) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);

        const updatedErrors = [...errors];
        updatedErrors[index] = value ? '' : 'Dit veld is verplicht';
        setErrors(updatedErrors);
    };

    if (!mongoDbUser) {
        return null;
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async () => {
        let valid = true;
        const updatedErrors = [...errors];
        
        answers.forEach((answer, index) => {
            if (!answer) {
                updatedErrors[index] = 'Dit veld is verplicht';
                valid = false;
            }
        });

        setErrors(updatedErrors);

        if (!valid) {
            return; 
        }

        setLoading(true);
        try {
            setErrorMessage('');
            const token = await getAccessTokenSilently();
            const response = await fetch(`${server}/api/events/attend-event/${event._id}`, {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    answers: answers,
                    userId: mongoDbUser._id
                })
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);  
            }
            setSuccessMessage('Your registration was successful!');
            const filteredEvent: Event = {
                ...event,
                attendances: [...event.attendances, mongoDbUser._id.toString()] 
              };
            setEvent(filteredEvent);          
            setErrorMessage(null);  
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
    };

    return (
        <div id="modal-form-overlay">
            <div id="modal-content-form">
                <button id="close-btn" onClick={() => onClose(false)}>X</button>
                <h2>Form</h2>

                {successMessage ? ( 
                    <div className="success-message">{successMessage}</div> 
                ) : (
                    <>
                        <form onSubmit={handleSubmit}>
                            {form.map((question, index) => (
                                <div key={index} id="form-group">
                                    <label>{question}</label>
                                    <input
                                        type="text"
                                        value={answers[index]}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        required
                                    />
                                    {errors[index] && <div className="error" id="error-form">{errors[index]}</div>}
                                </div>
                            ))}
                            <div id="form-actions" style={{justifyContent: errorMessage ? 'space-between' : 'flex-end'}}>
                                {errorMessage && <p className="error">{errorMessage}</p>}  
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormModal;
