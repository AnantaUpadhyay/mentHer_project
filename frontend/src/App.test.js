import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Workspace from "./pages/Workspace";
import { AuthContext } from "./context/AuthContext";
import api from "./services/api";
jest.mock("./services/api", () => ({ post: jest.fn(), get: jest.fn() }));
function renderWithContext(component, path = "/", context = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthContext.Provider
        value={{ user: null, login: jest.fn(), ...context }}
      >
        {component}
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}
test("home explains mentorship, offers clear next steps and opens accessible FAQs", async () => {
  renderWithContext(<HomePage />);
  await waitFor(() => expect(screen.queryByText("Loading official resources…")).not.toBeInTheDocument());
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Your ambition.",
  );
  expect(
    screen.getByRole("link", { name: /Start your next chapter/ }),
  ).toHaveAttribute("href", "/signup?role=entrepreneur");
  const question = screen.getByRole("button", {
    name: "Does mentHer provide funding?",
  });
  expect(question).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(question);
  expect(question).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByText(/We help you discover official funding/),
  ).toBeVisible();
});
test("mentor signup keeps selected role and displays server errors", async () => {
  api.post.mockRejectedValueOnce({
    response: {
      data: { message: "An account with this email already exists." },
    },
  });
  renderWithContext(<AuthPage signup />, "/signup?role=mentor");
  expect(
    screen.getByRole("radio", { name: /Share my experience/ }),
  ).toBeChecked();
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Test Mentor" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "mentor@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "a-secure-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Create your account/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "An account with this email already exists.",
  );
  expect(api.post).toHaveBeenCalledWith(
    "/auth/signup",
    expect.objectContaining({ role: "mentor" }),
  );
});

const testUser = {
  id: 1,
  name: "Test Founder",
  role: "entrepreneur",
  bio: "A business profile",
  industry: "Technology",
  goal: "Find guidance",
};
beforeEach(() => {
  api.get.mockImplementation((path) =>
    Promise.resolve({
      data:
        path === "/schemes" ? {schemes:[]} : path === "/mentors"
          ? { mentors: [] }
          : path === "/requests"
            ? { requests: [] }
            : { resources: [], saved: [] },
    }),
  );
  window.matchMedia = jest.fn(() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});
test("mobile menu locks background scrolling and Escape restores focus", async () => {
  renderWithContext(<Workspace />, "/dashboard", { user: testUser });
  await screen.findByRole("button", { name: "Explore mentors" });
  const toggle = screen.getByRole("button", { name: "Toggle navigation" });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(document.body.style.overflow).toBe("hidden");
  expect(document.querySelector("main")).toHaveAttribute("inert");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(document.body.style.overflow).toBe("");
  expect(toggle).toHaveFocus();
});
test("unknown workspace tabs recover to the overview", async () => {
  renderWithContext(<Workspace />, "/dashboard?tab=missing", {
    user: testUser,
  });
  expect(
    await screen.findByRole("heading", { name: "A little progress, Test." }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: "Explore mentors" }),
  ).toBeInTheDocument();
});
