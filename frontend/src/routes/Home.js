import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HeaderAdmin from '../containers/Header/HeaderAdmin';

class Home extends Component {

    render() {
        const { userIsLoggedIn, adminIsLoggedIn } = this.props;
        let linkToRedirect = userIsLoggedIn || adminIsLoggedIn ? '/' : '/login';

        return (
            <Redirect to={linkToRedirect} />
            // <div>
            //     <HeaderAdmin />
            //     Xin chào các bạn đến với CodeCrush
            // </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        userIsLoggedIn: state.user.isLoggedIn,
        adminIsLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
