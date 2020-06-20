import React, { createContext, useState, useEffect, useRef } from 'react';
import Metronome from './Metronome/metronome';
// import CONSTANTS from './constants';
//
import {
  generateEmptyGrid,
  generateRandomGrid,
  generateChequer,
  invertCurrentGrid,
  gameOfLifeRules,
  gameOfLifeWrapAroundRules
} from './helpers';
//
export const GridContext = createContext({
  isPlaying: false,
  framePerSecond: 60,
  toggleIsPlaying: () => {}
});
// SINGLETONS
const MAX_FPS = 60;
const metronome = new Metronome();
//
const GridProvider = ({ children }) => {
  //
  const [ gridSize, setGridSize ] = useState(10);
  const [ circleSize, setCircleSize ] = useState(10);
  const [ grid, setGrid ] = useState(() => generateEmptyGrid(gridSize, gridSize));
  //
  // console.log('gridSize', gridSize);
  // metronomes, web audio
  const [ beatPerMin, setBeatPerMin ] = useState(60);
  const [ isInitilised, setisInitilised ] = useState(false);
  const toggleInitialised = () => setisInitilised(!isInitilised);
  const toggleIsPlaying = () => setIsPlaying(!isPlaying);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ timeSig, setTimeSig ] = useState('4/4');

  //
  // everything to do with rendering animation state
  const [ animationMode, setAnimationMode ] = useState('random');
  const [ framePerSecond, setFramePerSecond ] = useState(60);
  const [ changeResolution, setChangeResolution ] = useState('Qs');
  const randomGrid = () => setGrid(generateRandomGrid(grid));
  const clearGrid = () => setGrid(generateEmptyGrid(gridSize, gridSize));
  const applyAnimationMode = e => setAnimationMode(e.currentTarget.value);
  //
  const chequeredGrid = () => setGrid(generateChequer());
  const invertGrid = () => setGrid(grid => invertCurrentGrid(grid));
  const gameOfLife = () => setGrid(grid => gameOfLifeRules(grid));
  const gameOfLifeWrap = () => setGrid(grid => gameOfLifeWrapAroundRules(grid));
  //
  useEffect(
    () => {
      // update grid size
      setGrid(generateEmptyGrid(gridSize, gridSize));
    },
    [ gridSize ]
  );

  useEffect(
    () => {
      if (isInitilised) {
        metronome.init();
      } else {
        metronome.terminate();
        // make sure to sync with GritContxt/UI
        setIsPlaying(false);
        setisInitilised(false);
      }
    },
    [ isInitilised ]
  );
  useEffect(
    () => {
      // console.log('metronome', metronome);
      if (isInitilised && isPlaying) {
        metronome.play();
        // debugger;
      } else if (isInitilised && !isPlaying) {
        metronome.stop();
      }
    },
    [ isPlaying, isInitilised ]
  );

  useEffect(
    () => {
      metronome.tempoBpm = beatPerMin;
    },
    [ beatPerMin ]
  );

  useEffect(
    () => {
      // console.log('test');
      metronome.setTimeSig(timeSig);
    },
    [ timeSig ]
  );

  useEffect(
    () => {
      if (animationMode === 'chequrd') chequeredGrid();
    },
    [ animationMode ]
  );

  const runningRef = useRef(isPlaying);
  runningRef.current = isPlaying;
  // const runningRef = useRef(isPlaying);
  // runningRef.current = isPlaying;
  let cb;
  //
  switch (animationMode) {
    case 'random':
      cb = randomGrid;
      break;
    case 'invert':
      cb = invertGrid;
      break;
    case 'gol':
      cb = gameOfLife;
      break;
    case 'gol-wrap':
      cb = gameOfLifeWrap;
      break;
    case 'chequrd':
      cb = invertGrid;
      break;
    default:
      cb = randomGrid;
      break;
  }
  //
  // useAnimationFrame(cb, isPlaying, framePerSecond);
  // const callbackRef = React.useRef(callback);
  // callbackRef.current = callback;
  //
  const frameCounterRef = React.useRef(0);
  const requestAnimationFrameRef = React.useRef();
  const loop = React.useCallback(
    () => {
      requestAnimationFrameRef.current = requestAnimationFrame(loop);
      // console.log('franeRef', requestAnimationFrameRef);
      frameCounterRef.current = frameCounterRef.current + 1;
      // polling the audio context
      if (frameCounterRef.current >= Math.round(MAX_FPS / framePerSecond)) {
        // if (requestAnimationFrameRef.current % 60 === 0) {
        //
        while (metronome.nIq.length && metronome.nIq[0].time < metronome.audioCtx.currentTime) {
          metronome.currentNote = metronome.nIq[0].note;
          // const removed =
          metronome.nIq.splice(0, 1); // remove note from queue
        }
        // We only need to trigger draw if the note has moved.
        if (metronome.last16thNoteDrawn !== metronome.currentNote) {
          //
          metronome.last16thNoteDrawn = metronome.currentNote;
          //
          if (changeResolution === '16s') {
            cb();
          } else if (changeResolution === '8s') {
            if (metronome.currentNote % 2 === 0) cb();
          } else if (changeResolution === 'Qs') {
            if (metronome.currentNote % 4 === 0) cb();
          } else if (changeResolution === '1&3') {
            if (metronome.currentNote % 8 === 0) cb();
          } else if (changeResolution === '2&4') {
            //
            if (metronome.currentNote % 4 === 0 && metronome.currentNote % 8 !== 0) cb();
          }
          // - this block won't be called when changeResolution is properly set
          // beats 1 and 3 ===  if (metronome.currentNote % 8 === 0) {)
          // if (metronome.currentNote % 8 === 0) return;
          // stop call backs accept quarter notes
          // if (metronome.currentNote % 4) return;
        }
        //
        //
        frameCounterRef.current = 0;
      }
      //
    },
    [ changeResolution, framePerSecond, cb ]
  );

  //
  React.useLayoutEffect(
    () => {
      if (isPlaying) {
        requestAnimationFrameRef.current = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(requestAnimationFrameRef.current);
        requestAnimationFrameRef.current = 0;
      }
      return () => cancelAnimationFrame(requestAnimationFrameRef.current);
    },
    [ loop, isPlaying ]
  );
  const fireTick = () => {
    // - todo cb should be ref
    cb();
  };
  //
  const logTheGrid = () => console.log(grid);
  return (
    <GridContext.Provider
      value={{
        circleSize,
        setCircleSize,
        gridSize,
        setGridSize,

        grid,
        setGrid,
        clearGrid,
        chequeredGrid,
        randomGrid,
        framePerSecond,
        setFramePerSecond,
        applyAnimationMode,
        changeResolution,
        setChangeResolution,
        //
        fireTick,
        //
        runningRef,
        //
        // runSimulation,
        isPlaying,
        toggleIsPlaying,
        isInitilised,
        toggleInitialised,
        beatPerMin,
        setBeatPerMin,
        timeSig,
        setTimeSig,
        logTheGrid
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export default GridProvider;
