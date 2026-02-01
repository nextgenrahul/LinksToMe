import { useNavigate } from "react-router-dom";

interface LinksToMeProps {
  className?: string;
  showBg?: boolean;
}

const LinksToMe = ({ className = "", showBg = false }: LinksToMeProps) => {
  const navigate = useNavigate();
  function pageNavigate(){
    navigate("http://localhost:5173/")
  }
  return (
    <header
      className={`px-6 py-10 flex items-center h-16 cursor-pointer ${
        showBg ? "bg-black text-white" : "bg-transparent"
      } ${className}`}
      onClick={pageNavigate}
    >
      <div className="keyboard">
        <span className="key">L</span>
        <span className="key">i</span>
        <span className="key">n</span>
        <span className="key">k</span>
        <span className="key">s</span>
        <span className="key">To</span>
        <span className="key">M</span>
        <span className="key">e</span>
      </div>
    </header>
  );
};

export default LinksToMe;
