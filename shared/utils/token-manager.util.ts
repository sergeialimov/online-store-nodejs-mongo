import { promises as fs } from "fs";
import { ResumeToken } from 'mongodb';

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


export async function getResumeToken(path: string): Promise<ResumeToken | null> {
  try {
    const tokenString = await fs.readFile(path, { encoding: "utf8" });
    return tokenString ? JSON.parse(tokenString) : null;
  } catch (error: unknown) {
    // Check if the error is an instance of NodeJS.ErrnoException
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error("Error reading resume token:", error);
    throw error;
  }
}