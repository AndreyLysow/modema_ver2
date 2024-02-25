import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

const SvgComponent = ({ x, y, svgURL }) => {
  const [svgText, setSvgText] = useState(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(svgURL);
        const text = await response.text();
        setSvgText(text);
      } catch (error) {
        console.error("Ошибка при загрузке SVG:", error);
      }
    };

    loadSvg();
  }, [svgURL]);

  return (
    <ReactSVG
      x={x}
      y={y}
      src={svgText}
      beforeInjection={(svg) => {
        svg.setAttribute("width", "42");
        svg.setAttribute("height", "42");
      }}
    />
  );
};

export default SvgComponent;






