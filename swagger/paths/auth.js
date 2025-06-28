module.exports = {
  "/api/auth/login": {
    post: {
      security: [],
      tags: ["Auth"],
      summary: "Login",
      description: "Authenticate user with username and password. Returns a JWT access token.",
      requestBody: {
        required: true,
        description: "Username and password are required to log in",
        content: {
          "application/x-www-form-urlencoded": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string", format: "password" }
              },
              required: ["username", "password"]
            }
          }
        }
      },
      responses: {
        200: {
          description: "JWT token returned successfully"
        },
        404: {
          description: "User not found or password is incorrect"
        },
        400: {
          description: "Bad request. Username or password missing"
        }
      }
    }
  }
}
