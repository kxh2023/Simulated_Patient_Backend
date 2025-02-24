import React from "react";
import { Button } from "@/components/ui/button";
import { usePatientCard } from "./patientcardcontext";
import { motion, AnimatePresence } from "framer-motion";

import { createPatient } from "@/services/setupservice";
import { useNavigate } from "react-router-dom";

export function PatientSelectionButton() {
  const { selectedId } = usePatientCard();
  const navigate = useNavigate();

  const handleClick = () => {
    if (selectedId === null) return;

    try {
      createPatient("Patient", selectedId, "gpt-4o");
      console.log("Called createPatient with:", {
        instructions: selectedId,
      });

      navigate("/record");
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
    <AnimatePresence>
      {selectedId !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 center-8 z-50" // Added positioning and z-index
        >
          <Button
            className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-200 px-8 py-2 text-lg font-medium"
            onClick={() => {
              console.log("Selected patient:", selectedId);
              handleClick();
            }}
          >
            Start
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
