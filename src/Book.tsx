// @flow
import React, { Component } from 'react';

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
  return (
    <div>
      {(() => {
        if (props.book.month) {
          return (
            <Month {...props.book} />
          );
        }
      })()}
        <div className="book">
          <div className="dateContainer">
            <p className="pubdate">{props.day}</p>
            {(() => {
              if (props.book.day) {
                return (
                  <div className="weekDay">
                    <p className="weekDayText">{props.weekDay}</p>
                  </div>
                );
              }
            })()}
          </div>
          <div className={'textContainer ' + (props.book.month === null ? 'border' : '')}>
            <div className="text">
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
              <p className="title">{props.book.title}</p>
              <p className="author">{props.book.author}</p>
            </div>
            {(() => {
              if (props.book.isbn) {
                return (
                  <div className="imageContainer">
                    <img className="image" src={`https://cover.openbd.jp/${props.book.isbn}.jpg`} />
                  </div>
                );
              }
            })()}
          </div>
        </div>
    </div>
  );
};


class Month extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div className="monthContainer">
        <div className="monthBG">
          <span className="month">{this.props.month}</span><span className="tsuki">月</span>
        </div>
      </div>
    );
  }
}
