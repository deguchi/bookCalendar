import React from 'react'
import {Component} from 'react';

import { applySort } from './util/sort'

import ISBN from 'isbnjs';

import Books from './Books'

interface App {
    temp_books: any
}

interface Props {
}

interface State {
    books: Book[] | null
    error: boolean
    keywords: string[]
    keywords_length: number
    loading: boolean
}

interface Book {
    id: number
    title: string
    isbn: string
}


class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.temp_books = {};
        this.state = {
          books: null,
          error: false,
          keywords: ['キングダム', 'ちはやふる', '進撃の巨人'],
          keywords_length: 0,
          loading: true,
        };
    }
    
    _search() {
        this.state.keywords.map((keyword)=> {
          fetch(`https://asia-northeast1-hohohoza-172907.cloudfunctions.net/calendar?free=${keyword}`)
          .then((r) => r.json())
          .then((r) => {
              // console.log(r);
              let new_books: Book[] = []
              if (this.state.books===null) {
                new_books = [];
              } else {
                // console.log(this.state.books)
                new_books = this.state.books;
              }
              r.books.map((book: Book) => {
                const i = ISBN.parse(book.isbn);
                book.id = i.asIsbn10();
                new_books.push(book);
              });
              new_books = applySort(new_books, 'pubdate', true);
              this.setState({ books: new_books, loading: false, keywords_length: this.state.keywords.length });
          });
        });
      }
      _reload() {
        this.setState({
          loading: true,
          error: false,
        });
      }
      render() {
        // console.log(this.state.books)
        if (this.state.keywords.length > 0 && this.state.keywords.length !== this.state.keywords_length) {
          this._search();
          return null
        }
        if (this.state.keywords.length === 0 || (this.state.loading===false && this.state.books && this.state.books.length <= 0)) {
          return null
        }
        return (
          <Books books={this.state.books} keywords={this.state.keywords} reload={this._reload.bind(this)} loading={this.state.loading} />
        );
      }
}

export default App








