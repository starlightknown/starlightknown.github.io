
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { consoleHello } from "./app/consoleHello";

  consoleHello();
  createRoot(document.getElementById("root")!).render(<App />);
  