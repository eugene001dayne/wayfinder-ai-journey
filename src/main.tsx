import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getUserId } from "./lib/api";

const userId = getUserId();
pendo.initialize({
  visitor: {
    id: userId || 'anonymous'
  }
});

createRoot(document.getElementById("root")!).render(<App />);
