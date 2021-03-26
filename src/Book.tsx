// @flow
import React, { Component } from 'react';


const buildQueryString = (params) => {
	let parts = [];
	let add = (key, value) => {
		parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	}
	for (let key in params) {
   		let param = params[key];
   		if (Array.isArray(param)) {
            param.map((value) => {
   				add(key, value);
   			});
   		}
   		else {
   			add(key, param);
   		}
	}
	return parts.join('&').replace(/%20/g, '+');
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

type Props = {
  book: Book,
  day: number | null,
  weekDay: string,
}

export default (props:Props) => {
  const OneDayPerMilliseconds = 24 * 60 * 60 * 1000;
  const orderMail = (book) => {
    window.open('https://deguchi.github.io/mailOrder/?' + buildQueryString(book))
  }
  return (
    <div>
      {(() => {
        if (props.book.month) {
          return (
            <div className="month">
                <span className="number">{props.book.month}</span><span className="tsuki">月</span>
            </div>
        );
        }
      })()}
        <div className={'book ' + (props.book.month === null ? 'border' : '')}>
          <div className="date">
            <p className="day">{props.day}</p>
            {(() => {
              if (props.book.day) {
                return (
                  <div className="weekDay">
                    {props.weekDay}
                  </div>
                );
              }
            })()}
          </div>
        <div className="bib">
            {(() => {
            if (!props.book.pubdate) return null;
            const d = new Date();
            const month = ('0'+(d.getMonth()+1)).slice(-2);
            const day = ('0'+d.getDate()).slice(-2);
            const today = new Date(d.getFullYear()+'-'+month+'-'+day).getTime();
            props.book.pubdate.match(/(\d{4})(\d{2})(\d{2})/g);
            const pubdate = [
                RegExp.$1,
                RegExp.$2==='00' ? '01' : RegExp.$2,
                RegExp.$3==='00' ? '01' : RegExp.$3
            ].join('-');
            const pubtime = new Date(pubdate).getTime();
            if (pubtime < (today - OneDayPerMilliseconds)) {
                return <p className="nowOnSale">発売中</p>;
            } else if (pubtime === today) {
                return <p className="todayOnSale">今日発売！</p>;
            } else if (pubtime < (today + OneDayPerMilliseconds * 7)) {
                return <p className="nearOnSale">もうすぐ発売!</p>;
            }
            })()}
            <p className="title">
                <a href={`https://calil.jp/book/${props.book.isbn}`} target="_blank">
                {props.book.title}
                </a>
            </p>
            <p className="author">
                <a href={`https://calil.jp/book/${props.book.isbn}`} target="_blank">
                {props.book.author}
                </a>
            </p>

            <button onClick={() => orderMail(props.book)}>書店にメールで注文</button>
        </div>
        {(() => {
            if (props.book.isbn) {
            return (
                <a href={`https://calil.jp/book/${props.book.isbn}`} target="_blank">
                    <img src={`https://cover.openbd.jp/${props.book.isbn}.jpg`} />
                </a>
            );
            }
        })()}
        </div>
    </div>
  );
};


