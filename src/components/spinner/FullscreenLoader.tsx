import { useMsal } from "@azure/msal-react";
import "../../styles/fullscreenloader.component.css";

interface FullscreenLoaderProps {
  content: string;
}

const FullscreenLoader = ({ content }: FullscreenLoaderProps) => {
  const { inProgress } = useMsal();

  if (
    (inProgress === "login" && content === "Logging in...") ||
    inProgress !== "login"
  ) {
    return (
      <div className="fullscreen-loader" role="alert" aria-live="assertive">
        <div className="spinner"></div>
        <p>{content}</p>
      </div>
    );
  }

  return null;
};

export default FullscreenLoader;
