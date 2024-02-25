import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, makeStyles } from "@material-ui/core";
import { saveAs } from "file-saver";
import SvgComponent from "./SvgComponent";
import "./DrawPanel.css";

const useStyles = makeStyles((theme) => ({
  toolPanel: {
    padding: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  saveButtons: {
    marginTop: theme.spacing(2),
    "& button": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: theme.spacing(1),
    },
  },
  drawArea: {
    flex: 1,
    border: "1px solid #ccc",
    position: "relative",
  },
}));

const DrawPanel = ({ width, height, selectedSvg }) => {
  const classes = useStyles();
  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    setLines([]);
  }, [selectedSvg]);

  const handleMouseDown = (e) => {
    const { nativeEvent: { offsetX, offsetY } } = e;
    setLines([...lines, { type: "line", points: [roundToGrid(offsetX, 20), roundToGrid(offsetY, 20)] }]);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) {
      return;
    }

    const { nativeEvent: { offsetX, offsetY } } = e;
    let lastLine = lines[lines.length - 1];

    const roundedX = roundToGrid(offsetX, 20);
    const roundedY = roundToGrid(offsetY, 20);

    if (lastLine.points[0] !== roundedX || lastLine.points[1] !== roundedY) {
      lastLine.points = [lastLine.points[0], lastLine.points[1], roundedX, roundedY];
      setLines([...lines.slice(0, -1), lastLine]);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleSaveJSON = () => {
    const jsonContent = JSON.stringify(lines, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    saveAs(blob, "drawing.json");
  };

  const handleSaveSVG = () => {
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${lines.map((item) => (
          item.type === "line" ? (
            `<polyline points="${item.points.join(",")}" stroke="#CF0A00" stroke-width="5" fill="none" />`
          ) : (
            `<image x="${item.x}" y="${item.y}" width="100" height="100" xlink:href="${item.src}" />`
          )
        )).join("")}
      </svg>
    `;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    saveAs(blob, "drawing.svg");
  };

  const Grid = () => {
    const gridSize = 20;
    const gridColor = "#ddd";

    const verticalLines = [];
    for (let i = gridSize; i < width; i += gridSize) {
      verticalLines.push(
        <line
          key={`vertical_${i}`}
          x1={i} y1={0} x2={i} y2={height}
          stroke={gridColor} strokeWidth={1}
        />
      );
    }

    const horizontalLines = [];
    for (let i = gridSize; i < height; i += gridSize) {
      horizontalLines.push(
        <line
          key={`horizontal_${i}`}
          x1={0} y1={i} x2={width} y2={i}
          stroke={gridColor} strokeWidth={1}
        />
      );
    }

    return (
      <>
        {verticalLines}
        {horizontalLines}
      </>
    );
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const svgPath = e.dataTransfer.getData("text/plain");
  
    if (stageRef.current) {
      const pointerPosition = {
        x: e.clientX,
        y: e.clientY,
      };
  
      if (pointerPosition) {
        const { x, y } = pointerPosition;
  
        const image = new window.Image();
        image.onload = () => {
          setLines([...lines, { type: "image", image, x, y }]);
        };
        image.src = svgPath;
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div className={classes.toolPanel}>
        <div className={classes.saveButtons}>
          <Button onClick={handleSaveJSON}>Сохранить как JSON</Button>
          <Button onClick={handleSaveSVG}>Сохранить как SVG</Button>
        </div>
        {selectedSvg && (
          <SvgComponent
            svgURL={selectedSvg}
            onDrop={handleImageDrop}
          />
        )}
      </div>

      <div
        className={classes.drawArea}
        onDragOver={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDrop={handleImageDrop}
      >
        <svg
          width={width}
          height={height}
          ref={stageRef}
        >
          <Grid />
          {lines.map((item, index) => (
            <g key={index}>
              {item.type === "line" && (
                <polyline
                  points={item.points.join(" ")}
                  stroke="#CF0A00"
                  strokeWidth={5}
                  fill="none"
                />
              )}
              {item.type === "image" && (
                <image
                  x={item.x}
                  y={item.y}
                  width={100}
                  height={100}
                  xlinkHref={item.src}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

const roundToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};

DrawPanel.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  selectedSvg: PropTypes.string,
};

export default DrawPanel;











