import { promises as fs } from "fs";

export async function saveResumeToken(
  path: string,
  token: string,
): Promise<void> {
  try {
    await fs.writeFile(path, token);
  } catch (error) {
    console.error("Error saving resume token:", error);
    throw error;
  }
}

export async function getResumeToken(path: string): Promise<string | null> {
  try {
    const token = await fs.readFile(path, { encoding: "utf8" });
    return token;
  } catch (error) {
    console.error("Error reading resume token:", error);
    throw error;
  }
}
