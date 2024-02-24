import React, { useState } from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Line, Text, Group } from "react-konva";
import { saveAs } from "file-saver";
import SvgComponent from "./SvgComponent";
import "./InitialDrawPanel.css";

// Функция для округления значения до сетки
const roundToGrid = (value, gridSize) => {
  return Math.round(value / gridSize) * gridSize;
};

// Компонент рисования
const DrawPane = (props) => {
  // Состояние для хранения линий
  const [lines, setLines] = useState([]);
  // Состояние для отслеживания рисования
  const [drawing, setDrawing] = useState(false);

  // Обработчик нажатия кнопки мыши
  const handleMouseDown = (e) => {
    // Получение координат указателя мыши
    const { x, y } = e.target.getStage().getPointerPosition();
    // Добавление новой линии с округленными координатами
    setLines([...lines, { points: [roundToGrid(x, 20), roundToGrid(y, 20)] }]);
    // Установка флага рисования в true
    setDrawing(true);
  };

  // Обработчик движения мыши
  const handleMouseMove = (e) => {
    // Если не рисуем, выходим из функции
    if (!drawing) {
      return;
    }

    // Получение координат указателя мыши
    const { x, y } = e.target.getStage().getPointerPosition();
    // Получение последней нарисованной линии
    let lastLine = lines[lines.length - 1];

    // Округление координат до сетки
    const roundedX = roundToGrid(x, 20);
    const roundedY = roundToGrid(y, 20);

    // Если координаты изменились, обновляем их
    if (lastLine.points[0] !== roundedX || lastLine.points[1] !== roundedY) {
      lastLine.points = [lastLine.points[0], lastLine.points[1], roundedX, roundedY];
      setLines([...lines.slice(0, -1), lastLine]);
    }
  };

  // Обработчик отпускания кнопки мыши
  const handleMouseUp = () => {
    // Установка флага рисования в false
    setDrawing(false);
  };

  // Обработчик сохранения в JSON
  const handleSaveJSON = () => {
    // Преобразование массива линий в формат JSON
    const jsonContent = JSON.stringify(lines, null, 2);
    // Создание Blob и сохранение файла
    const blob = new Blob([jsonContent], { type: "application/json" });
    saveAs(blob, "drawing.json");
  };

  // Обработчик сохранения в SVG
  const handleSaveSVG = () => {
    // Генерация содержимого SVG
    const svgContent = `
      <svg width="${props.width}" height="${props.height}" xmlns="http://www.w3.org/2000/svg">
        ${lines.map((line) => (
          `<polyline points="${line.points.join(",")}" stroke="#FF0000" stroke-width="8" fill="none" />`
        )).join("")}
      </svg>
    `;
    // Создание Blob и сохранение файла
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    saveAs(blob, "drawing.svg");
  };

  // Компонент для отображения сетки
  const Grid = () => {
    const gridSize = 20;
    const gridColor = "#ddd";

    const verticalLines = [];
    // Генерация вертикальных линий сетки
    for (let i = gridSize; i < props.width; i += gridSize) {
      verticalLines.push(
        <Line
          key={`vertical_${i}`}
          points={[i, 0, i, props.height]}
          stroke={gridColor}
          strokeWidth={2}
        />
      );
    }

    const horizontalLines = [];
    // Генерация горизонтальных линий сетки
    for (let i = gridSize; i < props.height; i += gridSize) {
      horizontalLines.push(
        <Line
          key={`horizontal_${i}`}
          points={[0, i, props.width, i]}
          stroke={gridColor}
          strokeWidth={2}
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

  // Возвращение разметки компонента
  return (
    <>
      {/* Компонент для рисования */}
      <div>
        <Stage
          className="konva-container"
          width={props.width}
          height={props.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Отображение сетки */}
            <Grid />
            {/* Отображение нарисованных линий */}
            {lines.map((line, index) => (
              <Group key={index}>
                <Line
                  points={line.points}
                  stroke="#FF0000"
                  strokeWidth={8}
                  lineCap="round"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
        {/* Кнопки сохранения */}
        <div className="save-buttons">
          <button onClick={handleSaveJSON} style={{ color: 'blue', fontSize: 16, fontWeight: 'bold', margin: '10px 0 0 20px' }}>
            Сохранить как JSON
          </button>
          <button onClick={handleSaveSVG} style={{ color: 'blue', fontSize: 16, fontWeight: 'bold', margin: '10px 0 0 20px' }}>
            Сохранить как SVG
          </button>
        </div>
      </div>
      {/* Компонент SVG */}
      <SvgComponent x={100} y={100} />
    </>
  );
};

// Установка типов для свойств компонента
DrawPane.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

// Экспорт компонента
export default DrawPane;

  