import "@testing-library/jest-dom";

import { render, renderHook, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../pages/LoginPage";
import useLogin from "hooks/useLogin";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("로그인 테스트1", () => {
  beforeEach(() => {
    // given: 회원가입 페이지
    const routes = [
      {
        path: "/signup",
        element: <LoginPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  test("로그인 성공", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useLogin(), { wrapper });

    await waitFor(() => result.current.isSuccess);
  });
});
