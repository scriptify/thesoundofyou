import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useEffect } from "react";
import GenerativeMusicEngine from "../browser/engine";
import { getAllInstruments } from "../node/data";
import { Instrument } from "../node/data/util/sfz-parser";

interface StaticPageData {
  instruments: Instrument[];
}

export const getStaticProps: GetStaticProps<StaticPageData> = async function getStaticProps() {
  const instruments = getAllInstruments();

  return {
    props: {
      instruments,
    },
  };
};

export default function Home({
  instruments,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  function play() {
    const engine = new GenerativeMusicEngine({ instruments });
    engine.init();
  }

  return (
    <main>
      <button onClick={play}>Play</button>
    </main>
  );
}
