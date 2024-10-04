import '@/styles/components/Audio_Forms_Visualiser.scss';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';

import throttle from 'lodash.throttle';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faRotateLeft, faRotateRight, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function Audio_Forms_Visualiser({ original_content_file, globalAudioVolume, setAudioCurrentTime, setAudioDuration }) {
  const containerRef = useRef(null);
  const [file, setFile] = useState(null);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    // url: "/my-server/audio.ogg",
    waveColor: '#A8DBA8', // Cor das barras (altere conforme necessário)
    progressColor: '#1c810e', // Cor da barra que mostra o progresso do áudio
    /* waveColor: "#A8DBA8", // Cor das barras (altere conforme necessário)
    progressColor: "#3B8686", // Cor da barra que mostra o progresso do áudio */
    barWidth: 3.2, // Largura de cada barra no waveform (ajuste para barras mais grossas)
    barHeight: 3, // Altura relativa das barras (1 é o máximo, para não serem cortadas)
    barGap: 3.8, // Espaço entre as barras
    height: 70,
    responsive: true, // Se você quiser que o waveform seja responsivo
  });
  const wavesurferDecoded = useRef(false);

  useEffect(() => {
    if (!wavesurfer) {
      wavesurferDecoded.current = false;
      return;
    }

    const unsubscribeLoad = wavesurfer.on('load', () => {
      // When audio starts loading, to set wavesurferDecoded to false and prevent updating the time on parent with an old time from the previous file
      wavesurferDecoded.current = false;
    });

    const unsubscribeDecode = wavesurfer.on('decode', () => {
      // Audio file decoded, set the time on wavesurfer
      wavesurferDecoded.current = true;

      console.log(file);

      if (wavesurfer) {
        const time = 0;
        wavesurfer.setTime(time);

        const duration = wavesurfer.getDuration();
        setAudioDuration(duration);
      }
    });

    return () => {
      unsubscribeLoad();
      unsubscribeDecode();
    };
  }, [wavesurfer]);

  const updateTimeOnParent = useCallback(
    throttle((time) => {
      setAudioCurrentTime(time);
    }, 100),
    [],
  );

  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    updateTimeOnParent(currentTime);
  }, [wavesurfer, currentTime]);

  useEffect(() => {
    setFile(original_content_file);

    if (original_content_file && wavesurfer) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        // Create a Blob providing as first argument a typed array with the file buffer
        const blob = new window.Blob([new Uint8Array(evt.target.result)]);

        // Load the blob into Wavesurfer
        wavesurfer.loadBlob(blob);
      };

      reader.readAsArrayBuffer(original_content_file);

      // Set volume
      wavesurfer.setVolume(globalAudioVolume.current);
    } else {
      console.log('Nenhum arquivo ou Wavesurfer disponível.');
    }
  }, [wavesurfer]);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onStop = () => {
    wavesurfer && wavesurfer.stop();
  };

  const [volume, setVolume] = useState(globalAudioVolume.current);
  const updateVolume = (vol) => {
    if (wavesurfer) {
      wavesurfer.setVolume(vol);
      setVolume(vol);
      //globalAudioVolume.current = vol; // save on parent
    }
  };

  const formatTime = (seconds) => {
    // Converte segundos para horas, minutos e segundos
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Formata a string conforme necessário
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  };

  const timestamp = () => {
    const current = formatTime(currentTime); // Formata o tempo atual
    const length = formatTime(wavesurfer.getDuration()); // Formata a duração total
    return `${current} de ${length}`;
  };

  const quickJump = (offset) => {
    wavesurfer.setTime(currentTime + offset);
  };

  return (
    <div className="audio-container">
      <div
        className="audio-content-container"
        ref={containerRef}
      />
      {file && (
        <>
          {wavesurfer && (
            <div className="audio-controls-bar">
              {/* Controles para o player */}
              <div className="audio-controls">
                <p>{timestamp()}</p>
                <button onClick={onStop}>
                  <FontAwesomeIcon icon={faStop} />
                </button>
                <button onClick={onPlayPause}>{isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}</button>
                <button onClick={() => quickJump(-3)}>
                  <FontAwesomeIcon icon={faRotateLeft} />
                </button>
                <button onClick={() => quickJump(3)}>
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={(e) => updateVolume(e.target.value)}
                  value={volume}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
