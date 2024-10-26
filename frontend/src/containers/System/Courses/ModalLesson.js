import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModelHeader, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
class ModalLesson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courseID: 0,
            title: '',
            description: '',
            orderBy: 0,
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                title: '',
                description: '',
                img_url: '',
            })
        })
    }

    componentDidMount() {
    }
    toggle = () => {
        this.props.toggleFromParentLesson();
    }
    handleOnChangeInput = (e, id) => {
        let copyState = { ...this.state };
        copyState['courseID'] = this.props.courseId
        copyState[id] = e.target.value;

        this.setState({
            ...copyState
        })
    }
    checkValiInput = () => {
        let isValid = true;
        let arrInput = ['title', 'description', 'orderBy']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    handleAddNewLesson = () => {
        let isValid = this.checkValiInput();
        if (isValid === true) {
            this.props.createNewLesson(this.state);
        }
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
                    Create a new Lesson
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
                        onClick={() => { this.handleAddNewLesson() }} className='px-3'>Add new</Button>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalLesson);
