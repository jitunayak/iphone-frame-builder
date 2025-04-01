import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import "./App.css";
import iphone13Goldframe from "./assets/iphone13_gold.png";
import iphone13frame from "./assets/iphone_13_midnight.png";
import iphone16Naturalframe from "./assets/withframe__iphone.16.pro.max__natural.png";
import iphone16frame from "./assets/withframe__iphone.16.pro__black.png";

function App() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(iphone16frame);
  const iphoneFrameRefs = useRef<HTMLDivElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setScreenshots((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleClear = () => {
    setScreenshots([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const downloadPromises = screenshots.map((_, index) =>
      toPng(iphoneFrameRefs.current[index], {}).then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `screenshot-with-frame-${index + 1}.png`;
        link.click();
      })
    );
    await Promise.all(downloadPromises);
    setIsLoading(false);
  };

  const handleFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFrame(
      event.target.value === "iphone13"
        ? iphone13frame
        : event.target.value === "iphone13Gold"
        ? iphone13Goldframe
        : event.target.value === "iphone16"
        ? iphone16frame
        : event.target.value === "iphone16Natural"
        ? iphone16Naturalframe
        : iphone16frame
    );
  };

  return (
    <div
      style={{
        gap: "1rem",
        justifyContent: "center",
        justifyItems: "center",
        color: "black",
      }}
    >
      {screenshots.length === 0 && (
        <div>
          <h1>iPhone Frame Builder</h1>
          <div>Made by Jitu Nayak</div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1rem",
          position: "fixed",
          backgroundColor: "white",
          padding: "1rem 2rem",
          borderRadius: "6px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
          zIndex: 3,
          top: "1rem",
          left: "1rem",
          right: "1rem",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png, .jpg, .jpeg"
          multiple
          onChange={handleImageChange}
        />
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <select onChange={handleFrameChange}>
            <option value="iphone16">iPhone 16 Black</option>
            <option value="iphone16Natural">iPhone 16 Natural </option>
            <option value="iphone13">iPhone 13 Midnight</option>
            <option value="iphone13Gold">iPhone 13 Gold </option>
          </select>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleDownload}
              style={{
                backgroundColor: screenshots.length > 0 ? "#000" : "#ccc",
                color: screenshots.length > 0 ? "white" : "black",
              }}
            >
              {screenshots.length > 0
                ? `Download ${screenshots.length} frame${
                    screenshots.length > 1 ? "s" : ""
                  }`
                : "No Files"}
            </button>
            <button
              onClick={handleClear}
              style={{ backgroundColor: "#ccc", color: "black" }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div style={{ width: "100%", marginTop: "15rem" }}>Preparing...</div>
      )}
      <div
        style={{
          position: "relative",
          marginTop: isLoading ? "200rem" : "5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap",
            padding: "2rem",
          }}
        >
          {screenshots.map((screenshot, index) => (
            <div
              ref={(el) => (iphoneFrameRefs.current[index] = el! as any)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flexWrap: "wrap",
                padding: "2rem",
              }}
            >
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "flex",
                  width: "auto",
                  height: isLoading ? "130rem" : "30rem",
                  justifyContent: "center",
                }}
              >
                <img
                  key={index}
                  src={screenshot}
                  style={{
                    objectFit: "contain",
                    height: isLoading ? "130rem" : "30rem",
                    scale: "0.97",
                    zIndex: 1,
                    borderRadius: isLoading ? "8rem" : "2rem",
                  }}
                  alt="screenshot"
                />
                <img
                  src={selectedFrame}
                  alt="iphone 16 frame"
                  style={{
                    position: "absolute",
                    height: isLoading ? "130rem" : "30rem",
                    zIndex: 2,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
