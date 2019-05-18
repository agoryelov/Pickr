import React from "react";
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Firebase from '../firebase'

import '../CSS/QuestPage.css'

import QuestCard from '../Layout/QuestCard/QuestCard';
import * as ROUTES from '../../constants/routes';

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
            globaUser: null,
            questList: null,
        };

        this.swiper = null;
    }

    updateIndex = () => {
        if (this.swiper != null) {
            this.setState({current: this.swiper.activeIndex});
        }
    }

    componentDidMount() {
        this.setState({ loading: true });

        //Getting user location
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({userCoords: position.coords});
        });

        this.firebase.auth.onAuthStateChanged(user => {
          if (user) {
              this.globalUser = user.uid;
              console.log("user: " + this.globalUser);
            this.firebase.questsAll().once("value", snapshot => {
                this.setState({
                    questList: snapshot.val(),
                    data: Object.entries(snapshot.val()),
                    loading: false,
                });
            });
          } else {
              this.props.history.push(ROUTES.SIGN_IN);
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
            <Grid container justify="center" style={{}}>
                <Grid item xs={12} sm={8} md={6}>
                    <Swiper spaceBetween={15} loop={true}
                        on={{slideChange: this.updateIndex}} 
                        getSwiper={(swiper) => this.swiper = swiper} >
                        {data.map(card => (
                            <div key={card[0]}>
                                <QuestCard current={this.state.current} coords={coords} questId={card[0]} questData={card[1]} globalUser={this.globalUser}/>
                            </div>
                        ))}
                    </Swiper>
                </Grid>
            </Grid>
        );
    }
}

export default QuestPage;