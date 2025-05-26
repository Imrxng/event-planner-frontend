import { useState } from "react";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import "../styles/CreateEvent.component.css";
import { PollFormData } from "../types/types";
import FormPoll from "../components/events/requests/FormPoll";
import useAccessToken from "../utilities/getAccesToken";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";

const CreatePoll = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>("");
  const { getAccessToken } = useAccessToken();

  const server = import.meta.env.VITE_SERVER_URL;

  const createPoll = async (pollData: PollFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      const token = await getAccessToken();
      const response = await fetch(`${server}/api/polls`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSuccessMessage("Your poll was succesfully created.");
      setErrorMessage("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AuthenticatedTemplate>
        {loading && <FullscreenLoader content="Requesting poll..." />}
        <FormPoll
          onSubmit={createPoll}
          setErrorMessage={setErrorMessage}
          setSuccessMessage={setSuccessMessage}
          succesMessage={succesMessage}
          errorMessage={errorMessage}
          method="create"
        />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default CreatePoll;
