import { useEffect, useRef } from "react";

const VideoPlayer = ({ src, onComplete }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return undefined;

    const handleEnded = () => {
      if (onComplete) onComplete();
    };

    player.addEventListener("ended", handleEnded);
    return () => player.removeEventListener("ended", handleEnded);
  }, [onComplete]);

  if (!src) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl bg-white/5 text-sm text-slate-300">
        Video not available
      </div>
    );
  }

  return (
    <video
      ref={playerRef}
      src={src}
      controls
      autoPlay
      preload="metadata"
      className="w-full rounded-3xl bg-black"
    />
  );
};

export default VideoPlayer;
