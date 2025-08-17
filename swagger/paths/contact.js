module.exports = {

  "/api/admin/messages": {
    get: {
      tags: ["Admin-Contact"],
      summary: "Retrieve all messages",
      description: "Returns a list of all ψονταψτ messages. Accessible only by admin user.",
      responses: {
        200: {
          description: "A JSON array containing all submitted messages",
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
                    message: { typr: "string" },
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

  "/api/contact": {
     post: {
      security: [],
      tags: ["Contact"],
      summary: "Send a message",
      description: "Allows any user to submit a message through the contact form.",
      requestBody: {
        required: true,
        description: "JSON object containing the user's message.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstname: { type: "string" },
                lastname: { type: "string" },
                email: { type: "string", format: "email" },
                message: { type: "string" },
              },
              required: ["firstname", "lastname","email", "message"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "Message sent successfully",
        },
        400: {
          description: "Some required fields are missing or email format is invalid."
        }
      }
    }
  }
}