module.exports = {

  "/api/users/register": {
     post: {
      tags: ["Users"],
      summary: "Create user",
      description: "Data of users that we want to create",
      requestBody: {
        description: "Json with user data",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstname: { type: "string" },
                lastname: { type: "string" },
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
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
          description: "User created successfully.",
        },
        409: {
          description: "Duplicate email or username or admin user.",
        },
        400: {
          description: "Bad request – missing required fields or invalid data format.",
        }
      }
    }
  },

  "/api/users/profile": {
    get: {
      tags: ["Users"],
      summary: "View the logged-in user's profile",
      description: "Returns full details of the logged-in user",
      responses: {
        200: {
          description: "User profile data",
          content: {
            "application/json": {
                schema: {
                  $ref: "#/components/schemas/User" 
              }
            }
          }
        },
        400: {
          description: "Failed to fetch profile.",
        },
        403: {
          description: "Access denied. No token provided."
        },
        401: {
          description: "Invalid or expired token."
        }
      }
    },

    patch: {
      tags: ["Users"],
      summary: "Update logged-in user's details",
      description: "Update user's details (only send fields you want to change)",
      requestBody: {
        description: "Data of user to update",
        content: {  
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {type: "string"},
                  email: {type: "string"},
                  password: {type: "string"}
                }
              }
            }
        }
      },
      responses: {
        200: {
          description: "User updated successfully."
        },
        409: {
        description: "Duplicate email.",
        },
        400: {
          description: "Bad request – missing required fields or invalid data format.",
        },
        403: {
          description: "Access denied. No token provided."
        },
        401: {
          description: "Invalid or expired token."
        }
      }
    },

    delete: {
      tags: ["Users"],
      summary: "Delete logged-in user's account",
      description: "Deletes the account of the currently authenticated user.",
      responses: {
        200: {
          description: "Account deleted successfully.",
        },
        401: {
          description: "Invalid or expired token."
        },
        403: {
          description: "Access denied. No token provided.",
        }
      }
    }
  }
}