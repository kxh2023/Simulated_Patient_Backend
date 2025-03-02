import { createRoot } from "react-dom/client";
import { PatientCarousel } from "./components/mycomponents/patientcarousel";
import { PatientSelectionButton } from "./components/mycomponents/patientselectionbutton";
import { PatientCardProvider } from "./components/mycomponents/patientcardcontext";

function App() {
  return (
    <PatientCardProvider>
      <div className="container mx-auto p-8 min-h-screen flex flex-col">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
          Patient Selection
        </h1>

        <div className="h-[50vh] mb-8">
          <PatientCarousel />
        </div>

        <div className="flex justify-center">
          <PatientSelectionButton />
        </div>
      </div>
    </PatientCardProvider>
  );
}

export default App;
