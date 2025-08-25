const Borrow = require('../models/borrow.model')
const Book = require('../models/book.model')
const ApiError = require('../utils/ApiErrors')
const User = require('../models/user.model')


// For Users
exports.findBookByIsbn = async(isbn) => {
  return await Book.findOne({ isbn })
}

exports.findBorrowBook = async(userId) => {
  return await Borrow.findOne( { userId, status: { $in: ['requested', 'borrowed'] } } )
}

exports.requestBook = async(userId, isbn) => {

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, 'Your account is no longer active');
  }

  if (!isbn) {
    throw new ApiError(400, 'ISBN is a required field')
  }

  const book = await this.findBookByIsbn(isbn)
  if (!book) {
    throw new ApiError(404, 'Book not found')
  }

  if (!book.available) {
    throw new ApiError(400, 'This book is currently unavailable (already borrowed)')
  }

  const existingBorrow = await this.findBorrowBook(userId)
  if (existingBorrow) {
    if (existingBorrow.status === 'requested') {
      throw new ApiError(400, 'You already have a pending borrow request');
    }
    if (existingBorrow.status === 'borrowed') {
      throw new ApiError(400, 'You already have a borrowed book. Return it before requesting another');
    }
  }

  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(100 + Math.random() * 900)
  const borrowCode = `BRC-${timestamp}${random}`

  const borrow = new Borrow({
    userId: userId,
    bookId: book._id,
    borrowCode: borrowCode,
    status: 'requested',
    borrowDate: null,
    returnDate: null,
  })

  await borrow.save()

  book.available = false
  await book.save()

  return { borrowCode, book }

}

exports.getBorrowBooks = async(userId, status) => {
  const query = { userId }

  if (status === 'requested') query.status = 'requested'
  else if (status === 'borrowed') query.status = 'borrowed'
  else if (status === 'returned') query.status = 'returned'

  const records = await Borrow.find(query).populate('bookId').sort({ createdAt: -1 })

  return records
}


// For Admin
exports.getAllRecordsBooks = async(status) => {
  const query = {}
  let sortField = 'createdAt'

  if (status === 'requested') {
    query.status = 'requested'
    sortField = 'createdAt'
  }
  else if (status === 'borrowed') {
    query.status = 'borrowed'
    sortField = 'borrowDate'
  } 
  else if (status === 'returned') {
    query.status = 'returned'
    sortField = 'returnDate'
  } 

  return await Borrow.find(query)
          .populate({path: 'bookId', select:'title author isbn coverImage'})
          .populate({path: 'userId', select: 'firstname lastname email'})
          .sort({[sortField]: -1})
}

// Accept a borrow request (change status to borrowed)
exports.acceptRequest = async (code) => {
  if (!code) {
    throw new ApiError(400, 'Borrow Code is a required field')
  }

  const borrow = await Borrow.findOne({borrowCode: code, status: 'requested'})
                                .populate({path: 'bookId', select:'-_id title author isbn coverImage'})
                                .populate({path: 'userId', select:'-_id firstname lastname email'})
                             
  if (!borrow) {
    throw new ApiError(404, 'Invalid borrow code')
  }
  
  borrow.status = 'borrowed'
  borrow.borrowDate = new Date()
  await borrow.save()

  return borrow
}

// Return book 
exports.returnBook = async(isbn) => {

  if (!isbn?.trim()) {
    throw new ApiError(400, 'ISBN is a required field')
  }

  const book = await Book.findOne({isbn})
  if (!book) {
    throw new ApiError(404, 'Book not found')
  }

  const borrow = await Borrow.findOne({bookId: book._id, status: 'borrowed'})
                                  .populate({path: 'bookId', select:'-_id title author isbn coverImage'})
                                  .populate({path: 'userId', select: 'firstname lastname email'})

  borrow.status = 'returned'
  borrow.returnDate = new Date()
  await borrow.save()

  book.available = true
  await book.save()

  return borrow
}

//Find Borrow Code 
/* istanbul ignore next */
exports.findBorrowCode = async() => {
  return await Borrow.findOne({ status: 'requested'})
}

/* istanbul ignore next */
exports.findBorrowIsbn = async() => {
  const borrow =  await Borrow.findOne({ status: 'borrowed'})
  return await Book.findOne({ _id: borrow.bookId})
}




