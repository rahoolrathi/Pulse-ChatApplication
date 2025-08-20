import { createRoot } from "react-dom/client";
import App from "./app";
import "typeface-roboto";
import "@fontsource/inter/400.css";
import "@fontsource/righteous";
import "@fontsource/saira-stencil-one";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);
