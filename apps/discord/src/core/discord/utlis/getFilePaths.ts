import fs, { Dirent } from 'fs';

export function getFilePaths(dir: string, suffix: string[]): string[] {
  let fileNames: string[] = [];
  const files: Dirent[] = fs.readdirSync(dir, {
    withFileTypes: true, // Allows detecting folders (via isDirectory())
  });

  for (const file of files) {
    // Handle directory
    if (file.isDirectory()) {
      fileNames = [
        ...fileNames,
        ...getFilePaths(`${dir}/${file.name}`, suffix),
      ];
      continue;
    }

    // Handle actual file
    for (const s of suffix) {
      if (file.name.endsWith(s)) {
        fileNames.push(`${dir}/${file.name}`);
        break;
      }
    }
  }

  return fileNames;
}
