const mockNavigate = jest.fn();

export const useNavigate = () => mockNavigate;
export const BrowserRouter = ({ children }) => <>{children}</>;
