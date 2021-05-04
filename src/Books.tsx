
import React from 'react'
import {Component} from 'react';

import { normalizePubdate } from './util/sort'

import CalendarBook from './Book'


interface Props {
    books: Book[]
    reload: () => void
    loading: boolean
}

interface State {
}


interface Book {
    id: number
    title: string
    isbn: string
    pubdate: string
    year: number | null
    month: number | null
    day: number | null
    weekDay: string
    index: number
    last: number
}

class Books extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        let month = 0;
        let prevDay = 0;
        const books: Book[] = [];
        this.props.books.map((book, i) => {
        book.index = i;
        book.last = this.props.books.length;
        if (book.pubdate) {
            book.pubdate = String(normalizePubdate(book.pubdate));
            book.pubdate.match(/(\d{4})(\d{2})(\d{2})/g);
            book.year = Number(RegExp.$1)
            book.month = RegExp.$2 === '00' ? 1 : Number(RegExp.$2);
            book.day = RegExp.$3 === '00' ? 1 : Number(RegExp.$3);
            const pubdate = [
            RegExp.$1,
            book.month === 1 ? '01' : RegExp.$2,
            book.day === 1 ? '01' : RegExp.$3
            ].join('-');
            if (month !== book.month) {
            month = book.month;
            } else {
            book.month = null;
            }
            const dateObj = new Date(pubdate);
            const weekDayList = ['日', '月', '火', '水', '木', '金', '土'];
            book.weekDay = weekDayList[dateObj.getDay()];	// 曜日

            // 同じ日付なら
            if (prevDay === book.day) {
            book.day = null;
            } else {
            prevDay = book.day;
            }
        }
        books.push(book);
        });
        // console.log(books)
        if (!this.props.books) return null
        return (<React.Fragment>
            {this.props.books.map((book: Book) => {
                return <CalendarBook key={book.id} book={book} day={book.day} weekDay={book.weekDay} />
            })}
        </React.Fragment>);
    }
}

export default Books