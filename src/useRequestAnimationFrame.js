import React from 'react';

export const useAnimationFrame = (callback, isPlaying, frameRate = 60) => {
  //
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;
  //
  const loop = React.useCallback(
    () => {
      frameRef.current = requestAnimationFrame(loop);
      // console.log('franeRef', frameRef);
      if (frameRef.current % frameRate === 0) {
        const cb = callbackRef.current;
        cb();
        console.log('tick');
      }
    },
    [ frameRate ]
  );

  const frameRef = React.useRef();
  //
  React.useLayoutEffect(
    () => {
      if (isPlaying) {
        frameRef.current = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      return () => cancelAnimationFrame(frameRef.current);
    },
    [ loop, isPlaying, callback ]
  );
};
