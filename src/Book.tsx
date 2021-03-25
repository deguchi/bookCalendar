
import React from 'react'
import {Component} from 'react';

interface Props {
}

interface State {
}

type Props = {
books: Array<Book>,
keywords: Keywords,
reload: Func,
loading: boolean
}

class Books extends Component {
    props: Props
    constructor(props) {
        super(props);
    }
    render() {
        let month = 0;
        let prevDay = 0;
        let prevMonth = 0;
        let books = [];
        this.props.books.map((book, i) => {
        book.index = i;
        book.last = this.props.books.length;
        if (book.pubdate) {
            book.pubdate = String(normalizePubdate(book.pubdate));
            book.pubdate.match(/(\d{4})(\d{2})(\d{2})/g);
            book.year = RegExp.$1;
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
        console.log(books)
        return (
        <View style={[styles.container, ContainerStyle]}>
            <FlatList
            data={books}
            renderItem={({ item }) => <CalendarBook book={item} day={item.day} weekDay={item.weekDay} />}
            keyExtractor={item => item.id}
            style={styles.flatlist}
            ListHeaderComponent={() => (<TouchableHighlight
                underlayColor={theme.color.yellow}
                onPress={() => Actions.keyword()}
                style={{
                justifyContent: 'center', // 子の配置 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
                alignItems: 'center', // 'stretch', 'flex-start', 'flex-end', 'center'
                marginTop: 16,
                }}
            >
                <Text style={{
                fontSize: 16,
                color: theme.color.yellow
                }}>{this.props.keywords.length}個のキーワード</Text>
            </TouchableHighlight>)}
            />
        </View>
        );
    }
}

