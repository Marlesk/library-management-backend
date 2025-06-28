module.exports = {

  "/api/books": {
    get: {
      tags: ["Books"],
      summary: "Retrieve all books",
      description: "Returns a list of all books available in the library.",
      responses: {
        200: {
          description: " A list of books retrieved successfully",
          content: {
            "application/json": {
                schema: {
                  type: "array",
                  items: {$ref: "#/components/schemas/Book"}
              }
            }
          }
        },
        403: {
          description: "Access denied. Token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        }
      }
    }
  },

  "/api/books/title/{title}": {
    get: {
      tags: ["Books"],
      summary: "Retrieve books by title",
      description: "Returns a list of books that match the specified title.",
      parameters: [
        {
          name: "title",
          in: "path",
          required:true,
          description: "The title of the book to be retrieved",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Books retrieved successfully",
          content: {
            "application/json": {
                schema: {
                  type: "array",
                  items: {$ref: "#/components/schemas/Book"}
              }
            }
          }
        },
        404: {
          description: "No books found with the given title"
        },
        403: {
          description: "Access denied. Token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        }
      }
    }
  },

   "/api/books/author/{author}": {
    get: {
      tags: ["Books"],
      summary: "Retrieve books by author",
      description: "Returns a list of books written by the specified author.",
      parameters: [
        {
          name: "author",
          in: "path",
          required:true,
          description: "The name of the author to retrieve books for",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Books retrieved successfully",
          content: {
            "application/json": {
                schema: {
                  type: "array",
                  items: {$ref: "#/components/schemas/Book"}
              }
            }
          }
        },
        404: {
          description: "No books found for the given author"
        },
        403: {
          description: "Access denied. Token is missing"
        },
        401: {
          description: "Authentication failed. Token is invalid or has expired"
        }
      }
    }
  }
}