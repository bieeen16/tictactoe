const mockSocketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  joinRoom: jest.fn(),
  leaveRoom: jest.fn(),
  makeMove: jest.fn(),
  onPlayerJoined: jest.fn(),
  onPlayerLeft: jest.fn(),
  onMoveMade: jest.fn(),
  onGameChat: jest.fn(),
  sendChatMessage: jest.fn(),
};

export default mockSocketService;
