import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { PatientCard } from "./patientcard";
import { PatientCardData } from "../types.ts";
import { PatientCardProvider } from "./patientcardcontext";
import { getPatients } from "@/services/getpatients";

export function PatientCarousel() {
  const [patients, setPatients] = useState<PatientCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalSelectedId, setGlobalSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        const transformedData: PatientCardData[] = data.map((patient) => ({
          id: patient.id,
          title: patient.name,
          description: patient.description,
          tags: patient.tags,
        }));
        setPatients(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch patients"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCardSelection = (id: number) => {
    setGlobalSelectedId((currentId) => (currentId === id ? null : id));
  };

  return (
    <Carousel>
      <CarouselContent>
        {patients.map((item) => (
          <CarouselItem className="basis-1/3" key={item.id}>
            <PatientCard
              data={item}
              onSelect={() => handleCardSelection(item.id)}
              isSelectedGlobally={globalSelectedId === item.id}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
