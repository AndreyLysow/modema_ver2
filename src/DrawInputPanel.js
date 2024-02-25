import React, { useState, useEffect } from "react";
import DrawPanel from "./DrawPanel";

const svgs = require.context("../public", false, /\.svg$/);

const DrawInputPanel = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (imageName) => {
    setSelectedImage(imageName);
  };

  useEffect(() => {
    handleImageSelect(svgs.keys()[0].slice(2));
  }, []);

  const handleDragStart = (e, imageName) => {
    e.dataTransfer.setData("image/svg+xml", imageName);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageName = e.dataTransfer.getData("image/svg+xml");
    handleImageSelect(imageName);
  };

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
            onDragStart={(e) => handleDragStart(e, imageName.slice(2))}
            onClick={() => handleImageSelect(imageName.slice(2))}
          />
        ))}
      </div>
      <div
        style={{ border: "1px solid #ccc", width: `${props.width}px`, height: `${props.height}px` }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DrawPanel width={props.width} height={props.height} selectedImage={selectedImage} />
      </div>
    </div>
  );
};

export default DrawInputPanel;











