import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { formatName } from "../../../utilities/formatName";
import ParticipationMenu from "../../globals/Participationmenu";
import LinkBack from "../../LinkBack";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../../../context/context";
import { EventFormData, MongoDbUser, Question } from "../../../types/types";
import FullscreenLoader from "../../spinner/FullscreenLoader";
import { capitalizeWords } from "../../../utilities/capitalizeWords";

interface QuestionsFrontEnd {
    multipleChoice: boolean;
    options: string[];
    question: string;
}

interface FormEventProps {
    onSubmit: (eventData: EventFormData) => void;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    succesMessage: string;
    errorMessage: string;
    method: string;
    event?: EventFormData;
    _id?: string;
}

const FormEvent = ({ onSubmit, setErrorMessage, setSuccessMessage, errorMessage, succesMessage, method, event, _id }: FormEventProps) => {
    const [users, setUsers] = useState<MongoDbUser[]>();
    const [selectedUsers, setSelectedUsers] = useState<MongoDbUser[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [eventTitle, setEventTitle] = useState<string>(event && event.title || '');
    const [eventDescription, setEventDescription] = useState<string>(event && event.description || '');
    const [eventEmoji, setEventEmoji] = useState<string>(event && event.emoji || '');
    const [eventStartDate, setEventStartDate] = useState<string>('');
    const [eventEndDate, setEventEndDate] = useState<string>('');
    const [eventAddress, setEventAddress] = useState<string>(event && event.address || '');
    const [eventLocation, setEventLocation] = useState<string>(event && event.location || '');
    const [isSelfPay, setIsSelfPay] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [questions, setQuestions] = useState<QuestionsFrontEnd[]>([]);
    const { getAccessTokenSilently } = useAuth0();
    const mongoDbUser = useContext(UserContext);
    const server = import.meta.env.VITE_SERVER_URL;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${server}/api/users`, {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event data');
                }

                const data: { users: MongoDbUser[] } = await response.json();
                const allUsers = data.users.filter((user) => user._id !== mongoDbUser?._id);
                setUsers(allUsers);

                if (event) {
                    const startDate = event.startDate ? new Date(event.startDate) : null;
                    const endDate = event.endDate ? new Date(event.endDate) : null;

                    setEventStartDate(startDate ? startDate.toISOString().split('T')[0] : '');
                    setEventEndDate(endDate ? endDate.toISOString().split('T')[0] : '');

                    setIsSelfPay(event.paidByBrightest ? 'true' : event.paidByBrightest === false ? 'false' : '');

                    const selectedUserObjects = event.organizors
                        .map((organizerId) => allUsers.find((user) => user._id === organizerId))
                        .filter((user): user is MongoDbUser => user !== undefined);

                    setSelectedUsers(selectedUserObjects || []);

                    const processedQuestions = event.form.map((question: Question) => {
                        const isMultipleChoice = question.possibleAnswers && question.possibleAnswers.length > 0;
                        return {
                            ...question,
                            multipleChoice: isMultipleChoice,
                            options: isMultipleChoice ? question.possibleAnswers : [],
                        };
                    });
                    setQuestions(processedQuestions);

                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [event, getAccessTokenSilently, mongoDbUser?._id, server]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading || !users) {
        return <FullscreenLoader content='Gathering data...' />;
    }

    const filteredUsers: MongoDbUser[] = users.filter((user) =>
        formatName(user.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (user: MongoDbUser) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.some((selectedUser) => selectedUser._id === user._id)) {
                return prevSelected.filter((selectedUser) => selectedUser._id !== user._id);
            } else {
                return [...prevSelected, user];
            }
        });
    };
    if (loading || !users) {
        return <FullscreenLoader content='Gathering data...' />;
    }

    const handleReset = () => {
        setEventTitle('');
        setEventDescription('');
        setEventEmoji('');
        setEventStartDate('');
        setEventEndDate('');
        setEventAddress('');
        setIsSelfPay('');
        setEventLocation('');
        setSelectedUsers([]);
        setQuestions([]);
        setErrorMessage('');
    };
    const handleSelectNobody = () => {
        setSelectedUsers([]);
        setDropdownVisible((prevState) => !prevState);
    };

    const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        setDropdownVisible((prevState) => !prevState);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 200) {
            setEventDescription(e.target.value);
        }
    };
    const removeQuestion = (index: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };
    const addQuestionHandler = () => {
        setQuestions([...questions, { question: '', multipleChoice: false, options: ['', ''] }]);
    };

    const handleQuestionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = event.target.value;
        setQuestions(updatedQuestions);
    };

    const toggleMultipleChoice = (index: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].multipleChoice = !updatedQuestions[index].multipleChoice;
        updatedQuestions[index].options = [];
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (index: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex] = event.target.value;
        setQuestions(updatedQuestions);
    };

    const addOption = (index: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.push('');
        setQuestions(updatedQuestions);
    };
    const convertToBackendFormat = (questions: QuestionsFrontEnd[]): Question[] => {
        return questions.map((q) => ({
            question: q.question,
            possibleAnswers: q.options,
        }));
    };
    const removeOption = (index: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options.splice(optionIndex, 1);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = () => {
        setSuccessMessage('');
        if (eventDescription === '' || eventAddress === '' || eventEmoji === '' || eventLocation === '' || isSelfPay === null || eventStartDate === '' || eventTitle === '') {
            setErrorMessage('Please fill in all required fields.');
            return;
        }
        if (eventTitle.length < 10 || eventTitle.length > 50) {
            setErrorMessage('Event title must be between 10 and 50 characters.');
            return;
        }
        if (eventDescription.length < 50 || eventDescription.length > 200) {
            setErrorMessage('Event description must be between 50 and 200 characters.');
            return;
        }

        const emojiRegex = /(?:[\uD83C][\uDDE6-\uDDFF]|[\uD83D][\uDE00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]|[\uD83E][\uDD00-\uDDFF]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u2300-\u23FF]|[\u2B00-\u2BFF]|[\u2100-\u214F])+/g;

        if (!emojiRegex.test(eventEmoji)) {
            setErrorMessage('Please enter a valid emoji.');
            return;
        }
        if (eventEndDate && new Date(eventEndDate) < new Date(eventStartDate)) {
            setErrorMessage('End date cannot be earlier than start date.');
            return;
        }

        if (eventAddress.length < 2) {
            setErrorMessage('Please provide a valid address.');
            return;
        }
        setEventAddress(capitalizeWords(eventAddress));
        
        if (new Date(eventStartDate) < new Date()) {
            setErrorMessage('The selected date must be in the future.');
            return;
        }

        if (isSelfPay === undefined) {
            setErrorMessage('Please indicate if i self-paid or covered by the company');
            return;
        }

        for (const question of questions) {
            if (question.question.trim() === '') {
                setErrorMessage('Please fill in all questions.');
                return;
            }

            if (question.multipleChoice && question.options.length < 2) {
                setErrorMessage('Each multiple choice question must have at least two options.');
                return;
            }

            if (question.multipleChoice) {
                for (const option of question.options) {
                    if (option === '') {
                        setErrorMessage('Please fill in all options.');
                        return;
                    }
                    if (option.length < 2) {
                        setErrorMessage('Option length must be 2 characters or more.');
                        return;
                    }
                }
            }
        }
        const eventData = {
            title: eventTitle,
            description: eventDescription,
            emoji: eventEmoji,
            startDate: new Date(eventStartDate),
            endDate: eventEndDate === '' ? undefined : new Date(eventEndDate),
            address: eventAddress,
            location: eventLocation,
            paidByBrightest: isSelfPay === 'true' ? true : false,
            organizors: selectedUsers.map(user => user._id),
            form: convertToBackendFormat(questions),
            createdBy: mongoDbUser!._id,
        };

        onSubmit(eventData);
        handleReset();
    };
    const links = [
        { to: "/brightevents/requests", text: "Recents requests" },
        { to: "/brightevents/requests/declined", text: "Declined requests" },
        { to: "/brightevents/requests/new", text: "New request" }
    ];

    return (
        <div id='create-event-container'>
            <div id='create-event-container-top'>
                <LinkBack href={method === 'update' ? _id && `/brightevents/${_id}` || '' : '/brightevents/requests'} />
                <ParticipationMenu links={links} />
                <p></p>
            </div>
            <div id='create-event-form'>
                <div className='create-event-item'>
                    <label htmlFor='create-event-title'>Title <span id='red'>*</span></label>
                    <input
                        type='text'
                        name='create-event-title'
                        id='create-event-title'
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-description'>Description <span id='red'>*</span></label>
                    <textarea
                        name='create-event-description'
                        id='create-event-description'
                        value={eventDescription}
                        onChange={handleDescriptionChange}
                    />
                    <p id='create-event-characters-limit'>{eventDescription.length}/200 characters</p>
                </div>
                <div className='create-event-item-dates'>
                    <div className='create-event-item-date'>
                        <label htmlFor='create-event-start-date'>Start date <span id='red'>*</span></label>
                        <input
                            type='date'
                            name='create-event-start-date'
                            id='create-event-start-date'
                            value={eventStartDate}
                            onChange={(e) => setEventStartDate(e.target.value)}
                        />
                    </div>
                    <div className='create-event-item-date'>
                        <label htmlFor='create-event-end-date'>End date</label>
                        <input
                            type='date'
                            name='create-event-end-date'
                            id='create-event-end-date'
                            value={eventEndDate}
                            onChange={(e) => setEventEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-address'>Address <span id='red'>*</span></label>
                    <input
                        type='text'
                        name='create-event-address'
                        id='create-event-address'
                        value={eventAddress}
                        onChange={(e) => setEventAddress(e.target.value)}
                    />
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-emoji'>Emoji <span id='red'>*</span></label>
                    <input
                        type='text'
                        name='create-event-emoji'
                        id='create-event-emoji'
                        value={eventEmoji}
                        onChange={(e) => setEventEmoji(e.target.value)}
                    />
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-co-organizors'>Co-Organizers</label>
                    <div className='custom-dropdown' ref={dropdownRef}>
                        <button className='custom-dropdown-button' onClick={clickHandler}>
                            Select co-organizers {dropdownVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                        </button>
                        <div id='user-dropdown-list' className={`dropdown-list ${dropdownVisible ? 'show' : ''}`}>
                            <input
                                type='text'
                                placeholder='Search users...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='search-input'
                            />
                            <div
                                className='dropdown-item'
                                onClick={handleSelectNobody}
                                style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}
                            >
                                <span>No one (Nobody)</span>
                            </div>
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className='dropdown-item'
                                    onClick={() => handleSelect(user)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedUsers.some((selectedUser) => selectedUser._id === user._id) ? '#e0e0e0' : 'transparent',
                                    }}
                                >
                                    {selectedUsers.some((selectedUser) => selectedUser._id === user._id) && (
                                        <span style={{ marginRight: '10px', color: '#4caf50' }}>✔</span>
                                    )}
                                    <img
                                        src={user.picture}
                                        alt={formatName(user.name)}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                    <span>{formatName(user.name)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        {selectedUsers.map((user, index) =>
                            <div key={index} id='create-event-user-box'>
                                <div id='create-event-user-subbox'>
                                    <p>{user.name.substring(0, 1).toUpperCase()}</p>
                                    <div>
                                        <p>{formatName(user.name)}</p>
                                        <p>{user.name}</p>
                                    </div>
                                </div>
                                <RiDeleteBinLine onClick={() => handleSelect(user)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-location'>Location <span id='red'>*</span></label>
                    <select
                        name='create-event-location'
                        id='create-event-location'
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                    >
                        <option value='' selected hidden disabled>--selected--</option>
                        <option value='all'>All Locations</option>
                        <option value='Brightest East'>Brightest East</option>
                        <option value='Brightest North'>Brightest North</option>
                        <option value='Brightest West'>Brightest West</option>
                    </select>
                </div>
                <div className='create-event-item'>
                    <label htmlFor='create-event-selfpay'>Paid by self <span id="red">*</span></label>
                    <select
                        name='create-event-selfpay'
                        id='create-event-selfpay'
                        value={isSelfPay}
                        onChange={(e) => setIsSelfPay(e.target.value)}
                    >
                        <option value='' selected disabled hidden>--selected--</option>
                        <option value='brightest'>Paid by Brightest</option>
                        <option value='self'>Paid by self</option>
                    </select>
                </div>
                <div className='create-event-item'>
                    <label htmlFor=''>Question(s) for participants</label>
                </div>
                <div id={'create-event-question-container'}>
                    {questions.map((question, index) => (
                        <div key={index} className='create-event-item-question-item'>
                            <div id='create-event-question-label-input'>
                                <div className='create-event-question-label-input-top'>
                                    <label htmlFor={`create-event-question-${index}`}>Question {index + 1} <span id="red">*</span></label>
                                    <RiDeleteBinLine
                                        onClick={() => removeQuestion(index)}
                                        style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px', lineHeight: 0, color: '#d32f2f' }}
                                    />
                                </div>
                                <div className='create-event-question-label-input-top'>
                                    <input
                                        type='text'
                                        name={`create-event-question-${index}`}
                                        id={`create-event-question-${index}`}
                                        value={question.question}
                                        className='create-event-question-text-input'
                                        onChange={(e) => handleQuestionChange(index, e)}
                                        placeholder='Enter your question here'
                                    />
                                    <p></p>
                                </div>
                            </div>
                            <div>
                                <div id='create-event-toggle-container'>
                                    <button id='create-event-toggle'
                                        className={question.multipleChoice ? 'active' : ''} onClick={() => toggleMultipleChoice(index)}></button>
                                    <p>
                                        {question.multipleChoice ? 'Disable Multiple Choice' : 'Enable Multiple Choice'}
                                    </p>
                                </div>

                                {question.multipleChoice && (
                                    <div id='create-event-question-add-option-container'>
                                        <button id='create-event-question-add-option-button' onClick={() => addOption(index)}>Add Option</button>
                                        {question.options.length > 0 ? <label htmlFor=''>Possible answers <span id="red">*</span></label> : <></>}
                                        {question.options.map((option, optionIndex) => (
                                            <div id='create-event-question-add-option-bin-textinput' key={optionIndex}>
                                                <input
                                                    type='text'
                                                    value={option}
                                                    className='create-event-question-text-input'
                                                    onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                                    placeholder={`Answer ${optionIndex + 1}`}
                                                />
                                                <RiDeleteBinLine
                                                    onClick={() => removeOption(index, optionIndex)}
                                                    style={{ cursor: 'pointer', marginLeft: '5px', fontSize: '20px', lineHeight: 0, color: '#d32f2f' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {errorMessage && <p className='create-event-error-message'>{errorMessage}</p>}
                {succesMessage && <p className='create-event-succes-message'>{succesMessage}</p>}
                <div className='create-event-item-buttons'>
                    <button onClick={addQuestionHandler}>Add Question</button>
                    <div>
                        <button onClick={handleReset}>Reset form</button>
                        <button onClick={handleSubmit}>{method === 'create' ? 'Create Event' : 'Update Event'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEvent;