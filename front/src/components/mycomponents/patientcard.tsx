import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { usePatientCard } from "./patientcardcontext";
import { cn } from "@/lib/utils";
import { PatientCardData } from "../types";

interface PatientCardProps {
  data: PatientCardData;
  onSelect: () => void;
  isSelectedGlobally: boolean;
}

export function PatientCard({
  data,
  onSelect,
  isSelectedGlobally,
}: PatientCardProps) {
  const { selectedId, setSelectedId } = usePatientCard();
  const isSelected = selectedId === data.id || isSelectedGlobally;

  const handleClick = () => {
    console.log("Setting selectedId to:", isSelected ? null : data.id);
    setSelectedId(selectedId === data.id ? null : data.id);
    onSelect();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-5 group relative"
      onClick={handleClick}
    >
      <Card
        className={cn(
          "transition-all duration-200 group-hover:bg-black group-hover:text-white cursor-pointer",
          isSelected && "ring-2 ring-black ring-offset-4 bg-black text-white"
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              "transition-colors duration-200",
              "group-hover:text-white",
              isSelected && "text-white"
            )}
          >
            {data.title}
          </CardTitle>
          <CardDescription
            className={cn(
              "transition-colors duration-200",
              "group-hover:text-gray-300",
              isSelected && "text-gray-300"
            )}
          />
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "transition-colors duration-200",
              "group-hover:text-white",
              isSelected && "text-white"
            )}
          >
            {data.description}
          </p>
        </CardContent>
        <CardFooter>
          {data.tags.map((tag) => (
            <Badge
              key={tag}
              className={cn(
                "mr-1 transition-colors duration-200",
                "group-hover:bg-gray-700 group-hover:text-white",
                isSelected && "bg-gray-700 text-white"
              )}
            >
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
