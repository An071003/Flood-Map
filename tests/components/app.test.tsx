import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/App';
import { useAppStore } from '../../src/stores/app-store';

// Mock MapStage for headless JSDOM testing
vi.mock('../../src/features/map/MapStage', () => ({
  MapStage: () => <div data-testid="mock-map-stage">3D Map Canvas</div>,
}));

describe('Flood Map HCMC App Component', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedAreaId: 'binh-thanh-nhc',
      timelineHour: 0,
      isPlaying: false,
      isSearchOpen: false,
      activeLayers: {
        flood: true,
        rain: true,
        weather: true,
        tide: true,
        is3D: true,
      },
    });
  });

  it('renders top bar brand and controls', () => {
    render(<App />);

    expect(screen.getByText('Flood Map')).toBeInTheDocument();
    expect(screen.getByText('Hồ Chí Minh City')).toBeInTheDocument();
    expect(screen.getByText('Dữ liệu mới')).toBeInTheDocument();
    expect(screen.getAllByText('3D').length).toBeGreaterThanOrEqual(1);
  });

  it('renders inspector panel with selected area metrics', () => {
    render(<App />);

    expect(screen.getByText('Nguyễn Hữu Cảnh')).toBeInTheDocument();
    expect(screen.getByText('Mức ngập ước tính')).toBeInTheDocument();
    expect(screen.getByText('CẢNH BÁO')).toBeInTheDocument();
    expect(screen.getByText('Vì sao có nguy cơ?')).toBeInTheDocument();
    expect(screen.getByText('Độ tin cậy')).toBeInTheDocument();
  });

  it('renders timeline with controls and scrub capabilities', () => {
    render(<App />);

    expect(screen.getByText('Dự báo ngập')).toBeInTheDocument();
    expect(screen.getByText('24 giờ tới')).toBeInTheDocument();
    expect(screen.getByText('NOW')).toBeInTheDocument();
    expect(screen.getByText('+24h')).toBeInTheDocument();

    const playBtn = screen.getByTitle('Phát diễn biến 24h');
    expect(playBtn).toBeInTheDocument();

    fireEvent.click(playBtn);
    expect(useAppStore.getState().isPlaying).toBe(true);
  });

  it('opens search modal on search button click or shortcut', () => {
    render(<App />);

    const searchBtn = screen.getByLabelText('Tìm kiếm khu vực hoặc tuyến đường');
    fireEvent.click(searchBtn);

    expect(screen.getByPlaceholderText('Tìm theo tên đường, phường hoặc quận...')).toBeInTheDocument();

    // Select an item from search
    const thaoDienResult = screen.getByText('Thảo Điền · Quốc Hương');
    fireEvent.click(thaoDienResult);

    expect(useAppStore.getState().selectedAreaId).toBe('thu-duc-thao-dien');
    expect(useAppStore.getState().isSearchOpen).toBe(false);
  });

  it('toggles layer rail buttons', () => {
    render(<App />);

    const rainToggle = screen.getByTitle('Lớp mưa hạt và mây dông');
    fireEvent.click(rainToggle);

    expect(useAppStore.getState().activeLayers.rain).toBe(false);
  });
});
