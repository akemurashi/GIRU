import { useRef } from "react";

import SidebarLayout from "../../Compartido/SidebarLayout";

import { GuideList } from "../Componentes/GuideList";
import { PageHeader } from "../Componentes/PageHeader";
import { VideoTutorial } from "../Componentes/Video";
import { VideoTutorials } from "../Componentes/VideoTutorials";
import { BestPractices } from "../Componentes/BestPractices";
import { UseCases } from "../Componentes/UseCases";

export default function PaginaAyuda() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const onSelectChapter = (seconds: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = seconds;

    videoRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    videoRef.current.play().catch(() => {});
  };

  return (
    <SidebarLayout>
      <PageHeader />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <VideoTutorial videoRef={videoRef} />

        <VideoTutorials
          onSelectChapter={onSelectChapter}
        />

        <GuideList />

        <BestPractices />

        <UseCases />
      </div>
    </SidebarLayout>
  );
}