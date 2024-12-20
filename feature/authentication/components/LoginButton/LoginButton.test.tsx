import { render } from "@/lib/utility/test";
import LoginButton from "./LoginButton";

jest.mock("@/i18n/client");

describe("Link button", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it("matches snapshot", () => {
    const { container } = render(<LoginButton />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot with redirect property defined", () => {
    const { container } = render(<LoginButton redirectUrl="https://example.com/url-to-redirect-to"/>);
    expect(container).toMatchSnapshot();
  });
});
