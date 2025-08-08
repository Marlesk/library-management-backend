module.exports = {

  "/api/borrows": {
     post: {
      tags: ["Borrow"],
      summary: "Submit a borrow request for a book",
      description: "Allows an authenticated user to request borrowing a specific book using its ISBN, provided the book is available and the user has no other active borrow or pending request.",
      requestBody: {
        required: true,
        description: "The ISBN of the book the user wants to borrow",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                isbn: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Borrow request submitted successfully",
        },
        400: {
          description: "Bad Request — One of the following: ISBN is missing from the request, Book is currently unavailable (already borrowed), User already has a pending borrow request, User has an active borrowed book and must return it first"
        },
        404: {
          description: "No book found with the provided ISBN"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        },
        403: {
          description: "Access denied. Token is missing"
        }
      }
    },

    get: {
      tags: ["Borrow"],
      summary: "Get borrow records by status",
      description: "Fetch all borrow records. Use optional query parameter `status` to filter by requested or borrowed or returned books.",
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["requested","borrowed", "returned"]
          },
          required: false,
          description: "Filter records by borrow status: requested, borrowed or returned"
        }
      ],
      responses: {
        200: {  
          description: "Borrow records fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {type: "string"},
                  borrowCode: {type: "string"},
                  userId: {type: "string"},
                  bookId: { $ref: "#/components/schemas/Book"},
                  status: {type: "string", enum: ['requested', 'borrowed', 'returned']},
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
  }
}