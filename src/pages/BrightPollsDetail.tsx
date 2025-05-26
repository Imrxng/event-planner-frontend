import { IoMdClock, IoMdPerson } from "react-icons/io";
import { IoCalendarClearOutline } from "react-icons/io5";
import LinkBack from "../components/LinkBack";
import ProgressBarVote from "../components/polls/ProgressBarVote";
import "../styles/pollsDetail.component.css";
import profile from "../assets/images/profile.webp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import Unauthorized from "../components/Unauthorized";
import useAccessToken from "../utilities/getAccesToken";
import { useContext, useEffect, useState } from "react";
import { MongoDbUser, Option, Poll } from "../types/types";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import ConfirmVoteModal from "../modals/ConfirmVoteModal";
import { UserContext } from "../context/context";
import ShareButton from "../components/globals/ShareButton";
import ReportModal from "../modals/ReportModal";
import { MdOutlineEdit } from "react-icons/md";
import { fetchImageWithToken } from "../utilities/imageUtilities";
import { RiDeleteBinLine } from "react-icons/ri";
import DeletePollModal from "../modals/DeletePollModal";

const BrightPollsDetail = () => {
  const [poll, setPoll] = useState<Poll>();
  const [createdBy, setCreatedBy] = useState<MongoDbUser>();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const server = import.meta.env.VITE_SERVER_URL;
  const location = useLocation();
  const { getAccessToken } = useAccessToken();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const token = await getAccessToken();
        const response = await fetch(`${server}/api/polls/detail/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setPoll(undefined);
          throw new Error("Failed to fetch poll data");
        }

        const data = await response.json();
        setPoll(data.poll);

        const userResponse = await fetch(
          `${server}/api/users/${data.poll.createdBy}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        if (!userResponse.ok) {
          setCreatedBy(undefined);
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        userData.user.picture = await fetchImageWithToken(
          userData.user._id,
          token,
        );
        setCreatedBy(userData.user);

        const votedOption = data.poll.options.find((option: Option) =>
          option.votersId.includes(userData.user._id),
        );
        if (votedOption) {
          setSelectedOption(votedOption.text);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setDataLoaded(true);
        }, 200);
      }
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, server]);

  useEffect(() => {
    if (isAuthenticated && dataLoaded && (!poll || !createdBy)) {
      navigate("/not-found");
    }
  }, [createdBy, dataLoaded, isAuthenticated, navigate, poll]);

  if (!poll || !createdBy) {
    return <FullscreenLoader content="Gathering data..." />;
  }

  const votes: number = poll.options.reduce(
    (acc, subject) => acc + subject.votes,
    0,
  );

  const currentDate = new Date(); // 2 mei 2025
  const pollEndDate = new Date(poll.endDate);
  const isPollClosed = currentDate > pollEndDate;

  return (
    <>
      <AuthenticatedTemplate>
        {reportOpen && (
          <ReportModal
            onClose={setReportOpen}
            targetId={poll._id}
            targetType="poll"
          />
        )}
        {openMessageModal && (
          <ConfirmVoteModal
            selectedOption={selectedOption}
            onClose={setOpenMessageModal}
            poll={poll}
            setPoll={setPoll}
          />
        )}
        {deleteModal && (
          <DeletePollModal
            onClose={setDeleteModal}
            poll={poll}
            navigateLink="/brightpolls"
          />
        )}
        <div className="poll-detail">
          <div id="brightpolls-detail-linkback-edit">
            <LinkBack
              href={
                location.state && location.state.admin
                  ? location.state.admin
                  : "/brightpolls"
              }
            />{" "}
            {(user && user.role === "admin") ||
            (user && user._id === poll.createdBy) ? (
              <div id="brightpolls-detail-edit-delete-container">
                <button
                  className="brightEventDetail-top-buttons"
                  onClick={() =>
                    navigate(`/brightpolls/requests/update/${poll._id}`)
                  }
                >
                  <MdOutlineEdit /> Edit
                </button>
                <button
                  className="brightEventDetail-top-buttons"
                  onClick={() => setDeleteModal(true)}
                >
                  <RiDeleteBinLine /> Delete
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="poll-detail__card">
            <div className="poll-detail__header">
              <div>
                <h1>{poll.question}</h1>
                <p>{poll.description}</p>
              </div>
              <div className="polls-item__header-right">
                <ShareButton id="share-button-poll-container" />
                <button
                  id="report-button"
                  style={{ position: "relative", top: "0", right: "0" }}
                  onClick={() => setReportOpen(true)}
                >
                  Report
                </button>
                <img
                  style={{ width: "4rem", height: "4rem" }}
                  src={
                    createdBy?.picture !== "not-found"
                      ? createdBy.picture
                      : profile
                  }
                  alt="Poll"
                />
              </div>
            </div>
            <div className="poll-detail__content">
              <p className="poll-detail__description">
                <IoMdPerson /> Created by {createdBy.name}
              </p>
              <p className="poll-detail__description">
                <IoCalendarClearOutline /> Created at:{" "}
                {new Date(poll.createdAt).toLocaleDateString("nl-NL")}
              </p>
              <p className="poll-detail__description">
                <IoMdClock />{" "}
                {isPollClosed
                  ? "Vote period ended"
                  : `Vote until: ${new Date(poll.endDate).toLocaleDateString("nl-NL")}`}
              </p>
              <div className="poll-detail__votes">
                <ProgressBarVote
                  options={poll.options}
                  selectedOption={selectedOption}
                  onSelectOption={(text) => setSelectedOption(text)}
                />
              </div>
            </div>
            <div className="poll-detail__footer">
              <p>
                Total votes: <span>{votes}</span>
              </p>
              {!isPollClosed && (
                <button
                  style={{
                    marginTop: "2rem",
                    cursor: poll.options.some(
                      (option) =>
                        option.text === selectedOption &&
                        option.votersId.includes((user && user._id) || ""),
                    )
                      ? "not-allowed"
                      : "",
                  }}
                  onClick={() =>
                    selectedOption &&
                    !poll.options.some(
                      (option) =>
                        option.text === selectedOption &&
                        option.votersId.includes((user && user._id) || ""),
                    ) &&
                    setOpenMessageModal(true)
                  }
                >
                  {"Submit Vote"}
                </button>
              )}
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default BrightPollsDetail;
