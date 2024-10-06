import '@/styles/components/Audio_Visualiser.scss';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';

import throttle from 'lodash.throttle';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop, faRotateLeft, faRotateRight, faTrashCan, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

let didInit = false;

export default function Audio_Visualiser({ accessibleAudioFiles, activeSectionId, globalAudioVolume, sectionTime, updateSectionTime, openModal }) {
  const containerRef = useRef(null);
  const [file, setFile] = useState(null);

  // Save props value to check if changed (instead of using useEffect)
  const [prevActiveSectionId, setPrevActiveSectionId] = useState(activeSectionId);
  const [prevAccessibleAudioFiles, setPrevAccessibleAudioFiles] = useState(accessibleAudioFiles);

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
  const [prevWavesurfer, setPrevWavesurfer] = useState(wavesurfer);
  const wavesurferDecoded = useRef(false);

  useEffect(() => {
    if (!wavesurfer) {
      wavesurferDecoded.current = false;
      return;
    }

    const unsubscribeLoad = wavesurfer.on('load', () => {
      // When audio starts loading, to set wavesurferDecoded to false and prevent updating the time on parent with an old time from the previous file
      console.log(`Wavesurfer file load started for section ${activeSectionId}`);
      wavesurferDecoded.current = false;
    });

    const unsubscribeDecode = wavesurfer.on('decode', () => {
      // Audio file decoded, set the time (from the prop) on wavesurfer
      wavesurferDecoded.current = true;
      console.log(`Wavesurfer file decoded for section ${activeSectionId}, setting the time to ${sectionTime}`);
      setWavesurferTime(sectionTime);
    });

    return () => {
      unsubscribeLoad();
      unsubscribeDecode();
    };
  }, [wavesurfer, activeSectionId]);

  const updateTimeOnParent = useCallback(
    throttle((time, sectionId) => {
      updateSectionTime(time, sectionId);
    }, 100),
    [],
  );

  useEffect(() => {
    if (!wavesurfer) {
      return;
    }
    if (activeSectionId === prevActiveSectionId) {
      updateTimeOnParent(currentTime, activeSectionId);
    } else {
      console.log('Active section different from the previous! Not updating time now.');
    }
  }, [wavesurfer, currentTime, activeSectionId, prevActiveSectionId]);

  if (!didInit || wavesurfer !== prevWavesurfer || accessibleAudioFiles !== prevAccessibleAudioFiles || activeSectionId !== prevActiveSectionId) {
    // Set current values as the previous ones, to be able to enter this again if something changes
    didInit = true;
    setPrevWavesurfer(wavesurfer);
    setPrevAccessibleAudioFiles(accessibleAudioFiles);
    setPrevActiveSectionId(activeSectionId);
    //

    // Prop changed, set the file
    const tmpFile = accessibleAudioFiles.find((file) => file.id === activeSectionId);
    setFile(tmpFile);

    if (tmpFile && wavesurfer) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        // Create a Blob providing as first argument a typed array with the file buffer
        const blob = new window.Blob([new Uint8Array(evt.target.result)]);

        // Load the blob into Wavesurfer
        wavesurfer.loadBlob(blob);
      };

      reader.readAsArrayBuffer(tmpFile.audioFile);

      // Set volume
      wavesurfer.setVolume(globalAudioVolume.current);
    } else {
      console.log('no file or no wavesurfer. file:', file);
      console.log('no file or no wavesurfer. wavesurfer:', wavesurfer);
    }
  }

  function setWavesurferTime(time) {
    if (wavesurfer && !isNaN(time)) {
      console.log(`Set wavesurfer time to ${time}`);
      wavesurfer.setTime(time);
    }
  }

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
      globalAudioVolume.current = vol; // save on parent
    }
  };

  const timestamp = () => {
    const current = new Date(null, null, null, null, null, currentTime).toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
    const length = new Date(null, null, null, null, null, wavesurfer.getDuration()).toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
    return `${current} de ${length}`;
  };

  const quickJump = (offset) => {
    wavesurfer.setTime(currentTime + offset);
  };

  const updateVoluremoveExtensione = (contentName) => {
    const lastDotIndex = contentName.lastIndexOf('.');

    // Se existir um ponto, corta a string até o ponto, caso contrário retorna a string original
    return lastDotIndex !== -1 ? contentName.substring(0, lastDotIndex) : contentName;
  };

  return (
    <div className="audio-container">
      {/* {sectionTime} */}
      <div style={{ display: 'flex' }}>
        <h3>Nome: {file && updateVoluremoveExtensione(file.audioFile.name)}</h3>
        <button
          className="negative-button icon"
          type="button"
          style={{ marginLeft: 'auto', marginBottom: '1rem' }}
          onClick={() => {
            openModal('deleteSectionAudio');
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} />
          Apagar áudio
        </button>
      </div>
      <div
        className="audio-content-container"
        ref={containerRef}
      />
      {file && file.audioFile && (
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
                <div className="volume-input">
                  <FontAwesomeIcon icon={faVolumeHigh} />
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
