import type { RefObject } from "react";

type VideoTutorialProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
};

export const VideoTutorial = ({
  videoRef,
}: VideoTutorialProps) => {
  return (
    <section id="video-tutorial" className="w-full">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm">
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className="aspect-video w-full object-contain"
        >
          <source
            src="/Documentos digitales.mp4"
            type="video/mp4"
          />

          Tu navegador no permite reproducir este video.
        </video>
      </div>
    </section>
  );
};