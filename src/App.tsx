import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { VisualisationsPage } from "./components/AtomMenu";
import { DatasetPage } from "./components/DatasetPage";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/visualisations" || path === "/dataset") {
        return path;
      }
    }
    return "/";
  });

  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path === "/visualisations" || path === "/dataset" ? path : "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#172021] text-[#f7f7f5] flex flex-col font-sans">
      {/* 1. Global Preloader / Splash Screen Transition (8.5s automatic fade) */}
      {!splashFinished && (
        <SplashScreen
          durationMs={8500}
          onComplete={() => setSplashFinished(true)}
        />
      )}

      {/* 2. Top Navigation Bar conforming to Top Bar Contract */}
      <Navbar currentPath={currentPath} onNavigate={navigateTo} />

      {/* 3. Main Content Router */}
      <main className="flex-1 w-full">
        {currentPath === "/" && <LandingPage onNavigate={navigateTo} />}
        {currentPath === "/visualisations" && <VisualisationsPage />}
        {currentPath === "/dataset" && <DatasetPage />}
      </main>
    </div>
  );
}
