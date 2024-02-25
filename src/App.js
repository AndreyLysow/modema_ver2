import React, { useState, useEffect } from "react";
import DrawInputPanel from "./DrawInputPanel";  // Импортируем DrawInputPanel
import ErrorBoundary from "./ErrorBoundary";
import { CssBaseline, Container, Typography } from "@material-ui/core";
import "./App.css";



const App = () => {
  const [showText, setShowText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prev) => (prev < 5 ? prev + 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderLetters = () => {
    const letters = ["M", "O", "D", "E", "M", "A"];
    const result = [];

    for (let i = 0; i < letters.length; i++) {
      result.push(
        <Typography
          key={i}
          variant="h1"
          className={i === showText ? "blinking-text" : "hidden-text"}
        >
          {letters[i]}
        </Typography>
      );
    }

    return result;
  };

  return (
    <ErrorBoundary>
      <CssBaseline />
      <Container className="App">
        <div className="letters-container">{renderLetters()}</div>

        <DrawInputPanel width={1050} height={500} /> {/* Используем DrawInputPanel вместо DrawPanel */}
      </Container>
    </ErrorBoundary>
  );
};

export default App;






