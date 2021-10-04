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
  keywords: any
  loading: boolean
}

interface Book {
  id: number
  title: string
  isbn: string
  volume: string
}


function getQueryString() {
  const params = {}
  location.search.substr(1).split('&').map(function (param) {
    const pairs = param.split('=');
    params[pairs[0]] = decodeURIComponent(pairs[1]);
  });
  return params;
}

function toDate (str: any) {
  return new Date(str.substr(0, 4), str.substr(4, 2) - 1, str.substr(6, 2));
}


class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.temp_books = {};
    const params: any = getQueryString()
    this.state = {
      books: null,
      error: false,
      keywords: {
        title: params.title ? params.title.split('|') : [],
        author: params.author ? params.author.split('|') : [],
        publisher: params.publisher ? params.publisher.split('|') : [],
      },
      loading: true,
    };
    this._search()
  }
  async _search() {
    let newBooks: Book[] = []
    for (const param of ['title', 'author', 'publisher']) {
      for (const keyword of this.state.keywords[param]) {
        console.log(keyword)
        const books = await this._get(keyword, param)
        books.map((book: Book) => {
          const i = ISBN.parse(book.isbn)
          book.id = i.asIsbn10()
          newBooks.push(book)
        })
      }
    }
    newBooks = applySort(newBooks, 'pubdate', true)
    this.setState({ books: newBooks, loading: false })

    //   fetch(`https://asia-northeast1-hohohoza-172907.cloudfunctions.net/calendar?free=${keyword}`)
  }
  async _get(keyword: string, param: string): Promise<Book[]> {
      console.log(param)
      const url = `https://unitrad.calil.jp/v1/search?${param}=${encodeURIComponent(keyword)}&region=openbd-future`
      const books: any[] = await fetch(url).then((r) => r.json()).then((data) => data.books).catch((error) => console.log(error))
      const isbns: string[] = []
      for (const book of books) {
        isbns.push(book.isbn)
        const url = `https://api.openbd.jp/v1/get?isbn=${isbns.join(',')}`
        const bs = await fetch(url).then((r) => r.json()).catch((error) => console.log(error))
        bs.map((b:any, index: number) => {
          if (b) {
            let volume = b.summary.volume
            try {
                // console.log(n.onix.DescriptiveDetail.TitleDetail.TitleElement.PartNumber)
                if (volume === '') {
                    volume = b.onix.DescriptiveDetail.TitleDetail.TitleElement.PartNumber.split(';')[0]
                    if (b.summary.title.match(volume)) volume = ''
                }
            } catch (e) {
              console.log(e)
            }
            if (books[index].title.match(volume)) volume = ''
            books[index].title = [books[index].title, volume].join(' ')

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
    return (
      <React.Fragment>
        <p>{this.state.keywords.title.length+this.state.keywords.author.length+this.state.keywords.publisher.length}個のキーワード</p>
        {(this.state.loading) ? (
          <p>読み込み中...</p>
        ) : (
          <Books books={this.state.books} reload={this._reload.bind(this)} loading={this.state.loading} />
        )}
      </React.Fragment>
    );
  }
}

export default App








