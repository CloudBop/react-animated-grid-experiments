import React, { useContext } from 'react';
import { GridContext } from '../Grid.Context';
import './app-ui.scss';
//
function AppUi() {
  //
  const {
    isPlaying,
    framePerSecond,
    setFramePerSecond,
    runningRef,
    toggleIsPlaying,
    isInitilised,
    toggleInitialised,
    clearGrid,
    randomGrid,
    chequeredGrid,
    applyAnimationMode,
    beatPerMin,
    setBeatPerMin,
    timeSig,
    setTimeSig,
    //
    changeResolution,
    setChangeResolution
  } = useContext(GridContext);
  //
  return (
    <div className="app-ui">
      <button
        onClick={() => {
          toggleIsPlaying();
          if (!isPlaying) {
            runningRef.current = true;
            // runSimulation();
          }
        }}
      >
        {isPlaying ? 'stop' : 'start'}
      </button>

      <button onClick={clearGrid}>Clear</button>
      <button onClick={randomGrid}>random</button>
      <button
      // onClick={() =>
      //   setGrid(gCurrent => {
      //     return produce(gCurrent, gCopy => {
      //       //
      //       for (let i = 0; i < gCurrent.length; i++) {
      //         for (let k = 0; k < gCurrent[0].length; k++) {
      //           gCopy[i][k] = !gCurrent[i][k];
      //         }
      //       }
      //     });
      //   })}
      >
        increase tick
      </button>
      <button onClick={chequeredGrid}>chequer board</button>
      <select onChange={applyAnimationMode}>
        <option value="random">random</option>
        <option value="invert">invert</option>
        <option value="gol">gameoflife</option>
        <option value="gol-wrap">gol wrapped</option>
      </select>
      <button //onClick={
      // () => console.log(grid)}
      >
        log state
      </button>
      <label htmlFor="fps">
        CB Delta (% FPS)
        <input
          type="number"
          name="fps"
          id="fps"
          value={framePerSecond}
          onChange={evt => setFramePerSecond(evt.currentTarget.value)}
        />
      </label>

      <button onClick={() => toggleInitialised()}>{isInitilised ? 'disable' : 'init'} metro</button>
      <label htmlFor="bpm">
        BPM
        <input
          type="number"
          name="bpm"
          id="bpm"
          value={beatPerMin}
          onChange={evt => setBeatPerMin(evt.currentTarget.value)}
        />
      </label>

      <select value={timeSig} onChange={e => setTimeSig(e.currentTarget.value)}>
        <option value="1/4">1/4</option>
        <option value="2/4">2/4</option>
        <option value="3/4">3/4</option>
        <option value="4/4">4/4</option>
        <option value="5/4">5/4</option>
        <option value="6/4">6/4</option>
        <option value="6/8">6/8</option>
        <option value="12/8">12/8</option>
      </select>

      <legend>update diagram on</legend>
      <label htmlFor="Qs">
        4th-beats
        <input
          type="radio"
          name="Qs"
          id="Qs"
          checked={changeResolution === 'Qs'}
          onChange={e => setChangeResolution(e.currentTarget.name)}
        />
      </label>

      <label htmlFor="8s">
        8th-beats
        <input
          type="radio"
          name="8s"
          id="8s"
          checked={changeResolution === '8s'}
          onChange={e => setChangeResolution(e.currentTarget.name)}
        />
      </label>

      <label htmlFor="16s">
        16th-beats
        <input
          type="radio"
          name="16s"
          id="16s"
          checked={changeResolution === '16s'}
          onChange={e => setChangeResolution(e.currentTarget.name)}
        />
      </label>

      <label htmlFor="'1&3'">
        1&3
        <input
          type="radio"
          name="1&3"
          id="'1&3'"
          checked={changeResolution === '1&3'}
          onChange={e => setChangeResolution(e.currentTarget.name)}
        />
      </label>

      <label htmlFor="'2&4'">
        2&4
        <input
          type="radio"
          name="2&4"
          id="'2&4'"
          checked={changeResolution === '2&4'}
          onChange={e => setChangeResolution(e.currentTarget.name)}
        />
      </label>
    </div>
  );
}

export default AppUi;
