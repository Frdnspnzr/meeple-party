import { render } from "@/utility/test";
import Metric from "./Metric";

describe("Metric", () => {
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
  it("shows correctly for string value", () => {
    const { container } = render(<Metric value="Value" label="Label" />);
    expect(container).toMatchSnapshot();
  });
  it("shows correctly for numeric value", () => {
    const { container } = render(<Metric value={5} label="Label" />);
    expect(container).toMatchSnapshot();
  });
  it("shows correctly for numeric value with decimals", () => {
    const { container } = render(<Metric value={5.123456789} label="Label" />);
    expect(container).toMatchSnapshot();
  });
  it("shows correctly for numeric value with decimals and precision", () => {
    const { container } = render(
      <Metric value={5.123456789} label="Label" precision={2} />
    );
    expect(container).toMatchSnapshot();
  });
});
