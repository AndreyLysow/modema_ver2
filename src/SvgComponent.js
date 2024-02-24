import React, { useEffect, useState } from "react";
import { Shape } from "react-konva";

const SvgComponent = ({ x, y }) => {
  const svgURL = "/path/to/your/svg/file.svg"; // Замените на путь к вашему файлу SVG

  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(svgURL);
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const svgObjectURL = URL.createObjectURL(blob);
        const img = new window.Image();
        img.src = svgObjectURL;
        img.onload = () => setImage(img);
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    loadImage();

    return () => {
      if (image) {
        URL.revokeObjectURL(image.src);
      }
    };
  }, [svgURL, image]);

  return (
    <Shape
      x={x}
      y={y}
      sceneFunc={(context, shape) => {
        if (image) {
          context.drawImage(image, 0, 0, 42, 42);
          shape.getLayer().batchDraw();
        }
      }}
    />
  );
};

export default SvgComponent;
