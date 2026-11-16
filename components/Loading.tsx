import MascotLoader from "./MascotLoader";

/** Full-screen loader shown while the session and dashboard boot. */
const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <MascotLoader label="Loading your dashboard..." />
    </div>
  );
};

export default Loading;
