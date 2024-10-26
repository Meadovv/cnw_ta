import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Information from './information';
import PostSubmission from '../Post/Submission/postSubmission';
import ListPost from '../Post/ListPost/listPost';
class Profile extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="profile-page-container" style={{ marginTop: "56px" }}>
                <div className="container">
                    <Information userID={this.props.match.params.id} />
                    <PostSubmission />
                    <ListPost userID={this.props.match.params.id} />
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
