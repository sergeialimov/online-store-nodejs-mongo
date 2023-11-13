import { promises as fs } from 'fs';

const RESUME_TOKEN_PATH = './resumeToken.txt';

export async function saveResumeToken(token: string): Promise<void> {
  try {
    await fs.writeFile(RESUME_TOKEN_PATH, token);
  } catch (error) {
    console.error('Error saving resume token:', error);
    throw error;
  }
}

export async function getResumeToken(): Promise<string | null> {
  try {
    const token = await fs.readFile(RESUME_TOKEN_PATH, { encoding: 'utf8' });
    return token;
  } catch (error) {
    if (error.code === 'ENOENT') { // File not found
      console.log('Resume token file not found. Starting from the beginning of the change stream.');
      return null;
    }
    console.error('Error reading resume token:', error);
    throw error;
  }
}
