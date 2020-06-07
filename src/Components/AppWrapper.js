import React from 'react';
import AppUi from './AppUi';
import AppGrid from './AppGrid';
import GridProvider from '../Grid.Context';
function AppWrapper() {
  return (
    <div className="app-wrapper">
      <GridProvider>
        <AppUi />
        <AppGrid />
      </GridProvider>
    </div>
  );
}

export default AppWrapper;
