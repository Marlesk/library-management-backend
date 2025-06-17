const Book = require('../models/book.model')
const axios = require('axios')

exports.findByTitle = async(title) => {
  const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
     params: {
      q: `intitle:${title}`,
      key: process.env.GOOGLE_BOOKS_API_KEY,
      maxResults: 5,
    },
  })

  const books = response.data.items.map((item) => {
    const volumeInfo = item.volumeInfo
    return {
      title: volumeInfo.title,
      author: volumeInfo.authors,
      description: volumeInfo.description,
      genre: volumeInfo.categories,
      year: parseInt(volumeInfo.publishedDate?.slice(0, 4)),
      isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier,
      coverImage: volumeInfo.imageLinks?.thumbnail || ''
    }
  })

  return books
}

exports.createBook = async(data) => {
  const newBook = new Book({
    title: data.title,
    author: data.author,
    description: data.description,
    genre: data.genre,
    year: data.year,
    isbn: data.isbn,
    coverImage: data.coverImage
  })
  
  return await newBook.save()
}