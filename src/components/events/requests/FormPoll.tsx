import { useContext, useEffect, useState } from "react";
import { PollFormData, Option } from "../../../types/types";
import { UserContext } from "../../../context/context";
import { RiDeleteBinLine } from "react-icons/ri";
import LinkBack from "../../LinkBack";

interface FormPollProps {
    onSubmit: (pollData: PollFormData) => void;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    succesMessage: string;
    errorMessage: string;
    method: string;
    poll?: PollFormData;
    _id?: string;
}

const FormPoll = ({ onSubmit, setErrorMessage, setSuccessMessage, errorMessage, succesMessage, method, poll, _id }: FormPollProps) => {
    const [question, setQuestion] = useState<string>(poll && poll?.question || '');
    const [description, setDescription] = useState<string>(poll && poll?.description || '');
    const [location, setLocation] = useState<string>(poll && poll?.location || '');
    const [options, setOptions] = useState<string[]>([]);

    const { user } = useContext(UserContext) as { user: { _id: string } | null };

    useEffect(() => {
        if (poll?.options) {
            const optionsText = (poll.options as unknown as Option[]).map((option: Option) => option.text);
            setOptions(optionsText);
        } else {
            setOptions(['', '']);
        }
    }, [poll]);

    if (!user) {
        return null;
    }

    const handleReset = () => {
        setOptions(['', '']);
        setErrorMessage('');
        setQuestion('');
        setDescription('');
        setLocation('');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 100) {
            setDescription(e.target.value);
        }
    };

    const removeOption = (index: number) => {
        const updatedQuestions = [...options];
        updatedQuestions.splice(index, 1);
        setOptions(updatedQuestions);
    };

    const addOptionHandler = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index: number, form: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...options];
        updatedQuestions[index] = form.target.value;
        setOptions(updatedQuestions);
    };

    const handleSubmit = () => {
        setSuccessMessage('');
        if (description === '' || question === '' || location === '') {
            setErrorMessage('Please fill in all required fields.');
            return;
        }
        if (question.length < 10 || question.length > 50) {
            setErrorMessage('Event question must be between 10 and 50 characters.');
            return;
        }
        if (description.length < 25 || description.length > 100) {
            setErrorMessage('Event description must be between 25 and 100 characters.');
            return;
        }

        if (options.length < 2) {
            setErrorMessage('Each multiple choice question must have at least two options.');
            return;
        }

        for (const option of options) {
            if (option.trim() === '') {
                setErrorMessage('Please fill in all questions.');
                return;
            }

            if (option === '') {
                setErrorMessage('Please fill in all options.');
                return;
            }
            if (option.length < 2) {
                setErrorMessage('Option length must be 2 characters or more.');
                return;
            }
        }
        const pollForm = {
            question: question,
            description: description,
            location: location,
            createdBy: user._id,
            options: options
        };

        onSubmit(pollForm);
    };

    return (
        <div id='create-event-container'>
            <div id='create-event-container-top'>
                <LinkBack href={method === 'update' ? _id && `/brightpolls/${_id}` || '' : '/brightpolls'} />
                <p></p>
            </div>
            <div id='create-event-form'>
                <div className='create-event-item'>
                    <label htmlFor='create-event-title'>Question <span id='red'>*</span></label>
                    <input
                        type='text'
                        name='create-event-title'
                        id='create-event-title'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-description'>Description <span id='red'>*</span></label>
                    <textarea
                        name='create-event-description'
                        id='create-event-description'
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <p id='create-event-characters-limit'>{description.length}/100 characters</p>
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-location'>Location <span id='red'>*</span></label>
                    <select
                        name='create-event-location'
                        id='create-event-location'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value='' selected hidden disabled>--selected--</option>
                        <option value='all'>All Locations</option>
                        <option value='Brightest East'>Brightest East</option>
                        <option value='Brightest North'>Brightest North</option>
                        <option value='Brightest West'>Brightest West</option>
                    </select>
                </div>
                <div id={'create-poll-question-container'} style={{ marginTop: '20px' }}>
                    {options.length > 0 && (
                        <label htmlFor=''>Possible answers <span id="red">*</span></label>
                    )}

                    {options.map((option, optionIndex) => (
                        <div id='create-event-question-add-option-bin-textinput' key={optionIndex}>
                            <input
                                type='text'
                                value={option}
                                className='create-event-question-text-input'
                                onChange={(e) => handleOptionChange(optionIndex, e)}
                                placeholder={`Answer ${optionIndex + 1}`}
                            />
                            <RiDeleteBinLine
                                onClick={() => removeOption(optionIndex)}
                                style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px', lineHeight: 0, color: '#d32f2f' }}
                            />
                        </div>
                    ))}
                </div>

                {errorMessage && <p className='create-event-error-message'>{errorMessage}</p>}
                {succesMessage && <p className='create-event-succes-message'>{succesMessage}</p>}
                <div className='create-event-item-buttons'>
                    <button onClick={addOptionHandler}>Add Option</button>
                    <div>
                        <button onClick={handleReset}>Reset form</button>
                        <button onClick={handleSubmit}>{method === 'create' ? 'Create Poll' : 'Update Poll'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPoll;
