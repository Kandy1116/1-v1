"use client";
import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './AudioPlayer.css';

interface AudioPlayerProps {
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current?.duration || 0);
    setDuration(seconds);
    progressBar.current!.max = String(seconds);
  }, [audioPlayer?.current?.onloadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(animationRef.current!);
    }
  }

  const whilePlaying = () => {
    progressBar.current!.value = String(audioPlayer.current?.currentTime || 0);
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeRange = () => {
    audioPlayer.current!.currentTime = Number(progressBar.current?.value || 0);
    changePlayerCurrentTime();
  }

  const changePlayerCurrentTime = () => {
    progressBar.current?.style.setProperty('--seek-before-width', `${Number(progressBar.current.value) / duration * 100}%`);
    setCurrentTime(Number(progressBar.current?.value));
  }

  const backThirty = () => {
    progressBar.current!.value = String(Number(progressBar.current?.value) - 15);
    changeRange();
  }

  const forwardThirty = () => {
    progressBar.current!.value = String(Number(progressBar.current?.value) + 15);
    changeRange();
  }

  return (
    <div className="audioPlayer">
      <audio ref={audioPlayer} src={audioSrc} preload="metadata"></audio>
      
      <div className="audioPlayer__controls">
        <button className="audioPlayer__btn" onClick={backThirty}><FaBackward /> </button>
        <button onClick={togglePlayPause} className="audioPlayer__playPause">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="audioPlayer__btn" onClick={forwardThirty}><FaForward /></button>
      </div>

      <div className="audioPlayer__progressBar-wrapper">
        <div className="audioPlayer__time">{calculateTime(currentTime)}</div>
        <input type="range" className="audioPlayer__progressBar" defaultValue="0" ref={progressBar} onChange={changeRange} />
        <div className="audioPlayer__time">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
      </div>
    </div>
  )
}

export default AudioPlayer;
