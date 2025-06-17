module.exports = {

  "/api/admin/users": {
    get: {
      tags: ["Admin"],
      summary: "View all users",
      description: "Returns full details of all users",
      responses: {
        200: {
          description: "A JSON array of user's details",
          content: {
            "application/json": {
                schema: {
                  type: "array",
                  items: {$ref: "#/components/schemas/User"}
              }
            }
          }
        },
        403: {
          description: "Access denied. No token provided or only admin can view all users"
        },
        401: {
          description: "Invalid or expired token"
        }
      }
    }
  },

  "/api/admin/users/username/{username}/": {
    get: {
      tags: ["Admin"],
      summary: "Search a user by username",
      parameters: [
        {
          name: "username",
          in: "path",
          required:true,
          description: "Username of user that we want to find",
          type: "string"
        }
      ],
      description: "Return users details for specific username",
      responses: {
        200: {
          description: "User details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        },
        404: {
          description: "User not exist"
        },
        403: {
          description: "Access denied. No token provided or only admin can view the user"
        },
        401: {
          description: "Invalid or expired token"
        }
      }
    },
    delete: {
      tags: ["Admin"],
      summary: "Delete a user by username",
      parameters: [
        {
          name: "username",
          in: "path",
          required:true,
          description: "Username of user that we want to delete",
          type: "string"
        }
      ],
      description: "Delete the account of the user",
      responses: {
        200: {
          description: "Account deleted successfully",
        },
        404: {
          description: "User not exist",
        },
        403: {
          description: "Access denied. No token provided or only admin can delete the user"
        },
        401: {
          description: "Invalid or expired token"
        }
      }
    }
  },

  "/api/admin/users/email/{email}": {
    get: {  
      tags: ["Admin"],
      summary: "Search a user by email",
      parameters: [
        {
          name: "email",
          in: "path",
          required:true,
          description: "Email of user that we want to find",
          type: "string"
        }
      ],
      description: "Return users details for specific email",
      responses: {
        200: {
          description: "User details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        },
        404: {
          description: "User not exist"
        },
        403: {
          description: "Access denied. No token provided or only admin can view the user"
        },
        401: {
          description: "Invalid or expired token"
        }
      }
    },
    delete: {
      tags: ["Admin"],
      summary: "Delete a user by email",
      parameters: [
        {
          name: "email",
          in: "path",
          required:true,
          description: "Email of user that we want to delete",
          type: "string"
        }
      ],
      description: "Delete the account of the user",
      responses: {
        200: {
          description: "Account deleted successfully",
        },
        404: {
          description: "User not exist",
        },
        403: {
          description: "Access denied. No token provided or only admin can delete the user"
        },
        401: {
          description: "Invalid or expired token"
        }
      }
    }
  }
}