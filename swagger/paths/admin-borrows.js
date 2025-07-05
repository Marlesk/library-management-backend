module.exports = {

  "/api/admin/borrows": {
    get: {
      tags: ["Admin-Borrows"],
      summary: "Get all borrow records",
      description: "Retrieve all borrow records. Use optional query parameter `status` to filter by requested or borrowed or returned records. Admin privileges required.",
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["requested","borrowed", "returned"]
          },
          required: false,
          description: "Filter borrow records by status: requested, borrowed or returned"
        }
      ],
      responses: {
        200: {  
          description: "Borrow records retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {type: "string"},
                  userId: {
                    type: "object",
                    properties: {
                      _id: {type: "string"},
                      firstname: {type: "string"},
                      lastname: {type: "string"},
                      email: {type: "string", format: "email"}
                    }
                  },
                  bookId: { $ref: "#/components/schemas/Book"},
                  status: {type: "string", enum: ['requested', 'borrowed', 'returned']},
                  borrowCode: {type: "string"},
                  borrowDate: {type: "string", format: "date-time"},
                  returnDate: {type: "string", format: "date-time", nullable: true},
                }
              }
            }
          }
        },
        404: {
          description: "No borrow records found for the user (with or without status filter)"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        },
        403: {
          description: "Access denied. Token is missing"
        }
      }
    }
  },

  "/api/admin/borrows/accept/{code}": {
    post: {
      tags: ["Admin-Borrows"],
      summary: "Accept borrow request by borrow code",
      description: "Accepts a borrow request identified by its borrow code. Admin privileges required.",
      parameters: [
        {
          name: "code",
          in: "path",
          required:true,
          description: "The unique borrow code associated with the borrow request",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Borrow request accepted successfully"
        },
        404: {
          description: "No pending borrow request found for the given code"
        },
        403: {
          description: "Access denied. Only admins can access this resource or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    }
  },

  "/api/admin/borrows/returns/{isbn}": {
    post: {
      tags: ["Admin-Borrows"],
      summary: "Mark a book as returned",
      description: "Marks the book as returned by ISBN. Admin access required.",
      parameters: [
        {
          name: "isbn",
          in: "path",
          required:true,
          description: "The ISBN of the book being returned",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Book returned successfully"
        },
        404: {
          description: "Book not found"
        },
        400: {
          description: "No active borrow record found for this book"
        },
        403: {
          description: "Access denied. Only admins can access this resource or token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or expired"
        }
      }
    }
  }
}
