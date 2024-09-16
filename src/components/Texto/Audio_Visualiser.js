import React, { useState, useEffect, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";

import { useSelector } from "react-redux";

export default function Audio_Visualiser({
  accessibleAudioFiles,
  activeSectionId,
}) {
  const [file, setFile] = useState(null);

  const containerRef = useRef(null);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    // url: "/my-server/audio.ogg",
    waveColor: "#A8DBA8", // Cor das barras (altere conforme necessário)
    progressColor: "#3B8686", // Cor da barra que mostra o progresso do áudio
    barWidth: 3, // Largura de cada barra no waveform (ajuste para barras mais grossas)
    barHeight: 1, // Altura relativa das barras (1 é o máximo, para não serem cortadas)
    barGap: 2, // Espaço entre as barras
    responsive: true, // Se você quiser que o waveform seja responsivo
  });

  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setFile(accessibleAudioFiles.find((file) => file.id === activeSectionId));
  }, [accessibleAudioFiles, activeSectionId]);

  useEffect(() => {
    if (file && wavesurfer) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        // Create a Blob providing as first argument a typed array with the file buffer
        const blob = new window.Blob([new Uint8Array(evt.target.result)]);

        // Load the blob into Wavesurfer
        wavesurfer.loadBlob(blob);
      };

      reader.readAsArrayBuffer(file.audioFile);

      // return () => {
      //   // Cleanup ao desmontar o componente
      //   if (wavesurfer.current) wavesurfer.current.destroy();
      // };
    } else {
      console.log("file:", file);
      console.log("wavesurfer:", wavesurfer);
    }
  }, [file, wavesurfer]);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const updateVolume = (vol) => {
    if (wavesurfer) {
      wavesurfer.setVolume(vol);
      setVolume(vol);
    }
  };

  const timestamp = () => {
    const current = new Date(null, null, null, null, null, currentTime)
      .toTimeString()
      .match(/\d{2}:\d{2}:\d{2}/)[0];
    const length = new Date(
      null,
      null,
      null,
      null,
      null,
      wavesurfer.getDuration(),
    )
      .toTimeString()
      .match(/\d{2}:\d{2}:\d{2}/)[0];
    return `${current} de ${length}`;
  };

  const quickJump = (offset) => {
    wavesurfer.setTime(currentTime + offset);
  };

  return (
    <div>
      {file && file.audioFile.name}
      <div ref={containerRef} />
      {file && file.audioFile && (
        <>
          {wavesurfer && (
            <>
              {timestamp()}
              <br />
              {/* Controles para o player */}
              <div style={{ marginTop: "20px", display: "flex" }}>
                <button onClick={onPlayPause}>
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => quickJump(-5)}
                >
                  -5
                </button>
                <button
                  style={{ marginLeft: "1rem" }}
                  onClick={() => quickJump(5)}
                >
                  +5
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  style={{ width: "30%", marginLeft: "auto" }}
                  onChange={(e) => updateVolume(e.target.value)}
                  value={volume}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
