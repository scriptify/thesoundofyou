import * as Tone from "tone";

import { Instrument } from "../../node/data/util/sfz-parser";

export interface GenerativeMusicEngineParams {
  instruments: Instrument[];
}

export default class GenerativeMusicEngine {
  private options: GenerativeMusicEngineParams;

  constructor(options: GenerativeMusicEngineParams) {
    this.options = options;
  }

  public async init() {
    const pianoInstrument = this.options.instruments.find(
      (instrument) => instrument.name === "UprightPiano"
    );
    if (!pianoInstrument) return;

    const samplerUrls = pianoInstrument.samples.reduce((acc, currSample) => {
      return {
        ...acc,
        [currSample.midiValue]: currSample.filePath,
      };
    }, {});

    console.log({ samplerUrls });

    const sampler = new Tone.Sampler({
      urls: samplerUrls,
    }).toDestination();

    await Tone.loaded();
    Tone.Transport.bpm.set({ value: 120 });

    const loop = new Tone.Loop((time) => {
      sampler.triggerAttackRelease("C4", "8n", time);
    }, "4n").start(0);

    const loop1 = new Tone.Loop((time) => {
      sampler.triggerAttackRelease("E4", "8n", time);
    }, "4n").start("1m");

    const loop2 = new Tone.Loop((time) => {
      sampler.triggerAttackRelease("F4", "8n", time);
    }, "4n").start("2m");

    Tone.Transport.start();
  }
}
