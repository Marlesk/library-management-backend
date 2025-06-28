module.exports = {

  "/api/admin/books/google-search/{title}/{author}": {
    get: {
      tags: ["Admin-Books"],
      summary: "Search book information using Google Books API",
      description: "Fetches book details from Google Books based on the given title and author. Admin access required.",
      parameters: [
        {
          name: "title",
          in: "path",
          required: true,
          description: "Title of the book to search for",
          schema: { type: "string" }
        },
        {
          name: "author",
          in: "path",
          required: true,
          description: "Author of the book to search for",
          schema: { type: "string" }
        }

      ],
      responses: {
        200: {
          description: "Book found successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Book"
              }
            }
          }
        },
        403: {
          description: "Forbidden. Admin privileges required or token not provided"
        },
        401: {
          description: "Unauthorized. Invalid or expired token"
        }
      }
    }
  },

  "/api/admin/books": {
    post: {
      tags:["Admin-Books"],
      summary: "Add a new book",
      description: "Add a new book to the library database. Admin access required.",
      requestBody: {
        description: "JSON object containing book details.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                author: { 
                  type: "array", 
                  items: {
                    type: "string"
                  }
                },
                publisher: { type: "string" },
                year: { type: "integer" },
                isbn: { type: "string" },
                description: { type: "string" },
                genre: { 
                  type: "array", 
                  items: {
                    type: "string"
                  }
                },
                page: { type: "integer" },
                coverImage: { type: "string" }
              },
              required: ["title", "author","isbn"]
            }
          }
        }
      },
      responses: {
        200: {
          description: "Book added successfully"
        },
        400: {
          description: "Bad request. Missing required fields: title, author, or isbn"
        },
        409: {
          description: "Conflict. The book already exists"
        },
        403: {
          description: "Forbidden. Admin privileges required or token not provided"
        },
        401: {
          description: "Unauthorized. Invalid or expired token"
        }
      }
    }
  },

  "/api/admin/books/{isbn}": {
    patch: {
      tags:["Admin-Books"],
      summary: "Update a book details",
      description: "Updates the details of an existing book in the library database. Admin access is required.",
      parameters: [
        {
          name: "isbn",
          in: "path",
          required: true,
          description: "The ISBN of the book to update",
          schema: { type: "string" }
        }
      ],
      requestBody: {
        description: "JSON object containing updated book details",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                author: { 
                  type: "array", 
                  items: {
                    type: "string"
                  }
                },
                publisher: { type: "string" },
                year: { type: "integer" },
                description: { type: "string" },
                genre: { 
                  type: "array", 
                  items: {
                    type: "string"
                  }
                },
                page: { type: "integer" },
                coverImage: { type: "string" }
              },
              required: ["title", "author"]
            }
          }
        }
      },
      responses: {
        200: {
          description: "Book updated successfully"
        },
        400: {
          description: "Invalid update data. Fields must be valid if provided"
        },
        403: {
          description: "Forbidden. Admin privileges required or token not provided"
        },
        401: {
          description: "Unauthorized. Invalid or expired token"
        }
      }
    },

     delete: {
      tags:["Admin-Books"],
      summary: "Delete a book by ISBN",
      description: "Deletes a book from the library database. Admin access is required.",
      parameters: [
        {
          name: "isbn",
          in: "path",
          required: true,
          description: "The ISBN of the book to delete",
          schema: { type: "string" }
        }
      ],
      responses: {
        200: {
          description: "Book deleted successfully",
        },
        404: {
          description: "Book not found"
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
