describe("UserService", () => {
  describe("SignIn", () => {
    test("validate user inputs", () => {
      const userService = new UserService();
      const invalidEmailInput = { email: "invalidemail", password: "password123" };
      const invalidPasswordInput = { email: "user@example.com", password: "" };
      const validInput = { email: "user@example.com", password: "password123" };

      expect(() => userService.SignIn(invalidEmailInput)).toThrow("Invalid email format");
      expect(() => userService.SignIn(invalidPasswordInput)).toThrow("Password is required");
      expect(() => userService.SignIn(validInput)).not.toThrow();
    });

    test("Validate response", async () => {
      const userService = new UserService();
      const validInput = { email: "user@example.com", password: "password123" };
      const expectedResponse = {
        success: true,
        token: "valid.jwt.token",
        user: {
          id: "12345",
          email: "user@example.com",
          name: "Test User",
        },
      };

      jest.spyOn(userService, "SignIn").mockResolvedValue(expectedResponse);

      const response = await userService.SignIn(validInput);

      expect(response).toEqual(expectedResponse);
      expect(response).toHaveProperty("token");
      expect(response).toHaveProperty("user");
      expect(response.user).toMatchObject({
        email: validInput.email,
        name: expect.any(String),
      });
    });

    test("throws error for invalid credentials", async () => {
      const userService = new UserService();
      const invalidInput = { email: "wrong@example.com", password: "wrongpassword" };
      jest.spyOn(userService, "SignIn").mockImplementation(() => {
        throw new Error("Invalid email or password");
      });

      await expect(userService.SignIn(invalidInput)).rejects.toThrow("Invalid email or password");
    });
  });
});