import React, { useState, useEffect, useRef } from "react";
import DrawPanel from "./DrawPanel";

const svgs = require.context("../public", false, /\.svg$/);

const DrawInputPanel = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const dropTargetRef = useRef(null);

  const handleImageSelect = (imageName) => {
    const image = new window.Image();
    image.onload = () => {
      setSelectedImage(image);
    };
    image.src = process.env.PUBLIC_URL + "/" + imageName;
  };

  useEffect(() => {
    const firstImage = svgs.keys()[0].slice(2);
    handleImageSelect(firstImage);
  }, []);

  const handleDragStart = (e, imageName) => {
    e.dataTransfer.setData("text/plain", process.env.PUBLIC_URL + "/" + imageName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    const imagePath = dropTargetRef.current;
    if (imagePath) {
      handleImageSelect(imagePath);
    }
  };

  useEffect(() => {
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        {svgs.keys().map((imageName, index) => (
          <img
            key={index}
            src={process.env.PUBLIC_URL + "/" + imageName.slice(2)}
            alt={`Image ${index + 1}`}
            style={{ width: "100px", height: "100px", cursor: "grab", marginRight: "10px" }}
            draggable
            onDragStart={(e) => handleDragStart(e, imageName)}
            onClick={() => handleImageSelect(imageName)}
          />
        ))}
      </div>
      <div
        ref={dropTargetRef}
        style={{ border: "1px solid #ccc", width: `${props.width}px`, height: `${props.height}px` }}
        onDragOver={handleDragOver}
      >
        <DrawPanel width={props.width} height={props.height} selectedImage={selectedImage} />
      </div>
    </div>
  );
};

export default DrawInputPanel;








