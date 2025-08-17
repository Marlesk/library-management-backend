const Book = require('../models/book.model')
const axios = require('axios')
const ApiError = require('../utils/ApiErrors')

exports.findBook = async(title, author) => {
  const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
     params: {
      q: `intitle:${title}+inauthor:${author}`,
      key: process.env.GOOGLE_BOOKS_API_KEY,
      maxResults: 5,
    },
  })

  const books = response.data.items.map((item) => {
    const volumeInfo = item.volumeInfo
    return {
      title: volumeInfo.title,
      author: volumeInfo.authors,
      publisher: volumeInfo.publisher,
      year: parseInt(volumeInfo.publishedDate?.slice(0, 4)),
      isbn: volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13")?.identifier,
      description: volumeInfo.description,
      genre: volumeInfo.categories,
      page: volumeInfo.pageCount,
      coverImage: volumeInfo.imageLinks?.thumbnail || ''
    }
  })

  return books
}

exports.createBook = async(data) => {
  const requiredFields = ['title', 'author', 'isbn'] 

  for (let key of requiredFields) {
    const value = data[key]

    if ( value === undefined || value === null ||
     (typeof value === 'string' && !value.trim())  ||  (Array.isArray(value) && value.length === 0)) {
      throw new ApiError(400, `${key} is required field`)
    }

  }

  const duplicateBook = await Book.findOne({ isbn: data.isbn })
  if (duplicateBook) throw new ApiError(409, "Conflict error", {isbn: 'Book already exists'} )

  // if (data.author && typeof data.author === 'string') {
  //   data.author = [data.author]
  // }

  const newBook = new Book({
    title: data.title,
    author: data.author,
    publisher: data.publisher,
    year: data.year,
    isbn: data.isbn,
    description: data.description,
    genre: data.genre,
    coverImage: data.coverImage,
    page: data.page
  })
  
  return await newBook.save()
}

exports.findAllBooks = async() => {
  return await Book.find().select('-_id')
}

exports.updateBookDetails = async(isbn, data) => {

  // Αν author υπάρχει και είναι string, μετατρέψτο σε array
  // if (data.author && typeof data.author === 'string') {
  //   data.author = [data.author]
  // }

  // Έλεγχος για τα κενα υποχρεωτικά στα πεδία αν υπάρχουν
  if ('title' in data && !data.title.trim()) {
    throw new ApiError(400, 'Title cannot be empty')
  }

  if ('author' in data && (!Array.isArray(data.author) || data.author.length === 0)) {
    throw new ApiError(400, 'Author cannot be empty')
  }

  return await Book.findOneAndUpdate( {isbn: isbn}, { $set: data }, { new: true, runValidators: true } )
                                    
}

exports.removeBookByIsbn = async(isbn) => {
  return await Book.findOneAndDelete({isbn: isbn})
}

exports.findBooksByTitle = async(title) => {
  const cleanedTitle = title.trim();
  return await Book.find({
    title: { $regex: cleanedTitle, $options: 'i' }
  })
}

exports.findBooksByAuthor = async(author) => {
  const cleanedAuthor = author.trim();
  return await Book.find({
    author: { $regex: cleanedAuthor, $options: 'i' }
  })
}

exports.findBookByIsbn = async(isbn) => {
  return await Book.findOne({ isbn })
}

/* istanbul ignore next */
exports.findLastInsertedBook = async() => {
  try {
    const result = await Book.find().sort({_id: -1}).limit(1)
    return result[0]
  } catch(error) {
    return false
  }
}

