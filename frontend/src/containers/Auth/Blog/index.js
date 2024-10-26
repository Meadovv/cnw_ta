import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import BlogRight from './BlogRight/blogRight';
import BlogLeft from './BlogLeft/blogLeft';
import BlogCenter from './BlogCenter/blogCenter';
import './style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
class Blog extends Component {

    constructor(props) {
        super(props);

    }



    render() {
        return (
            <>
                <div className="container" style={{ marginTop: "56px" }}>
                    <div className="row g4">
                        <BlogLeft />
                        <BlogCenter />
                        <BlogRight />
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
