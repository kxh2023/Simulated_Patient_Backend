const API_BASE_URL = "http://localhost:5001";

interface Patient {
  id: number;
  name: string;
  description: string;
  tags: string[];
}

interface ApiResponse {
  status: string;
  data: Patient[];
}

export async function getPatients(): Promise<Patient[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (result.status !== "success") {
      throw new Error("Failed to fetch patients");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }
}
