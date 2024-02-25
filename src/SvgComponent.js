import React, { useEffect, useState } from "react";
import { Image } from "react-konva";

const SvgComponent = ({ x, y, svgURL }) => {
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
        console.error("Ошибка при загрузке SVG:", error);
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
    <Image
      x={x}
      y={y}
      image={image}
      width={42}
      height={42}
    />
  );
};

export default SvgComponent;






