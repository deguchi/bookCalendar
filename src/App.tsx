import React from 'react'
import { Component } from 'react';

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


function getQueryString() {
  const params = {}
  location.search.substr(1).split('&').map(function (param) {
    const pairs = param.split('=');
    params[pairs[0]] = decodeURIComponent(pairs[1]);
  });
  return params;
}

function toDate (str) {
  var arr = (str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2)).split('-');
  return new Date(arr[0], arr[1] - 1, arr[2]);
};


class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.temp_books = {};
    const params = getQueryString()
    this.state = {
      books: null,
      error: false,
      keywords: params.q ? params.q.split('|') : [],
      keywords_length: 0,
      loading: true,
    };
  }

  async _search() {
    let newBooks: Book[] = []
    for (const keyword of this.state.keywords) {
      const books = await this._get(keyword, 'title')
      books.map((book: Book) => {
        const i = ISBN.parse(book.isbn)
        book.id = i.asIsbn10()
        newBooks.push(book)
      })
    }
    newBooks = applySort(newBooks, 'pubdate', true)
    this.setState({ books: newBooks, loading: false, keywords_length: this.state.keywords.length })

    //   fetch(`https://asia-northeast1-hohohoza-172907.cloudfunctions.net/calendar?free=${keyword}`)
  }
  async _get(keyword: string, param: string): Promise<Book[]> {
      const url = `https://unitrad.calil.jp/v1/search?${param}=${encodeURIComponent(keyword)}&region=openbd-future`
      const books: any[] = await fetch(url).then((r) => r.json()).then((data) => data.books).catch((error) => console.log(error))
      const isbns: string[] = []
      for (const book of books) {
        isbns.push(book.isbn)
        const url = `https://api.openbd.jp/v1/get?isbn=${isbns.join(',')}`
        const bs = await fetch(url).then((r) => r.json()).catch((error) => console.log(error))
        bs.map((b:any, index: number) => {
          if (b) {
            const pubdate = b.summary.pubdate
            let tpubdate
            try {
              const date = toDate(pubdate)
              const year = date.getFullYear()
              const monthNumber = 1 + date.getMonth()
              const month = ('0' + monthNumber).slice(-2)
              const dayNumber = date.getDate()
              const day = ('0' + dayNumber).slice(-2)
              tpubdate = `${year}-${month}-${day}`
            } catch {
              tpubdate = pubdate
            }
            books[index].pubdate = tpubdate
            books[index].cover = b.summary.cover
          }
        })
      }
      return books
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
    if (this.state.keywords.length === 0 || (this.state.loading === false && this.state.books && this.state.books.length <= 0)) {
      return null
    }
    return (
      <Books books={this.state.books} keywords={this.state.keywords} reload={this._reload.bind(this)} loading={this.state.loading} />
    );
  }
}

export default App








