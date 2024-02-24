import React from "react";
import DrawPane from "./InitialDrawPanel";
import ErrorBoundary from "./ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <h1>MODEMA</h1>
        <DrawPane width={800} height={600} />
      </div>
    </ErrorBoundary>
  );
};

export default App;

