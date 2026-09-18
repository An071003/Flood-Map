import React, { useEffect, useMemo } from 'react';
import { useAppStore } from '../../stores/app-store';
import { WeatherService } from '../../services/weather/weather-service';

export const ForecastTimeline: React.FC = () => {
  const timelineHour = useAppStore((s) => s.timelineHour);
  const setTimelineHour = useAppStore((s) => s.setTimelineHour);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const togglePlay = useAppStore((s) => s.togglePlay);

  const weatherService = useMemo(() => WeatherService.getInstance(), []);
  const steps = useMemo(() => weatherService.getTimelineSteps(), [weatherService]);
  const currentStep = steps[timelineHour] || steps[0];

  // Autoplay ticker loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setTimelineHour(timelineHour >= 24 ? 0 : timelineHour + 1);
    }, 450);

    return () => clearInterval(interval);
  }, [isPlaying, timelineHour, setTimelineHour]);

  return (
    <section className="timeline" aria-label="Dòng thời gian dự báo ngập">
      <div className="timeline-head">
        <div>
          <strong>Dự báo ngập</strong>
          <span>24 giờ tới</span>
        </div>
        <button
          className={`play ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          title={isPlaying ? 'Tạm dừng dự báo' : 'Phát diễn biến 24h'}
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát diễn biến'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="track-wrap">
        <input
          id="timeline-range"
          type="range"
          min={0}
          max={24}
          step={1}
          value={timelineHour}
          onChange={(e) => setTimelineHour(Number(e.target.value))}
          aria-label="Thời gian dự báo tính theo giờ"
        />
        <div className="time-labels">
          <span className={timelineHour === 0 ? 'active' : ''}>NOW</span>
          <span className={timelineHour === 3 ? 'active' : ''}>+3h</span>
          <span className={timelineHour === 6 ? 'active' : ''}>+6h</span>
          <span className={timelineHour === 12 ? 'active' : ''}>+12h</span>
          <span className={timelineHour === 24 ? 'active' : ''}>+24h</span>
        </div>
      </div>

      <div className="forecast-chip">
        <span id="forecast-time-label">{currentStep.label}</span>
        <strong id="forecast-note-label">{currentStep.note}</strong>
      </div>
    </section>
  );
};
