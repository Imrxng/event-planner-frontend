import { useContext, useEffect, useState } from "react";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import "../styles/CreateEvent.component.css";
import { useNavigate, useParams } from "react-router-dom";
import { PollFormData } from "../types/types";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import FormPoll from "../components/events/requests/FormPoll";
import { UserContext } from "../context/context";

const UpdatePoll = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>("");
  const [pollData, setPollData] = useState<PollFormData>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken } = useAccessToken();
  const { user } = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();

        const response = await fetch(`${server}/api/polls/detail/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/not-found");
          } else {
            throw new Error("Failed to fetch poll data");
          }
        }

        const data = await response.json();
        setPollData(data.poll);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, server]);

  const updatePoll = async (pollDataForm: PollFormData) => {
    try {
      if (!user) return;
      setLoading(true);
      setErrorMessage("");
      const token = await getAccessToken();

      const updatedOptions = pollDataForm.options.map((newOption, index) => {
        const oldOption = pollData?.options
          ? (pollData.options[index] as unknown as {
              text: string;
              votes: number;
            })
          : null;

        if (oldOption && oldOption.text === newOption) {
          return {
            text: newOption,
            votes: oldOption.votes,
          };
        } else {
          return {
            text: newOption,
            votes: 0,
          };
        }
      });

      const response = await fetch(`${server}/api/polls/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: pollDataForm.question,
          description: pollDataForm.description,
          location: pollDataForm.location,
          options: updatedOptions,
          userId: user._id,
          endDate: pollDataForm.endDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const data = await response.json();
      setPollData(data);
      setSuccessMessage("The poll has been updated successfully");
      setErrorMessage("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        console.log(error);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      setTimeout(() => {
        navigate("/brightpolls");
      }, 500);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!pollData) {
    return;
  }
  return (
    <>
      <AuthenticatedTemplate>
        <FormPoll
          poll={pollData}
          _id={id}
          onSubmit={updatePoll}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          succesMessage={succesMessage}
          errorMessage={errorMessage}
          method="update"
        />
        {loading && <FullscreenLoader content="Updating poll..." />}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default UpdatePoll;
