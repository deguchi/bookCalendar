import React from 'react'
import {Component} from 'react';

import { api } from './util/api';
import { normalizePubdate, applySort } from './util/sort';
import translateBooks from './util/translateBooks';

import ISBN from 'isbnjs';


interface Props {
}

interface State {
    books: Book[]
    error: boolean
    keywords: Keyword[]
    keywords_length: number
    loading: boolean
}


class App extends Component<Props, State> {
    constructor(props:Props) {
        super(props)
    }
    render() {
        return (<React.Fragment>
            <div>Hello TightlyTemplate!</div>
        </React.Fragment>);
    }
}

export default App






export default class Calendar extends Component {
  state: State
  constructor(props) {
    super(props);
    this.temp_books = {};
    this.state = {
      books: null,
      error: false,
      keywords: ['キングダム'],
      keywords_length: 0,
      popularKeywords: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({keywords_length: this.state.keywords.length})
  }
  }
  _search() {
    this.state.keywords.map((keyword)=> {
      request.get(`${theme.serverUrl}/calendar`)
      .query({ free: keyword })
      .end((err, res) => {
        // console.log(err);
        if (!err) {
          // console.log(res.body);
          // if (res.body.count === 0) {
          //   console.log('本が見つかりませんでした。');
          //   this.setState({ books: [] });
          //   return;
          // }
          let new_books
          if (this.state.books===null) {
            new_books = [];
          } else {
            // console.log(this.state.books)
            new_books = this.state.books;
          }
          res.body.books.map((book) => {
            const i = ISBN.parse(book.isbn);
            book.id = i.asIsbn10();
            new_books.push(book);
          });
          new_books = applySort(new_books, 'pubdate', true);
          this.setState({ books: new_books, loading: false, keywords_length: this.state.keywords.length });
        } else {
          this.setState({
            error: true,
          });
        }
      });
    });
  }
  _setBooks() {
    let books = [];
    Object.values(this.temp_books).map((value) => {
      books = books.concat(value);
    });
    let new_books = [];
    let book_ids = {};
    // 重複削除
    books.map((book) => {
      book_ids[book.id] = book;
    });
    Object.keys(book_ids).map((key) => {
      new_books.push(book_ids[key]);
    });

    new_books = applySort(new_books, 'pubdate', true);
    this.setState({ books: new_books });
  }
  _reload() {
    this.setState({
      loading: true,
      error: false,
    });
    this._loadKeywords(() => {
      this.setState({keywords_length: this.state.keywords.length})
      this._search();
    });
  }
  render() {
    // console.log(this.state.books)
    if (this.state.keywords.length > 0 && this.state.keywords.length !== this.state.keywords_length) {
      this._search();
      return <Spinner error={this.state.error} onPress={this._reload.bind(this)} />;
    }
    if (this.state.keywords.length === 0 || (this.state.loading===false && this.state.books && this.state.books.length <= 0)) {
      return <CalendarNoKeyword keywords={this.state.keywords} popularKeywords={this.state.popularKeywords} />
    }
    return (
      <Books books={this.state.books} keywords={this.state.keywords} reload={this._reload.bind(this)} loading={this.state.loading} />
    );
  }
}


