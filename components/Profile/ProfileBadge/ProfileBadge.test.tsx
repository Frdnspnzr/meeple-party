import { render } from "@/utility/test";
import ProfileBadge from "./ProfileBadge";

jest.mock("@/i18n/client");

describe("Profile badge", () => {
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
  test.each(["admin", "premium", "user", "family", "me", "friend"])(
    "type %s matches snapshot",
    (type) => {
      const { container } = render(<ProfileBadge type={type as any} />);
      expect(container).toMatchSnapshot();
    }
  );
});
