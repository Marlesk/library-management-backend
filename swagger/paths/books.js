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
  },

  "/api/books/isbn/{isbn}": {
    get: {
      tags: ["Books"],
      summary: "Retrieve book by isbn",
      description: "Returns a book that match the specified isbn.",
      parameters: [
        {
          name: "isbn",
          in: "path",
          required:true,
          description: "The isbn of the book to be retrieved",
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        200: {
          description: "Book retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {$ref: "#/components/schemas/Book"}
                }
              }
            }
          }
        },
        404: {
          description: "No book found with the given isbn"
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