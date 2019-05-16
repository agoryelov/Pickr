import React from "react";
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import CircularProgress from '@material-ui/core/CircularProgress';
import Firebase from '../firebase'

import './QuestPage.css'

import QuestCard from '../Layout/QuestCard';

class QuestPage extends React.Component {

    firebase = new Firebase();

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            current: 1,
            userCoords: null,
            virtualData: null,
        };

        this.swiper = null;
    }

    updateIndex = () => {
        if (this.swiper != null) {
            console.log(this.swiper.activeIndex);
            this.setState({current: this.swiper.activeIndex});
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        //Getting user location
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('fetching');
            this.setState({userCoords: position.coords});
        });

        this.firebase.auth.onAuthStateChanged(user => {
          if (user) {
            this.firebase.questsAll().once("value", snapshot => {
                this.setState({
                    data: Object.entries(snapshot.val()),
                    loading: false,
                });
            });
          }
        });
    }

    render() {
        if (this.state.loading) {
            return (
              <div style={{marginTop: '40vh', display: 'flex', justifyContent: 'center'}}>
                <CircularProgress />
              </div>
            );
        }

        const coords = this.state.userCoords;
        const data = this.state.data;

        return(
            <div style={{margin: "2em"}}>
                <Swiper spaceBetween={15} loop={true}
                    on={{slideChange: this.updateIndex}} 
                    getSwiper={(swiper) => this.swiper = swiper} >
                    {data.map(card => (
                        <div key={card[0]}>
                            <QuestCard current={this.state.current} coords={coords} questId={card[0]} questData={card[1]} />
                        </div>
                    ))}
                </Swiper>
            </div>
        );
    }
}

export default QuestPage;