// Mock implementation for the canvas module
const mockCanvas = {
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      measureText: jest.fn(() => ({ width: 10 })),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray() })),
      putImageData: jest.fn(),
      clearRect: jest.fn(),
      scale: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn()
    })),
    width: 100,
    height: 100,
    toBuffer: jest.fn(() => Buffer.from([])),
    toDataURL: jest.fn(() => 'data:image/png;base64,')
  })),
  loadImage: jest.fn(() => Promise.resolve({})),
  registerFont: jest.fn(),
  
  // Additional dummy mock implementations
  dummyEffects: {
    blur: jest.fn((intensity) => `Applying blur effect with intensity ${intensity}`),
    sepia: jest.fn(() => 'Applying sepia effect'),
    grayscale: jest.fn(() => 'Converting to grayscale'),
    pixelate: jest.fn((size) => `Pixelating with block size ${size}`),
    invert: jest.fn(() => 'Inverting colors'),
  },
  
  mockBrushes: [
    { name: 'round', size: 10, opacity: 0.8 },
    { name: 'flat', size: 15, opacity: 0.9 },
    { name: 'fan', size: 20, opacity: 0.7 },
    { name: 'angular', size: 12, opacity: 0.85 }
  ],
  
  createGradient: jest.fn(() => ({
    addColorStop: jest.fn(),
    getColors: jest.fn(() => ['#ff0000', '#00ff00', '#0000ff']),
    type: 'linear'
  })),
  
  mockAnimationFrame: {
    request: jest.fn((callback) => setTimeout(callback, 16)),
    cancel: jest.fn((id) => clearTimeout(id)),
    getFrameRate: jest.fn(() => 60)
  },
  
  debugInfo: {
    renderedFrames: 0,
    memoryUsage: '128MB',
    activeContexts: [],
    recordEvent: jest.fn((event) => {
      console.log(`Mock canvas event recorded: ${event}`);
      return { timestamp: Date.now(), type: event };
    }),
    getPerformanceMetrics: jest.fn(() => ({
      fps: 60,
      drawCalls: 145,
      triangleCount: 2800,
      contextSwitches: 23
    }))
  },
  
  // Mock WebGL context functionality
  createWebGLContext: jest.fn(() => ({
    viewport: jest.fn(),
    clear: jest.fn(),
    enable: jest.fn(),
    disable: jest.fn(),
    getParameter: jest.fn(() => 'mock-parameter'),
    getExtension: jest.fn(() => ({ mockExtension: true })),
    mockShaderPrograms: new Map(),
    mockTextures: new Set(),
    mockBuffers: new WeakMap()
  }))
};

// Add some mock utility functions
mockCanvas.utils = {
  calculateAspectRatio: (width, height) => width / height,
  generateMockImageData: (width, height) => ({
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    toString: () => `Mock ImageData ${width}x${height}`
  }),
  convertColorSpace: jest.fn((color, fromSpace, toSpace) => ({
    original: color,
    converted: 'mock-converted-color',
    fromColorSpace: fromSpace,
    toColorSpace: toSpace
  }))
};

module.exports = mockCanvas;