import '../../styles/fullscreenloader.component.css';

interface FullscreenLoaderProps {
  content: string;
}

const FullscreenLoader = ({ content } : FullscreenLoaderProps ) => {
  return (
    <div className="fullscreen-loader">
      <div className="spinner"></div>
      <p>{content}</p>
    </div>
  );
};

export default FullscreenLoader;
