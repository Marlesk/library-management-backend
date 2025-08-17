module.exports = {

  "/api/admin/users": {
    get: {
      tags: ["Admin-Users"],
      summary: "Retrieve all users",
      description: "Returns a list containing full details of all registered users. Accessible only by admin user.",
      responses: {
        200: {
          description: "A JSON array containing user details",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    firstname: { type: "string" },
                    lastname: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string", "format": "email" },
                    role: {type: "string",
                            enum: ["admin", "user"],
                            default: "user"},
                    createdAt: { type: "string"}
                  },
                }
              }
            }
          }
        },
        403: {
          description: "Access denied. Only admins can access this resource or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        }
      }
    }
  },

  "/api/admin/users/username/{username}": {
    get: {
      tags: ["Admin-Users"],
      summary: "Retrieve a user by username",
      description: "Returns the details of a user based on the specified username. Accessible only by admin users.",
      parameters: [
        {
          name: "username",
          in: "path",
          required:true,
          description: "The username of the user to be retrieved",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "User details retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    firstname: { type: "string" },
                    lastname: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string", "format": "email" },
                    createdAt: { type: "string"}
                  },
                }
              }
            }
          }
        },
        404: {
          description: "User not found"
        },
        403: {
          description: "Access denied. Only admins can access this resource or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    },
    delete: {
      tags: ["Admin-Users"],
      summary: "Delete a user by username",
      parameters: [
        {
          name: "username",
          in: "path",
          required:true,
          description: "Deletes the account of a specific user based on their username. Only accessible by admin.",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "User account deleted successfully",
        },
        404: {
          description: "User not found",
        },
        403: {
          description: "Access denied. Only admins can delete users or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    }
  },

  "/api/admin/users/email/{email}": {
    get: {  
      tags: ["Admin-Users"],
      summary: "Search a user by email",
      description: "Returns the details of a user with a specific email address. Only accessible by admins.",
      parameters: [
        {
          name: "email",
          in: "path",
          required:true,
          description: "The email of the user to be retrieved",
          schema: {
            type: "string",
            format: "email"
          }
        }
      ],
      responses: {
        200: {
          description: "User details returned successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    firstname: { type: "string" },
                    lastname: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string", "format": "email" },
                    createdAt: { type: "string"}
                  },
                }
              }
            }
          }
        },
        404: {
          description: "User not found"
        },
        400: {
          description: "Email format is not correct"
        },
        403: {
          description: "Access denied. Only admins can view users or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    },
    delete: {
      tags: ["Admin-Users"],
      summary: "Delete a user by email",
      description: "Deletes the account of a user with the specified email address. Only accessible by admins.",
      parameters: [
        {
          name: "email",
          in: "path",
          required:true,
          description: "The email of the user to be deleted",
          schema: {
            type: "string",
            format: "email"
          }
        }
      ],
      responses: {
        200: {
          description: "Account deleted successfully"
        },
        404: {
          description: "User not found."
        },
        400: {
          description: "Email format is not correct"
        },
        403: {
          description: "Access denied. Admin-only operation or token missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    }
  }
}
