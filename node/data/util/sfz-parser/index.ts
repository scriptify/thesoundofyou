export interface SoundfontControl {
  default_path: string;
}

export interface SoundfontRegion {
  sample?: string;
  lokey?: number;
  hikey?: number;
  pitch_keycenter?: number;
  lovel?: number;
  hivel?: number;
  volume?: number;
}

export interface Soundfont {
  name: string;
  control?: SoundfontControl;
  region?: SoundfontRegion[];
  /** TODO: Types */
  global?: any;
}

/**
 * Parses string to number if possible,
 * otherwise just returns the string
 */
function parseValue(value: string) {
  const parsed = parseFloat(value);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return value;
}

export default function parseSoundfont(
  fileContent: string,
  instrumentName: string
): Soundfont {
  let currentObj: any = undefined;
  let currentTagName = "";
  const soundfont = {
    name: instrumentName,
  };

  for (let line of fileContent.split("\n")) {
    line = line.trim();

    if (line === "" || line.startsWith("//")) {
      continue;
    }

    if (line.startsWith("<") && line.endsWith(">")) {
      const tag = line.slice(1, -1);
      if (currentObj) {
        if (soundfont[currentTagName]) {
          if (Array.isArray(soundfont[currentTagName])) {
            soundfont[currentTagName].push(currentObj);
          } else {
            soundfont[currentTagName] = [soundfont[currentTagName], currentObj];
          }
        } else {
          soundfont[currentTagName] = currentObj;
        }
      }
      currentTagName = tag;
      currentObj = undefined;
    } else {
      const [key, value] = line.split("=");
      if (currentObj === undefined) {
        currentObj = {};
      }
      currentObj[key] = parseValue(value);
    }
  }

  return soundfont as Soundfont;
}

export * from "./instrument";
