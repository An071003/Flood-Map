import React from 'react';
import { TopBar } from './components/TopBar';
import { LayerRail } from './components/LayerRail';
import { CityCard } from './components/CityCard';
import { Legend } from './components/Legend';
import { InspectorPanel } from './features/inspector/InspectorPanel';
import { ForecastTimeline } from './features/timeline/ForecastTimeline';
import { SearchModal } from './components/SearchModal';
import { MapStage } from './features/map/MapStage';
import './styles/app.css';

export const App: React.FC = () => {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="map-stage">
        <MapStage />
        <LayerRail />
        <CityCard />
        <InspectorPanel />
        <Legend />
        <ForecastTimeline />
      </main>
      <SearchModal />
    </div>
  );
};

export default App;
