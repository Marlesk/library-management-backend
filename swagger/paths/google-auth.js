module.exports = {

  "api/auth/google/callback": {
    get: {
      security: [],
      tags: ["Google Login/Register"],
      summary: "Google OAuth login/register",
      description: "Login or register user via Google OAuth 2.0",
      parameters: [
        {
          name: "code",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Authorization code returned by Google"
        }
      ],
      responses: {
        200: {
          description: "Login/register successfully. JWT token returned successfully"
        }, 
        400: {
          description: 'Authorization code is missing'
        },
        401: {
          description: 'Problem in Google login'
        },
        409: {
          description: 'Email already registered with password'
        }   
      }
    }
  }
}