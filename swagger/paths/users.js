module.exports = {

  "/api/users/register": {
     post: {
      security: [],
      tags: ["Users"],
      summary: "Create user",
      description: "Creates a new user account",
      requestBody: {
        required: true,
        description: "JSON object containing user details.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstname: { type: "string" },
                lastname: { type: "string" },
                username: { type: "string" },
                email: { type: "string", format: "email" },
                password: { 
                  type: "string", 
                  example: "Test123!"
                },
                role: {
                  type: "string",
                  enum: ["admin", "user"],
                  default: "user"
                }
              },
              required: ["firstname", "lastname","username","email", "password"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "User created successfully",
        },
        409: {
          description: "Conflict. Email or username already exists, or admin user already registered",
        },
        400: {
          description: "Some required fields are missing or data format is invalid. Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special symbol (!, #, @, $).",
        }
      }
    }
  },

  "/api/users/profile": {
    get: {
      tags: ["Users"],
      summary: "View the logged-in user's profile",
      description: "Retrieves the authenticated user's profile information.",
      responses: {
        200: {
          description: "User profile retrieved successfully",
          content: {
            "application/json": {
                schema: {
                  $ref: "#/components/schemas/User" 
              }
            }
          }
        },
        400: {
          description: "Bad request. Unable to retrieve user profile",
        },
        403: {
          description: "Access denied. Authentication token is missing"
        },
        401: {
          description: "Unauthorized. Token is invalid or has expired"
        }
      }
    },

    patch: {
      tags: ["Users"],
      summary: "Update the logged-in user's profile",
      description: "Updates the authenticated user's profile. Include only the fields you wish to change.",
      requestBody: {
        description: "User fields to update",
        content: {  
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { 
                    type: "string", 
                    format: "password",
                    example: "Test123!"
                  }
                }
              }
            }
        }
      },
      responses: {
        200: {
          description: "Profile updated successfully"
        },
        409: {
        description: "Conflict. Email already exists",
        },
        400: {
          description: "Bad request. Invalid fields.  Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special symbol (!, #, @, $).",
        },
        403: {
          description: "Forbidden. No token provided"
        },
        401: {
          description: "Unauthorized. Invalid or expired token"
        }
      }
    },

    delete: {
      tags: ["Users"],
      summary: "Delete the authenticated user's account",
      description: "Permanently deletes the account of the currently logged-in user.",
      responses: {
        200: {
          description: "User account deleted successfully",
        },
        400: {
          description: "Cannot delete your account. You have active borrowed book."
        },
        401: {
          description: "Unauthorized. Invalid or expired token"
        },
        403: {
          description: "Forbidden. No token provided",
        }
      }
    }
  }
}