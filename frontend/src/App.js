import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import SetBirthday from './components/NewBook'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`
const ALL_BOOKS = gql`
  {
    allBooks {
      title
      author
      genres
      published
    }
  }
`
const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title,
      author
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation changeBirthday($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name
      born: $born
    )
  }
`


const App = () => {

  const [page, setPage] = useState( 'authors' )
  const authors = useQuery( ALL_AUTHORS )
  const books = useQuery( ALL_BOOKS )
  const [addBook] = useMutation( CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }]
  })
  const [editAuthor] = useMutation( EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage( 'authors' )}>Authors</button>
        <button onClick={() => setPage( 'books' )}>Books</button>
        <button onClick={() => setPage('add')}>NewBook</button>
      </div>

      <Authors
        show = {page === 'authors'} result = {authors}
      />
      <Books
        show = {page === 'books'} result = {books}
      />  
      <SetBirthday
        show = {page === 'books'} editAuthor = {editAuthor}
      />
      <NewBook
        show = {page === 'add'} addBook = {addBook} setPage = {page => setPage(page)}
      />

    </div>
  )
}

export default App