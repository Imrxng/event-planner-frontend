import { useAuth0 } from '@auth0/auth0-react';
import '../../styles/fullscreenloader.component.css';

interface FullscreenLoaderProps {
  content: string;
}

const FullscreenLoader = ({ content }: FullscreenLoaderProps) => {
  const { isLoading } = useAuth0();
  
  if (isLoading && content === 'Logging in...' || !isLoading) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner"></div>
        <p>{content}</p>
      </div>
    );
  } 

  return null;  
};

export default FullscreenLoader;
