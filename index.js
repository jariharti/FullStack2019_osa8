/* Jari Hartikainen, 30.12.2019 */
/* Aalto University, Course: Full Stack Web Development, Part 8: GraphQL*/
const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid/v1')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * It would be more sensible to assosiate book and the author by saving 
 * the author id instead of the name to the book.
 * For simplicity we however save the author name.
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*8.1: kirjojen ja kirjailijoiden määrä
Toteuta kyselyt bookCount ja authorCount jotka palauttavat kirjojen ja kirjailijoiden lukumäärän.
query {
  bookCount
  authorCount
}
*/

/*8.2: kaikki kirjat ja kirjailijat
Toteuta kysely allBooks, joka palauttaa kaikki kirjat.

Seuraava kysely siis pitäisi pystyä tekemään
query {
  allBooks { 
    title 
    author
    published 
    genres
  }
}
*/

/* 8.3: kaikki kirjailijat
Toteuta kysely allAuthors joka palauttaa kaikki kirjailijat. Kyselyn vastauksessa kirjailijoilla tulee myös olla kenttä bookCount,
joka kertoo kirjailijan tekemien kirjojen määrän.
query {
  allAuthors {
    name
    bookCount
  }
}
*/

/* 8.4: kirjailijan kirjat
Laajenna kyselyä allBooks siten, että sille voi antaa optionaalisen parametrin author,
joka rajoittaa kirjalistan niihin, joiden author on parametrina annettu kirjailija.
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
*/

/* 8.5: genren kirjat
Laajenna kyselyä allBooks siten, että sille voi antaa optionaalisen parametrin genre, joka rajoittaa
kirjalistan niihin, joiden genrejen joukossa on parametrina annettu genre.
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
*/

/* 8.6: Kirjan lisäys
Toteuta mutaatio addBook, jota voi käyttää seuraavasti
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}
*/

/* 8.7: Kirjailijan syntymävuoden päivitys
Toteuta mutaatio editAuthor, jonka avulla on mahdollista asettaa kirjailijalle syntymävuosi. Mutaatiota käytetään seuraavasti

mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
*/

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String]
  }
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }
  type Query {
    allBooks(author: String, genre: String): [Book]
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    allBooks: (root, args) => {
      if (args.author && args.genre) {
        return books.filter(book => {
          return (book.author === args.author && book.genres.includes(args.genre));
        })
      }
      else if (args.author) {
        return books.filter(book => {
          return book.author === args.author;
        })
      }
      else if (args.genre) {
        return books.filter(book => {
          return book.genres.includes(args.genre);
        })
      }
      return books
    },
    bookCount: () => {
      return books.length;
    },
    authorCount: () => {
      return authors.length;
    },
    allAuthors: () => {
      return authors;
    },
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args }
      books = books.concat(book)
      if (!authors.includes(args.author)) {
        const author = { name: args.author, id: uuid() }
        authors = authors.concat(author)
      }
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => {
        return a.name === args.name;
      })
      if (!author) {
        return null
      }
  
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => {
        return a.name === args.name ? updatedAuthor : a;
      })
      return updatedAuthor
    }   
  },
  Author: {
    bookCount: (root) => {
      return books.filter(book => {
        return book.author === root.name;
      }).length;
    },
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server is ready at ${url}`);
});