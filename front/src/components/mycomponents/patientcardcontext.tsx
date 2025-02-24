// PatientCardContext.tsx
import React, { createContext, useContext, useState } from "react";

interface PatientCardContextType {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}

const PatientCardContext = createContext<PatientCardContextType | undefined>(
  undefined
);

export function PatientCardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <PatientCardContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </PatientCardContext.Provider>
  );
}

export function usePatientCard() {
  const context = useContext(PatientCardContext);
  if (!context) {
    throw new Error("usePatientCard must be used within a PatientCardProvider");
  }
  return context;
}
