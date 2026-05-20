import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./components/StartPage";
import OmBinice from "./components/OmBinice";
import LaddaNed from "./components/LaddaNed";
import Process from "./components/Process";
import Resultat from "./components/Resultat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<StartPage />} />
          <Route path="/om" element={<OmBinice />} />
          <Route path="/ladda-ned" element={<LaddaNed />} />
          <Route path="/process" element={<Process />} />
          <Route path="/resultat" element={<Resultat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
