import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Line, Group, Image } from "react-konva";
import { saveAs } from "file-saver";
import { Button, makeStyles } from "@material-ui/core";
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
  },
}));

const DrawPanel = (props) => {
  const classes = useStyles();
  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    setLines([]);
  }, [props.selectedSvg]);

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setLines([...lines, { type: "line", points: [roundToGrid(x, 20), roundToGrid(y, 20)] }]);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) {
      return;
    }

    const { x, y } = e.target.getStage().getPointerPosition();
    let lastLine = lines[lines.length - 1];

    const roundedX = roundToGrid(x, 20);
    const roundedY = roundToGrid(y, 20);

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
      <svg width="${props.width}" height="${props.height}" xmlns="http://www.w3.org/2000/svg">
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
    for (let i = gridSize; i < props.width; i += gridSize) {
      verticalLines.push(
        <Line
          key={`vertical_${i}`}
          points={[i, 0, i, props.height]}
          stroke={gridColor}
          strokeWidth={1}
        />
      );
    }

    const horizontalLines = [];
    for (let i = gridSize; i < props.height; i += gridSize) {
      horizontalLines.push(
        <Line
          key={`horizontal_${i}`}
          points={[0, i, props.width, i]}
          stroke={gridColor}
          strokeWidth={1}
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
    const imageName = e.dataTransfer.getData("image/svg+xml");
    const { x, y } = stageRef.current.getPointerPosition();
    setLines([...lines, { type: "image", src: props.selectedSvg, x, y }]);
  };

  return (
    <div style={{ display: "flex" }}>
      <div className={classes.toolPanel}>
        <div className={classes.saveButtons}>
          <Button onClick={handleSaveJSON}>Сохранить как JSON</Button>
          <Button onClick={handleSaveSVG}>Сохранить как SVG</Button>
        </div>
        {props.selectedSvg && (
          <SvgComponent
            svgURL={props.selectedSvg}
            onDrop={handleImageDrop}
          />
        )}
      </div>

      <div className={classes.drawArea}>
        <Stage
          className="konva-container"
          width={props.width}
          height={props.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDrop={handleImageDrop}
          ref={stageRef}
        >
          <Layer>
            <Grid />
            {lines.map((item, index) => (
              <Group key={index}>
                {item.type === "line" && (
                  <Line
                    points={item.points}
                    stroke="#CF0A00"
                    strokeWidth={5}
                    lineCap="round"
                  />
                )}
                {item.type === "image" && (
                  <Image
                    image={item}
                    draggable
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
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


