import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import ParticipationMenu from "../../globals/Participationmenu";
import LinkBack from "../../LinkBack";
import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../../../context/context";
import { EventFormData, MongoDbUser, Question } from "../../../types/types";
import profile from "../../../assets/images/profile.webp";
import FullscreenLoader from "../../spinner/FullscreenLoader";
import { capitalizeWords } from "../../../utilities/capitalizeWords";
import useAccessToken from "../../../utilities/getAccesToken";
import { fetchImageWithToken } from "../../../utilities/imageUtilities";

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

const FormEvent = ({
  onSubmit,
  setErrorMessage,
  setSuccessMessage,
  errorMessage,
  succesMessage,
  method,
  event,
  _id,
}: FormEventProps) => {
  const [users, setUsers] = useState<MongoDbUser[]>();
  const [selectedUsers, setSelectedUsers] = useState<MongoDbUser[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>(
    (event && event.title) || "",
  );
  const [eventDescription, setEventDescription] = useState<string>(
    (event && event.description) || "",
  );
  const [eventEmoji, setEventEmoji] = useState<string>(
    (event && event.emoji) || "",
  );
  const [eventStartDate, setEventStartDate] = useState<string>("");
  const [eventEndDate, setEventEndDate] = useState<string>("");
  const [eventAddress, setEventAddress] = useState<string>(
    (event && event.address) || "",
  );
  const [eventLocation, setEventLocation] = useState<string>(
    (event && event.location) || "",
  );
  const [isSelfPay, setIsSelfPay] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionsFrontEnd[]>([]);
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (!user) {
          return;
        }
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/users`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const data: { users: MongoDbUser[] } = await response.json();
        const allUsers = data.users.filter(
          (dataUser) => dataUser._id !== user._id,
        );
        const updatedUsers = await Promise.all(
          allUsers.map(async (dataUser) => {
            const imageUrl = await fetchImageWithToken(dataUser._id, token);

            return { ...dataUser, picture: imageUrl || dataUser.picture };
          }),
        );
        setUsers(updatedUsers);

        if (event) {
          const startDate = event.startDate ? new Date(event.startDate) : null;
          const endDate = event.endDate ? new Date(event.endDate) : null;

          setEventStartDate(
            startDate ? startDate.toISOString().split("T")[0] : "",
          );
          setEventEndDate(endDate ? endDate.toISOString().split("T")[0] : "");

          setEventStartTime(
            startDate
              ? `${startDate.getHours().toString().padStart(2, "0")}:${startDate.getMinutes().toString().padStart(2, "0")}`
              : "",
          );
          setEventEndTime(
            endDate
              ? `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
              : "",
          );

          setIsSelfPay(
            event.paidByBrightest
              ? "true"
              : event.paidByBrightest === false
                ? "false"
                : "",
          );

          const selectedUserObjects = event.organizors
            .map((organizerId) =>
              allUsers.find((user) => user._id === organizerId),
            )
            .filter((user): user is MongoDbUser => user !== undefined);

          setSelectedUsers(selectedUserObjects || []);

          const processedQuestions = event.form.map((question: Question) => {
            const isMultipleChoice =
              question.possibleAnswers && question.possibleAnswers.length > 0;
            return {
              ...question,
              multipleChoice: isMultipleChoice,
              options: isMultipleChoice ? question.possibleAnswers : [],
            };
          });
          setQuestions(processedQuestions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, user, server]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading || !users) {
    return <FullscreenLoader content="Gathering data..." />;
  }

  const filteredUsers: MongoDbUser[] = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (user: MongoDbUser) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((selectedUser) => selectedUser._id === user._id)) {
        return prevSelected.filter(
          (selectedUser) => selectedUser._id !== user._id,
        );
      } else {
        return [...prevSelected, user];
      }
    });
  };
  if (loading || !users) {
    return <FullscreenLoader content="Gathering data..." />;
  }

  const handleReset = () => {
    setEventTitle("");
    setEventEndTime("");
    setEventStartTime("");
    setEventDescription("");
    setEventEmoji("");
    setEventStartDate("");
    setEventEndDate("");
    setEventAddress("");
    setIsSelfPay("");
    setEventLocation("");
    setSelectedUsers([]);
    setQuestions([]);
    setErrorMessage("");
  };
  const handleSelectNobody = () => {
    setSelectedUsers([]);
    setDropdownVisible((prevState) => !prevState);
  };

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
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
    setQuestions([
      ...questions,
      { question: "", multipleChoice: false, options: [] },
    ]);
  };

  const handleQuestionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = event.target.value;
    setQuestions(updatedQuestions);
  };

  const toggleMultipleChoice = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].multipleChoice =
      !updatedQuestions[index].multipleChoice;
    updatedQuestions[index].options = ["", ""];
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    index: number,
    optionIndex: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = event.target.value;
    setQuestions(updatedQuestions);
  };

  const addOption = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };
  const convertToBackendFormat = (
    questions: QuestionsFrontEnd[],
  ): Question[] => {
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
    setSuccessMessage("");

    if (
      eventDescription === "" ||
      eventAddress === "" ||
      eventEmoji === "" ||
      eventLocation === "" ||
      isSelfPay === null ||
      eventStartDate === "" ||
      eventStartTime === "" ||
      eventTitle === ""
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (eventEndDate && eventEndTime === "") {
      setErrorMessage("Please fill in the end time or remove the end date.");
      return;
    }

    if (eventTitle.length < 5 || eventTitle.length > 20) {
      setErrorMessage("Event title must be between 5 and 20 characters.");
      return;
    }

    if (eventDescription.length < 1 || eventDescription.length > 200) {
      setErrorMessage(
        "Event description must be between 1 and 200 characters.",
      );
      return;
    }

    const checkEmojiNumberSpecialChar = (substring: string) => {
      const emojiRegex =
        /(?:\p{Emoji}(?:\p{Emoji_Modifier}|\uFE0F)?(?:\u200D\p{Emoji})*)/gu;
      const numberOrSpecialCharRegex = /^[0-9]$|[.*+?^${}()|[\]\\]/;
      return (
        emojiRegex.test(substring) && !numberOrSpecialCharRegex.test(substring)
      );
    };

    if (!checkEmojiNumberSpecialChar(eventEmoji)) {
      setErrorMessage(
        "Please enter a valid emoji without numbers or special characters.",
      );
      return;
    }

    const [startYear, startMonth, startDay] = eventStartDate
      .split("-")
      .map(Number);
    const [startHour, startMinute] = eventStartTime.split(":").map(Number);

    if (startYear < 2024 || startYear > 2030) {
      setErrorMessage("Please enter a valid year between 2024 and 2030.");
      return;
    }

    if (startHour > 23 || startMinute > 59) {
      setErrorMessage("Invalid start time. Use 00:00 for midnight, not 24:00.");
      return;
    }

    const startDateTime = new Date(
      startYear,
      startMonth - 1,
      startDay,
      startHour,
      startMinute,
    );

    let endDateTime: Date | undefined = undefined;
    if (eventEndDate && eventEndTime) {
      const [endYear, endMonth, endDay] = eventEndDate.split("-").map(Number);
      const [endHour, endMinute] = eventEndTime.split(":").map(Number);

      if (endYear < 2024 || endYear > 2030) {
        setErrorMessage("Please enter a valid end year between 2024 and 2030.");
        return;
      }

      if (endHour > 23 || endMinute > 59) {
        setErrorMessage("Invalid end time. Use 00:00 for midnight, not 24:00.");
        return;
      }

      endDateTime = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

      if (endDateTime < startDateTime) {
        setErrorMessage(
          "End date/time cannot be earlier than start date/time.",
        );
        return;
      }
    }

    if (eventAddress.length < 2) {
      setErrorMessage("Please provide a valid address.");
      return;
    }

    setEventAddress(capitalizeWords(eventAddress));

    if (startDateTime < new Date()) {
      setErrorMessage("The selected date must be in the future.");
      return;
    }

    if (isSelfPay === undefined) {
      setErrorMessage(
        "Please indicate if it's self-paid or covered by the company",
      );
      return;
    }

    const seenQuestions = new Set();

    for (const question of questions) {
      const trimmedQuestion = question.question.trim();

      if (trimmedQuestion === "") {
        setErrorMessage("Please fill in all questions.");
        return;
      }

      if (seenQuestions.has(trimmedQuestion.toLowerCase())) {
        setErrorMessage("Duplicate questions are not allowed.");
        return;
      }

      seenQuestions.add(trimmedQuestion.toLowerCase());

      if (question.multipleChoice && question.options.length < 2) {
        setErrorMessage(
          "Each multiple choice question must have at least two options.",
        );
        return;
      }

      if (question.multipleChoice) {
        for (const option of question.options) {
          if (option === "") {
            setErrorMessage("Please fill in all options.");
            return;
          }
          if (option.length < 2) {
            setErrorMessage("Option length must be 2 characters or more.");
            return;
          }
        }
      }
    }

    const eventData = {
      title: eventTitle,
      description: eventDescription,
      emoji: eventEmoji,
      startDate: startDateTime,
      endDate: endDateTime,
      address: eventAddress,
      location: eventLocation,
      paidByBrightest: isSelfPay === "true",
      organizors: selectedUsers.map((user) => user._id),
      form: convertToBackendFormat(questions),
      createdBy: user!._id,
    };

    onSubmit(eventData);
  };

  const links = [
    { to: "/brightevents/requests", text: "Recents requests" },
    { to: "/brightevents/requests/declined", text: "Declined requests" },
    { to: "/brightevents/requests/new", text: "New request" },
  ];
  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    setEventDescription("");
    const pastedText = e.clipboardData.getData("text").trim();
    setEventDescription((prev) => prev + pastedText);
  };

  return (
    <div id="create-event-container">
      <div id="create-event-container-top">
        <LinkBack
          href={
            method === "update"
              ? (_id && `/brightevents/${_id}`) || ""
              : "/brightevents/requests"
          }
        />
        {location.pathname.includes("/brightevents/requests/update/") && (
          <ParticipationMenu links={links} />
        )}
        <p></p>
      </div>
      <div id="create-event-form">
        <div className="create-event-item">
          <label htmlFor="create-event-title">
            Title <span id="red">*</span>
          </label>
          <input
            type="text"
            name="create-event-title"
            id="create-event-title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-description">
            Description <span id="red">*</span>
          </label>
          <textarea
            name="create-event-description"
            id="create-event-description"
            value={eventDescription}
            onChange={handleDescriptionChange}
            onPaste={handlePaste}
          />
          <p id="create-event-characters-limit">
            {eventDescription.length}/200 characters
          </p>
        </div>
        <div className="create-event-item-date">
          <label htmlFor="create-event-start-date">
            Start date <span id="red">*</span>
          </label>
          <div
            className="create-event-item-dates"
            style={{ marginBottom: "1rem" }}
          >
            <input
              type="date"
              name="create-event-start-date"
              id="create-event-start-date"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
            />
            <input
              type="time"
              name="create-event-start-time"
              id="create-event-start-date"
              value={eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="create-event-item-date">
          <label htmlFor="create-event-end-date">End date</label>
          <div className="create-event-item-dates">
            <input
              type="date"
              name="create-event-end-date"
              id="create-event-end-date"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
            />
            <input
              type="time"
              name="create-event-end-time"
              id="create-event-start-date"
              value={eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="create-event-item">
          <label htmlFor="create-event-address">
            Address <span id="red">*</span>
          </label>
          <input
            type="text"
            name="create-event-address"
            id="create-event-address"
            value={eventAddress}
            onChange={(e) => setEventAddress(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-emoji">
            Emoji <span id="red">*</span>
          </label>
          <input
            type="text"
            name="create-event-emoji"
            id="create-event-emoji"
            value={eventEmoji}
            onChange={(e) => setEventEmoji(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-co-organizors">Co-Organizers</label>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button className="custom-dropdown-button" onClick={clickHandler}>
              Select co-organizers{" "}
              {dropdownVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
            <div
              id="user-dropdown-list"
              className={`dropdown-list ${dropdownVisible ? "show" : ""}`}
            >
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div
                className="dropdown-item"
                onClick={handleSelectNobody}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                <span>No one (Nobody)</span>
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="dropdown-item"
                  onClick={() => handleSelect(user)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedUsers.some(
                      (selectedUser) => selectedUser._id === user._id,
                    )
                      ? "#e0e0e0"
                      : "transparent",
                  }}
                >
                  {selectedUsers.some(
                    (selectedUser) => selectedUser._id === user._id,
                  ) && (
                    <span style={{ marginRight: "10px", color: "#4caf50" }}>
                      ✔
                    </span>
                  )}
                  <img
                    src={user.picture === "not-found" ? profile : user.picture}
                    alt={user.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {selectedUsers.map((user, index) => (
              <div key={index} id="create-event-user-box">
                <div id="create-event-user-subbox">
                  <img
                    src={user.picture === "not-found" ? profile : user.picture}
                    alt={"picture" + user.name}
                  />
                  <div>
                    <p>{user.name}</p>
                  </div>
                </div>
                <RiDeleteBinLine onClick={() => handleSelect(user)} />
              </div>
            ))}
          </div>
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-location">
            Region <span id="red">*</span>
          </label>
          <select
            name="create-event-location"
            id="create-event-location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          >
            <option value="" selected hidden disabled>
              --selected--
            </option>
            <option value="all">All Regions</option>
            <option value="Brightest East">Brightest East</option>
            <option value="Brightest North">Brightest North</option>
            <option value="Brightest West">Brightest West</option>
          </select>
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-selfpay">
            Paid by<span id="red">*</span>
          </label>
          <select
            name="create-event-selfpay"
            id="create-event-selfpay"
            value={isSelfPay}
            onChange={(e) => setIsSelfPay(e.target.value)}
          >
            <option value="" selected disabled hidden>
              --selected--
            </option>
            <option value="brightest">Paid by Brightest</option>
            <option value="self">Not paid by Brightest</option>
          </select>
        </div>
        <div className="create-event-item">
          <label htmlFor="">Question(s) for participants</label>
        </div>
        <div id={"create-event-question-container"}>
          {questions.map((question, index) => (
            <div key={index} className="create-event-item-question-item">
              <div id="create-event-question-label-input">
                <div className="create-event-question-label-input-top">
                  <label htmlFor={`create-event-question-${index}`}>
                    Question {index + 1} <span id="red">*</span>
                  </label>
                  <RiDeleteBinLine
                    onClick={() => removeQuestion(index)}
                    style={{
                      cursor: "pointer",
                      marginLeft: "5px",
                      fontSize: "20px",
                      lineHeight: 0,
                      color: "#d32f2f",
                    }}
                  />
                </div>
                <div className="create-event-question-label-input-top">
                  <input
                    type="text"
                    name={`create-event-question-${index}`}
                    id={`create-event-question-${index}`}
                    value={question.question}
                    className="create-event-question-text-input"
                    onChange={(e) => handleQuestionChange(index, e)}
                    placeholder="Enter your question here"
                  />
                  <p></p>
                </div>
              </div>
              <div>
                <div id="create-event-toggle-container">
                  <button
                    id="create-event-toggle"
                    className={question.multipleChoice ? "active" : ""}
                    onClick={() => toggleMultipleChoice(index)}
                  ></button>
                  <p>
                    {question.multipleChoice
                      ? "Disable Multiple Choice"
                      : "Enable Multiple Choice"}
                  </p>
                </div>

                {question.multipleChoice && (
                  <div id="create-event-question-add-option-container">
                    <button
                      id="create-event-question-add-option-button"
                      onClick={() => addOption(index)}
                    >
                      Add Option
                    </button>
                    {question.options.length > 0 ? (
                      <label htmlFor="">
                        Possible answers <span id="red">*</span>
                      </label>
                    ) : (
                      <></>
                    )}
                    {question.options.map((option, optionIndex) => (
                      <div
                        id="create-event-question-add-option-bin-textinput"
                        key={optionIndex}
                      >
                        <input
                          type="text"
                          value={option}
                          className="create-event-question-text-input"
                          onChange={(e) =>
                            handleOptionChange(index, optionIndex, e)
                          }
                          placeholder={`Answer ${optionIndex + 1}`}
                        />
                        <RiDeleteBinLine
                          onClick={() => removeOption(index, optionIndex)}
                          style={{
                            cursor: "pointer",
                            marginLeft: "5px",
                            fontSize: "20px",
                            lineHeight: 0,
                            color: "#d32f2f",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {errorMessage && (
          <p className="create-event-error-message">{errorMessage}</p>
        )}
        {succesMessage && (
          <p className="create-event-succes-message">{succesMessage}</p>
        )}
        <div className="create-event-item-buttons">
          <button onClick={addQuestionHandler}>Add Question</button>
          <div>
            <button onClick={handleReset}>Reset form</button>
            <button onClick={handleSubmit}>
              {method === "create" ? "Create Event" : "Update Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEvent;
