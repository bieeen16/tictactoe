export default {
  get: jest.fn(() =>
    Promise.resolve({
      data: {
        games: [],
        totalPages: 1,
      },
    })
  ),
  post: jest.fn(() => Promise.resolve({ data: { message: "Success" } })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};
