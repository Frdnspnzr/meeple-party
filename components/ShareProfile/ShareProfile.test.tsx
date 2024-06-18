import useBasePath from "@/hooks/useBasePath";
import { generateString, render } from "@/utility/test";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareProfile from "./ShareProfile";

jest.mock("@/i18n/client");
jest.mock("@/hooks/useBasePath");

describe("Share Profile", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
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
    const { container } = render(<ShareProfile profileId="abc" />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot without native sharing", () => {
    const { container } = render(
      <ShareProfile profileId="abc" disableNative />
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot without native sharing after clicking share button", async () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.5);
    const user = userEvent.setup();
    const { container } = render(
      <ShareProfile profileId="abc" disableNative />
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(container).toMatchSnapshot();
  });
  it("shares using native sharing", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    jest.mocked(useBasePath).mockReturnValue(baseUrl);

    const expectedShareData: ShareData = {
      url: `${baseUrl}/profile/${profileId}`,
    };

    const canShareMock = jest.fn();
    canShareMock.mockReturnValue(true);

    const shareMock = jest.fn();

    jest
      .spyOn(global, "navigator", "get")
      .mockImplementation(
        () => ({ canShare: canShareMock, share: shareMock } as any)
      );

    render(<ShareProfile profileId={profileId} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(canShareMock).toHaveBeenCalledTimes(1);
    expect(canShareMock.mock.calls[0][0]).toEqual(expectedShareData);
    expect(shareMock).toHaveBeenCalledTimes(1);
    expect(shareMock.mock.calls[0][0]).toEqual(expectedShareData);
  });
  it("shows the url when native sharing is disabled", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    jest.mocked(useBasePath).mockReturnValue(baseUrl);

    const expectedUrl = `${baseUrl}/profile/${profileId}`;

    render(<ShareProfile profileId={profileId} disableNative />);

    await user.click(screen.getByRole("button"));

    const input = await waitFor(()=> screen.getByRole("textbox"));

    expect(input).toHaveValue(expectedUrl);
  });
  it("shows the url when native sharing is not available", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    jest.mocked(useBasePath).mockReturnValue(baseUrl);

    const expectedUrl = `${baseUrl}/profile/${profileId}`;

    const canShareMock = jest.fn();
    canShareMock.mockReturnValue(false);

    jest
      .spyOn(global, "navigator", "get")
      .mockImplementation(() => ({ canShare: canShareMock } as any));

    render(<ShareProfile profileId={profileId} />);

    await user.click(screen.getByRole("button"));

    const input = await waitFor(()=> screen.getByRole("textbox"));

    expect(input).toHaveValue(expectedUrl);
  });
  it("shows the url when native sharing can not be checked", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    jest.mocked(useBasePath).mockReturnValue(baseUrl);

    const expectedUrl = `${baseUrl}/profile/${profileId}`;

    jest
      .spyOn(global, "navigator", "get")
      .mockImplementation(() => ({ canShare: undefined } as any));

    render(<ShareProfile profileId={profileId} />);

    await user.click(screen.getByRole("button"));

    const input = await waitFor(()=> screen.getByRole("textbox"));

    expect(input).toHaveValue(expectedUrl);
  });
  it("copies url to clipboard when native sharing is disabled", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    jest.mocked(useBasePath).mockReturnValue(baseUrl);

    const expectedUrl = `${baseUrl}/profile/${profileId}`;

    render(<ShareProfile profileId={profileId} disableNative />);

    await user.click(screen.getByRole("button"));
    await waitFor(()=> user.click(screen.getByRole("button")));
    const clipboardText = await navigator.clipboard.readText();

    expect(clipboardText).toBe(expectedUrl);
  });
});
