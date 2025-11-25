import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CalendlyButton from "@/components/ui/CalendlyButton";

// Mock react-calendly
vi.mock("react-calendly", () => ({
  PopupButton: ({ text, className, disabled }: any) => (
    <button className={className} disabled={disabled}>
      {text}
    </button>
  ),
}));

describe("CalendlyButton", () => {
  beforeEach(() => {
    // Set up DOM element for rootElement
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });

  it("renders with default text", () => {
    render(<CalendlyButton url="https://calendly.com/test" />);
    expect(screen.getByText("Schedule a Call")).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<CalendlyButton url="https://calendly.com/test" text="Book Now" />);
    expect(screen.getByText("Book Now")).toBeInTheDocument();
  });

  it("renders disabled button when no URL is provided", () => {
    render(<CalendlyButton />);
    const button = screen.getByTitle("Calendly URL not configured");
    expect(button).toBeDisabled();
  });

  it("applies primary variant class by default", () => {
    render(<CalendlyButton url="https://calendly.com/test" />);
    const button = screen.getByText("Schedule a Call");
    expect(button).toHaveClass("btn-primary");
  });

  it("applies custom className when provided", () => {
    render(
      <CalendlyButton
        url="https://calendly.com/test"
        className="custom-class"
      />,
    );
    const button = screen.getByText("Schedule a Call");
    expect(button).toHaveClass("custom-class");
  });

  it("renders with prefill data", () => {
    const prefill = {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };
    render(
      <CalendlyButton url="https://calendly.com/test" prefill={prefill} />,
    );
    expect(screen.getByText("Schedule a Call")).toBeInTheDocument();
  });

  it("renders with UTM parameters", () => {
    const utm = {
      utmCampaign: "test-campaign",
      utmSource: "test-source",
    };
    render(<CalendlyButton url="https://calendly.com/test" utm={utm} />);
    expect(screen.getByText("Schedule a Call")).toBeInTheDocument();
  });
});
