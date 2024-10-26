import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModelHeader, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
class ModalEditLesson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: 0,
            title: '',
            description: '',
            orderBy: 0,
        }
    }

    componentDidMount() {
    }
    toggle = () => {
        this.props.toggleEditFromParentLesson();
    }
    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState['id'] = this.props.lessonId
        copyState[id] = e.target.value;

        this.setState({
            ...copyState
        })
    }

    handleEditLesson = () => {
        this.props.editLesson(this.state);
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'modal-user-container'}
                size='lg'
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    Edit course
                </ModalHeader>
                <ModalBody>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-9 mt-3">
                                <form>
                                    <div className="form-group mb-4">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" className="form-control" name="title"
                                            onChange={(e) => { this.handleOnChangeInput(e, "title") }}
                                            value={this.state.title}
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label htmlFor="description">Description</label>
                                        <textarea rows="10" className="form-control" name="description"
                                            onChange={(e) => { this.handleOnChangeInput(e, "description") }}
                                            value={this.state.description}></textarea>
                                    </div>

                                    {/* <div className="form-group mb-4">
                                        <label htmlFor="formFile" className="form-label">Upload image</label>
                                        <input className="form-control" type="file" id="formFile" />
                                    </div> */}
                                    <div className="form-group mb-4">
                                        <label htmlFor="formFile" className="form-label">Order</label>
                                        <input className="form-control" type="number" id="formFile"
                                            onChange={(e) => { this.handleOnChangeInput(e, "orderBy") }}
                                            value={this.state.orderBy} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary'
                        onClick={() => { this.handleEditLesson() }} className='px-3'>Update</Button>{' '}
                    <Button color='secondary' onClick={() => { this.toggle() }} className='px-3'>Close</Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditLesson);
