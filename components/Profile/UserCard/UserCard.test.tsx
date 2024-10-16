import { render } from "@/utility/test";
import { Role } from "@prisma/client";
import UserCard from "./UserCard";

jest.mock("@/i18n/client");

describe("Profile header", () => {
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
  it("matches snapshot for full user details", () => {
    const user = {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: Role.ADMIN,
      image: null,
    };
    const { container } = render(<UserCard user={user} />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for minimal user details", () => {
    const user = {
      name: "Frdnspnzr",
      realName: null,
      bggName: null,
      about: null,
      id: "abc123",
      place: null,
      role: Role.USER,
      image: null,
    };
    const { container } = render(<UserCard user={user} />);
    expect(container).toMatchSnapshot();
  });
});
