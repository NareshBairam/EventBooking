import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingControl from '../components/Bookings/BookingControl/BookingControl';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component {

    state = {
        bookings: [],
        isLoading: false,
        outputType: 'list'
    }

    isActive = true;

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    fetchBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                    query {
                        bookings {
                            _id
                            createdAt
                            updatedAt
                            event {
                                _id
                                title
                                price
                            }
                        }
                    }
                `
        }

        fetch('http://localhost:3007/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if (this.isActive) {
                    this.setState({
                        bookings: resData.data.bookings,
                        isLoading: false
                    });
                }
                console.log("Bookings Response data: ", resData);
            })
            .catch((err) => {
                if (this.isActive) {
                    this.setState({ isLoading: false });
                }
                console.log("Bookings Response error: ", err);
            });
    }

    onDeleteHandler = (bookingId) => {
        const requestBody = {
            query: `
                    mutation CancelBooking($id: ID!){
                        cancelBooking(bookingId: $id) {
                            _id
                            title
                        }
                    }
                `,
            variables: {
                id: bookingId
            }
        }

        fetch('http://localhost:3007/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {

                this.setState(prevState => {
                    let updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
                    return { bookings: updatedBookings }
                });

                console.log("Bookings Canceled Response data: ", resData);
            })
            .catch((err) => {
                console.log("Bookings Canceled Response error: ", err);
            });
    }

    changeOutputTypeHandler = (outputType) => {
        if (outputType === 'list') {
            this.setState({ outputType: 'list' });
        } else {
            this.setState({ outputType: 'chart' });
        }
    }

    render() {
        return (
            <React.Fragment>
                <BookingControl
                    outputType={this.state.outputType}
                    onChange={this.changeOutputTypeHandler}
                />
                <div>
                    {
                        this.state.isLoading ?
                            <Spinner /> :
                            (
                                this.state.outputType === 'list' ?
                                    <BookingList bookings={this.state.bookings} onDeleteClicked={this.onDeleteHandler} /> :
                                    <BookingChart bookings={this.state.bookings} />
                            )
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default BookingsPage;