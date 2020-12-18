import path from "path";
import { Soundfont } from ".";

export interface InstrumentSample {
  filePath: string;
  midiValue: number;
}

export interface Instrument {
  samples: InstrumentSample[];
  name: string;
}

export function toInstrument(
  soundfont: Soundfont,
  basePath: string = ""
): Instrument {
  const rootPath = soundfont.control?.default_path ?? "";

  const samples: InstrumentSample[] = soundfont.region
    ?.filter((region) => region.sample)
    .map((region) => {
      return {
        filePath: path
          .join(basePath, rootPath, region.sample)
          .replace(/\\/g, "/"),
        midiValue: region.pitch_keycenter,
      };
    });

  return {
    name: soundfont.name,
    samples,
  };
}
