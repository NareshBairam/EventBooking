import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }

    isActive = true;
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        this.titleRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    createEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });

        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value;
        const date = this.dateRef.current.value;
        const description = this.descriptionRef.current.value;

        if (title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const requestBody = {
            query: `
                    mutation {
                        createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
                            _id
                            title
                            price
                            date
                            description
                        }
                    }
                `
        }

        const token = this.context.token;

        fetch('http://localhost:3007/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then((res) => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                // this.fetchEvents();
                this.setState(prevState => {
                    let updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        price: resData.data.createEvent.price,
                        date: resData.data.createEvent.date,
                        description: resData.data.createEvent.description,
                        creater: {
                            _id: this.context.userId
                        }
                    });
                    return { events: updatedEvents }
                })
                console.log("CreateEvent Response data: ", resData);
            })
            .catch((err) => {
                console.log("CreateEvent Response error: ", err);
            });
    }

    modalCancelHandler = () => {
        this.setState({
            creating: false,
            selectedEvent: null
        });
    }

    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }
        const requestBody = {
            query: `
                    mutation {
                        bookEvent(eventId: "${this.state.selectedEvent._id}") {
                            _id
                            createdAt
                            updatedAt
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
                this.setState({ selectedEvent: null });
                console.log("Book Event Response data: ", resData);
            })
            .catch((err) => {
                this.setState({ selectedEvent: null });
                console.log("Book Event Response error: ", err);
            });

    }

    fetchEvents() {

        this.setState({ isLoading: true });

        const requestBody = {
            query: `
                    query {
                        events {
                            _id
                            title
                            price
                            date
                            description
                            creater{
                                _id
                                email
                            }
                        }
                    }
                `
        }

        fetch('http://localhost:3007/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
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
                    this.setState({ events: resData.data.events, isLoading: false });
                }
                console.log("Events List Response data: ", resData);
            })
            .catch((err) => {
                if (this.isActive) {
                    this.setState({ isLoading: false });
                }
                console.log("Events List Response error: ", err);
            });
    }

    viewDetailsHandler = (eventId) => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(event => event._id === eventId);
            return { selectedEvent: selectedEvent };
        })
    }

    componentDidMount() {
        this.fetchEvents();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) &&
                    <Backdrop></Backdrop>}
                {this.state.creating &&
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        confirmText="Confirm"
                        onCancelClick={this.modalCancelHandler}
                        onConfirmClick={this.modalConfirmHandler} >

                        <form className="">
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateRef} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea rows={4} id="description" ref={this.descriptionRef} />
                            </div>
                        </form>
                    </Modal>
                }
                {
                    this.context.token &&
                    <div className="event-control">
                        <p>Share your own Event</p>
                        <button className="btn" onClick={this.createEventHandler}>Creat Event</button>
                    </div>
                }
                {this.state.isLoading ?
                    <Spinner /> :
                    <EventList
                        events={this.state.events}
                        authUserId={this.context.userId}
                        onViewDetailsClicked={this.viewDetailsHandler}>
                    </EventList>
                }
                {this.state.selectedEvent &&
                    <Modal
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm
                        confirmText={this.context.token ? "Book Event" : "Confirm"}
                        onCancelClick={this.modalCancelHandler}
                        onConfirmClick={this.bookEventHandler} >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                }

            </React.Fragment>
        );
    }
}

export default EventsPage;