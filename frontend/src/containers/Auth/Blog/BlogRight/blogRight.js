import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers } from '../../../../services/userService';
import Scrollbars from "react-custom-scrollbars";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
class BlogRight extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [{
                fullName: '',
                img_url: '',
                gender: ''
            }],
            limit: 10,
        };

        this.handleViewMoreClick = this.handleViewMoreClick.bind(this);
    }
    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        try {
            const response = await getAllUsers('ALL');
            console.log(response);
            if (response && response.errCode === 0) {
                this.setState({ users: response.users });
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleViewMoreClick() {
        this.setState(prevState => ({ limit: prevState.limit + 10 }));
    }

    render() {
        const { users, limit } = this.state;

        const visibleUsers = users.slice(0, limit);

        return (
            <div className="col-lg-3">
                <div className="col-sm-6 col-lg-12">
                    <Scrollbars style={{ height: "92vh" }}>
                        <div className="cardx">
                            <div className="card-header pb-0 border-0 mt-3 suggestion">
                                <h5 className="card-title mb-0" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Suggestion</h5>
                            </div>
                            <div className="card-body mt-3">
                                {visibleUsers && visibleUsers.map((user, index) => {
                                    return (
                                        <Link to={`/profile/${user.id}`} onClick={() => window.scrollTo(0, 0)}>
                                            <div className="hstack gap-2 mb-3 row d-flex" key={index}>
                                                <div className="avatar col-2">
                                                    <a href="#!"><img className="avatar-img rounded-circle" src={user.img_url} alt="avatar" width={50} height={50} /></a>
                                                </div>
                                                <div className="overflow-hidden col-7">
                                                    <a className="h6 mb-0" href="#!" style={{ textDecoration: "none" }}>{user.fullName} </a>
                                                    <p className="mb-0 small text-truncate" style={{ color: "black" }}>{user.gender ? "Nam" : "Nữ"}</p>
                                                </div>
                                                <div className='col-2 text-primary' style={{ cursor: "pointer" }}>
                                                    <i className="bi bi-plus-circle"></i>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                                {limit < users.length && (
                                    <div className="d-grid mt-3">
                                        <button className="btn btn-sm btn-primary-soft view-more" onClick={this.handleViewMoreClick}>View more</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Scrollbars>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(BlogRight);
