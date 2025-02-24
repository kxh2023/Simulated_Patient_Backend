const API_BASE_URL = "http://localhost:5001";

export async function createPatient(
  name: string = "Patient",
  instructions: number,
  model: string = "gpt-4o"
) {
  try {
    const response = await fetch(`${API_BASE_URL}/create_patient`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, instructions, model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating patient:", error);
    throw error;
  }
}
