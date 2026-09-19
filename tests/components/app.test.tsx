import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../../src/App';
import { useAppStore } from '../../src/stores/app-store';

// Mock MapStage for headless JSDOM testing
vi.mock('../../src/features/map/MapStage', () => ({
  MapStage: () => <div data-testid="mock-map-stage">3D Road Map Canvas</div>,
}));

describe('Flood Map HCMC App Component — Road-First V3', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedRoadId: 'road-nguyen-huu-canh',
      timelineHour: 0,
      isPlaying: false,
      isSearchOpen: false,
      searchQuery: '',
      persistedSearchQuery: '',
      activeLayers: {
        roadFlood: true,
        rain: true,
        weatherLabels: true,
        tide: true,
        is3D: true,
        hcmcBoundary: true,
      },
    });
  });

  it('renders top bar brand, search, and controls', () => {
    render(<App />);

    expect(screen.getByText('Flood Map')).toBeInTheDocument();
    expect(screen.getByText('Hồ Chí Minh City')).toBeInTheDocument();
    expect(screen.getByText('Mô hình ước tính')).toBeInTheDocument();
    expect(screen.getAllByText('3D').length).toBeGreaterThanOrEqual(1);
  });

  it('renders road inspector panel with decision-first metrics', () => {
    render(<App />);

    expect(screen.getByText('Nguyễn Hữu Cảnh')).toBeInTheDocument();
    expect(screen.getByText(/ước tính tại đoạn trũng/i)).toBeInTheDocument();
    expect(screen.getByText('CẢNH BÁO')).toBeInTheDocument();
    expect(screen.getByText('Vì sao có nguy cơ ngập?')).toBeInTheDocument();
    expect(screen.getByText('Mưa tích lũy 3h')).toBeInTheDocument();
    expect(screen.getByText(/Khả năng lưu thông theo phương tiện/i)).toBeInTheDocument();
    expect(screen.getByText('Đầy đủ dữ liệu')).toBeInTheDocument();
  });

  it('renders timeline with controls and quick-jump step pills', () => {
    render(<App />);

    expect(screen.getByText('Dự báo ngập')).toBeInTheDocument();
    expect(screen.getByText('24 giờ tới · Tuyến đường')).toBeInTheDocument();
    expect(screen.getByText('NOW')).toBeInTheDocument();
    expect(screen.getByText('+3h')).toBeInTheDocument();
    expect(screen.getByText('+24h')).toBeInTheDocument();

    const playBtn = screen.getByTitle('Phát diễn biến 24h');
    expect(playBtn).toBeInTheDocument();

    fireEvent.click(playBtn);
    expect(useAppStore.getState().isPlaying).toBe(true);

    // Click quick-jump pill +3h
    const step3h = screen.getByText('+3h');
    fireEvent.click(step3h);
    expect(useAppStore.getState().timelineHour).toBe(3);
  });

  it('persists search query after road selection', () => {
    render(<App />);

    const searchBtn = screen.getByLabelText('Tìm kiếm tuyến đường');
    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText('Tìm địa chỉ, số nhà, hẻm, địa điểm...');
    fireEvent.change(input, { target: { value: 'Thảo Điền' } });

    // Select Thảo Điền road
    const resultItem = screen.getByText('Quốc Hương · Thảo Điền');
    fireEvent.click(resultItem);

    expect(useAppStore.getState().selectedRoadId).toBe('road-quoc-huong-thao-dien');
    expect(useAppStore.getState().isSearchOpen).toBe(false);
    // Verified: Search query is persisted!
    expect(useAppStore.getState().persistedSearchQuery).toBe('Thảo Điền');
  });

  it('toggles layer rail buttons with tooltips', () => {
    render(<App />);

    const rainToggle = screen.getByTitle('Bật/tắt hiệu ứng hạt mưa rơi');
    fireEvent.click(rainToggle);

    expect(useAppStore.getState().activeLayers.rain).toBe(false);
  });
});
