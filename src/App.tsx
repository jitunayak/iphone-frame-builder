import { toPng } from "html-to-image";
import JSZip from "jszip";
import { useRef, useState } from "react";
import "./App.css";
import iphone16frame from "./assets/withframe__iphone.16.pro__black.png";

function App() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const iphoneFrameRefs = useRef<HTMLDivElement[]>([]);

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
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const promises = screenshots.map((_, index) =>
      toPng(iphoneFrameRefs.current[index], {}).then((dataUrl) =>
        zip.file(`screenshot-with-frame-${index + 1}.png`, dataUrl)
      )
    );
    await Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "screenshots-with-iphone-frames.zip";
        link.click();
      });
    });
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
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1rem",
          position: "fixed",
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "6px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
          zIndex: 3,
          top: "1rem",
          left: "1rem",
          right: "1rem",
        }}
      >
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          multiple
          onChange={handleImageChange}
        />
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: screenshots.length > 0 ? "#000" : "#ccc",
            color: screenshots.length > 0 ? "white" : "black",
          }}
        >
          {screenshots.length > 0
            ? `Download ${screenshots.length}`
            : "No Files"}
        </button>
        <button
          onClick={handleClear}
          style={{ backgroundColor: "#ccc", color: "black" }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: "5rem",
        }}
      >
        <div
          ref={(el) => (iphoneFrameRefs.current[0] = el! as any)}
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {screenshots.map((screenshot, index) => (
            <div
              style={{
                display: "flex",
                width: "auto",
                height: "30rem",
                justifyContent: "center",
              }}
            >
              <img
                key={index}
                src={screenshot}
                style={{
                  objectFit: "contain",
                  height: "30rem",
                  scale: "0.97",
                  zIndex: 1,
                  borderRadius: "2rem",
                }}
                alt="screenshot"
              />
              <img
                src={iphone16frame}
                alt="iphone 16 frame"
                style={{
                  position: "absolute",
                  height: "30rem",
                  zIndex: 2,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
