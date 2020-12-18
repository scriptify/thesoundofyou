import path from "path";
import fs from "fs";
import parseSoundfont, { toInstrument } from "./util/sfz-parser";

/**
 * Reads and parses all SFZ files
 */
export function getAllInstruments() {
  const staticAudioFolder = path.resolve(process.cwd(), "public/audio");
  const allAudioFolders = fs
    .readdirSync(staticAudioFolder)
    .filter((folderName) =>
      fs.statSync(path.join(staticAudioFolder, folderName)).isDirectory()
    );
  const allSfzFiles = allAudioFolders
    .map((folderName) =>
      fs
        .readdirSync(path.join(staticAudioFolder, folderName))
        .map((entry) => path.join(staticAudioFolder, folderName, entry))
    )
    .flat()
    .filter((folderEntry) => folderEntry.endsWith(".sfz"))
    .map((sfzFile) => ({
      content: fs.readFileSync(sfzFile).toString(),
      fileName: path.basename(sfzFile).replace(".sfz", ""),
      basePath: path
        .dirname(sfzFile)
        .replace(process.cwd(), "")
        .replace("/public", "")
        .replace("\\public", ""),
    }))
    .map(({ content, fileName, basePath }) => ({
      soundfont: parseSoundfont(content, fileName),
      basePath,
    }))
    .map(({ soundfont, basePath }) => toInstrument(soundfont, basePath));

  return allSfzFiles;
}
