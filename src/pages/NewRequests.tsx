import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {useState } from "react";
import LinkBack from "../components/LinkBack";
import ParticipationMenu from "../components/globals/Participationmenu";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import "../styles/request.component.css";
import RequestForm from "../components/events/requests/RequestForm";

const Newrequests = () => {
    const [loading, SetLoading] = useState<boolean>(false);
    const { isLoading } = useAuth0();
  
  
  
    const links = [
      { to: "/requests", text: "Recents requests" },
      { to: "/declinedRequests", text: "Declined requests" },
      { to: "/newrequests", text: "New requests" },
    ];
    return (
      <div className="requestcontainer">
        {loading && !isLoading ? (
          <FullscreenLoader content="Gathering data..." />
        ) : (
          <></>
        )}
        <div className="request-header_menu">
          <LinkBack href={"/"} />
          <ParticipationMenu links={links} />
        </div>
        <RequestForm />
      </div>
    );
  };
  
const MyrequestsPage = withAuthenticationRequired(Newrequests, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});
export default MyrequestsPage;
