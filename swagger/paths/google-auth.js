module.exports = {

  "api/auth/google/callback": {
    post: {
      security: [],
      tags: ["Google Login"],
      summary: "Google OAuth login",
      description: "Login user via Google OAuth 2.0. Authorization code returned by Google",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: "string" }
              },
              required: ["code"]
            }
          }
        }
      },
      responses: {
        200: {
          description: "Login successfully. JWT token returned successfully"
        }, 
        400: {
          description: 'Authorization code is missing'
        },
        401: {
          description: 'Problem in Google login'
        },
        409: {
          description: 'Email already registered with password. Please login manually'
        }
      }
    }
  }
}