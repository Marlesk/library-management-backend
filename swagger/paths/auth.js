module.exports = {
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      description: "Login User",
      requestBody: {
        description: "User sends username and password and receives a JWT token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string" }
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
};
