import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("회원가입 테스트", () => {
  beforeEach(() => {
    // given: 회원가입 페이지
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
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

  test("비밀번호 입력 시 값이 다른 경우 에러 표출", async () => {
    // when
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(passwordInput, { target: { value: "pass" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "pass1" } });

    // then
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });

  test("이메일, 비밀번호 입력 후 비밀번호 확인이 성공하면 회원가입 성공", () => {
    //when 입력값이 없으면 회원가입 버튼 비활성화
    const signupBtn = screen.getByRole("button", { name: "회원가입" });
    expect(signupBtn).toBeDisabled();

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(emailInput, {
      target: {
        value: "button-activated@email.com",
      },
    });
    fireEvent.change(passwordInput, {
      target: {
        value: "password",
      },
    });
    fireEvent.change(confirmPasswordInput, {
      target: {
        value: "password",
      },
    });

    // 입력값이 정확하면 회원가입 버튼 활성화
    expect(signupBtn).toBeEnabled();
  });
});
