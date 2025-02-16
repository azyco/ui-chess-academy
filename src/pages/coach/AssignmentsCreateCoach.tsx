import React from 'react';
import Measure from 'react-measure'
import Chessboard from "chessboardjsx";

import {
    Container, Col, Row,
    Card,
    Table, Button, Collapse, Form,
    Modal
} from 'react-bootstrap';

import config from '../../config';
import Api from '../../api/backend';

const Chess = require("chess.js");

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type classroom = {
    id: number,
    name: string,
    description: string,
    student_count: number
}

type classroom_class = {
    id: number,
    classroom_id: number,
    start_time: number,
    duration: number,
    created_at: number,
    class_hash: string
}

type question = {
    id: number,
    class_id: number,
    description: string,
    fen_question: string,
    deadline: Date,
    created_at: Date,
}

type AssignmentsCreateCoachProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function,
}

type AssignmentsCreateCoachState = {
    classroom_array: Array<classroom>,
    selected_classroom_array_index: number,
    selected_class_array_index: number,
    selected_class_array: Array<classroom_class> | null,
    selected_question_array: Array<question> | null,
    fen_modal: string,
    show_question_form: boolean,
    deadline_input: string,
    deadline: Date,
    deadline_is_invalid: boolean,
    description_input: string,
    description_is_invalid: boolean,
    fen: string,
    fen_is_invalid: boolean,
}

export class AssignmentsCreateCoach extends React.Component<AssignmentsCreateCoachProps, AssignmentsCreateCoachState>{
    game: any;
    constructor(props: AssignmentsCreateCoachProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_array_index: -1,
            selected_class_array_index: -1,
            selected_class_array: null,
            selected_question_array: null,
            fen_modal: '',
            show_question_form: false,
            deadline_input: '',
            deadline: new Date(),
            deadline_is_invalid: true,
            description_input: '',
            description_is_invalid: true,
            fen: '',
            fen_is_invalid: true,
        }
    }

    componentDidMount() {
        this.getClassroomArray();
        this.game = new Chess();
        this.game.clear();
    }

    getClassroomArray() {
        Api.get('/classroom?coach_id=' + this.props.user_authentication.id).then((response) => {
            console.log("classroom array updated ", response);
            this.setState({
                classroom_array: Array.from(response.data.classroom_array),
                selected_classroom_array_index: (Array.from(response.data.classroom_array).length > 0) ? 0 : -1,
            }, this.getClassArrayAndResetForm)
        }).catch((error) => {
            console.log("failed to update classroom array ", error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    getClassArrayAndResetForm = (classroom_array_index: number = this.state.selected_classroom_array_index) => {
        if (this.state.classroom_array.length > 0) {
            const classroom_id: number = this.state.classroom_array[classroom_array_index].id;
            Api.get('/class?classroom_id=' + classroom_id).then((response) => {
                console.log("got class array ", response);
                this.setState({
                    selected_class_array: response.data,
                    selected_classroom_array_index: classroom_array_index,
                    selected_class_array_index: (response.data.length > 0) ? 0 : -1,
                    selected_question_array: [],
                    show_question_form: false,
                    deadline_input: '',
                    deadline: new Date(),
                    deadline_is_invalid: true,
                    description_input: '',
                    description_is_invalid: true,
                    fen: '',
                    fen_is_invalid: true,
                }, this.getQuestionArrayAndResetForm)
            }).catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    this.props.unauthorizedLogout();
                }
                else {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                }
            });
        }
    }

    getQuestionArrayAndResetForm = (class_array_index: number = this.state.selected_class_array_index) => {
        if (this.state.selected_class_array && this.state.selected_class_array.length > 0 && class_array_index !== -1) {
            const class_id: number = this.state.selected_class_array[class_array_index].id;
            Api.get('/question?class_id=' + class_id).then((response) => {
                console.log("got question array ", response);
                this.setState({
                    selected_question_array: response.data,
                    selected_class_array_index: class_array_index,
                    show_question_form: false,
                    deadline_input: '',
                    deadline: new Date(),
                    deadline_is_invalid: true,
                    description_input: '',
                    description_is_invalid: true,
                    fen: '',
                    fen_is_invalid: true,
                });
            }).catch((error) => {
                console.log(error);
                if (error.response.status === 403) {
                    this.props.unauthorizedLogout();
                }
                else {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                }
            });
        }
    }

    onPositionChange = (position: any) => {
        let game2 = new Chess();
        game2.clear();
        let valid_board = true;
        Object.keys(position).forEach((key) => {
            if (valid_board && position[key]) {
                valid_board = game2.put({ type: position[key][1], color: position[key][0] }, key)
            }
        });
        if (valid_board) {
            this.setState({ fen: game2.fen(), fen_is_invalid: !game2.validate_fen(game2.fen()) }, () => { console.log("fen: ", this.state.fen, this.state.fen_is_invalid) });
            this.game = game2;
        }
    }

    deleteQuestion(class_id: number, question_id: number) {
        Api.delete('/question?question_id=' + question_id + '&class_id=' + class_id).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "question deleted successfully" });
            this.getQuestionArrayAndResetForm(this.state.selected_class_array_index);
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    questionsRowGenerator = (question_row: question) => (
        <tr key={question_row.id}>
            <td>{question_row.id}</td>
            <td>{question_row.description}</td>
            <td>
                <Button variant="dark" onClick={() => { this.setState({ fen_modal: question_row.fen_question }) }} >
                    View
                </Button>
            </td>
            <td>{new Date(question_row.created_at).toLocaleString()}</td>
            <td>{new Date(question_row.deadline).toLocaleString()}</td>
            <td>
                <Button variant="dark" onClick={() => { this.deleteQuestion(this.state.selected_class_array_index, question_row.id) }} >
                    Delete
                </Button>
            </td>
        </tr>
    );

    classroomOptionGenerator = (classroom_row: classroom, index: number) => (
        <option value={index} key={classroom_row.id}>
            {classroom_row.name}
        </option>
    )

    classOptionGenerator = (classroom_class_row: classroom_class, index: number) => (
        <option value={index} key={classroom_class_row.id}>
            {classroom_class_row.class_hash}
        </option>
    )

    renderQuestionsTable() {
        const no_class_condition = (this.state.selected_question_array && this.state.selected_question_array?.length > 0);
        const table_element = (!no_class_condition) ?
            (
                <Container>
                    No Questions
                </Container>
            ) :
            (
                <Table striped bordered hover responsive="lg" >
                    <thead>
                        <tr>
                            <th>Question ID</th>
                            <th>Question</th>
                            <th>Board</th>
                            <th>Created At</th>
                            <th>Deadline</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.selected_question_array?.map(this.questionsRowGenerator)}
                    </tbody>
                </Table>
            );
        console.log("rendering question table");
        return (
            <Card.Body>
                <Form>
                    <Form.Row>
                        <Form.Group sm={6} as={Col}>
                            <Form.Control custom as="select" onChange={(ev: any) => { this.getClassArrayAndResetForm(Number(ev.target.value)) }} >
                                {this.state.classroom_array.map(this.classroomOptionGenerator)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group sm={6} as={Col}>
                            <Form.Control value={this.state.selected_class_array_index} custom as="select" onChange={(ev: any) => { this.getQuestionArrayAndResetForm(Number(ev.target.value)) }} disabled={this.state.selected_classroom_array_index === -1}>
                                {this.state.selected_class_array?.map(this.classOptionGenerator)}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Form>
                {table_element}
            </Card.Body>
        );
    }

    resetQuestionForm = () => {
        this.setState({
            deadline_input: '',
            deadline: new Date(),
            deadline_is_invalid: true,
            description_input: '',
            description_is_invalid: true,
            fen: '',
            fen_is_invalid: true,
            show_question_form: false,
        });
    }

    onDeadlineChange = (ev: any) => {
        const today: Date = new Date();
        const date_obj: Date = new Date(ev.target.value);
        const validity: boolean = !isNaN(date_obj.getDate()) && (date_obj >= today);
        this.setState({
            deadline_input: ev.target.value,
            deadline: date_obj,
            deadline_is_invalid: !validity,
        });
    }

    onDescriptionhange = (ev: any) => {
        this.setState({
            description_input: ev.target.value, description_is_invalid: !(ev.target.value),
        });
    }

    addQuestion() {
        const deadline = this.state.deadline.valueOf();
        Api.post('/question', {
            question_details: {
                fen_question: this.state.fen,
                description: this.state.description_input,
                class_id: this.state.selected_class_array_index,
                deadline,
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "Question added Successfully" });
            this.getQuestionArrayAndResetForm();
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    renderQuestionForm() {
        if (this.state.selected_class_array_index !== -1) {
            return (
                <div>
                    <Card.Body>
                        <Collapse in={!this.state.show_question_form}>
                            <Container>
                                <Button variant='dark' onClick={() => { this.setState({ show_question_form: true }) }} block>
                                    {config.addButtonText}
                                </Button>
                            </Container>
                        </Collapse>
                        <Collapse in={this.state.show_question_form}>
                            <Container>
                                <Row>
                                    <Col lg={8} className="align-items-center">
                                        <Form>
                                            <Form.Row>
                                                <Form.Group as={Col} sm={6}>
                                                    <Form.Control isInvalid={this.state.deadline_is_invalid} value={this.state.deadline_input} onChange={this.onDeadlineChange} placeholder="Deadline" />
                                                    <Form.Control.Feedback type="invalid" >
                                                        Deadline (MM/DD/YYYY, HH:MM:SS) must be valid
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group as={Col} sm={6}>
                                                    <Form.Control readOnly value={this.state.deadline.toLocaleString()} />
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Group as={Col}>
                                                    <Form.Control as="textarea" isInvalid={this.state.description_is_invalid} value={this.state.description_input} onChange={this.onDescriptionhange} placeholder="Description" />
                                                    <Form.Control.Feedback type="invalid" >
                                                        Description must be present
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form.Row>
                                            <Form.Row>
                                                <Button variant="dark" onClick={() => { this.setState({ fen: '' }) }} block>
                                                    Reset
                                                </Button>
                                            </Form.Row>
                                        </Form>
                                    </Col>
                                    <Col lg={4}>
                                        <ResizableChessBoard draggable={true} sparePieces={true} onPositionChange={this.onPositionChange} fen={this.state.fen} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button variant="dark" disabled={this.state.deadline_is_invalid || this.state.description_is_invalid || this.state.fen_is_invalid} onClick={() => { this.addQuestion() }} block>
                                            Done
                                        </Button>
                                        <Button variant="dark" onClick={this.resetQuestionForm} block>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Collapse>
                    </Card.Body>
                </div >
            );
        }
        else {
            return React.Fragment;
        }
    }

    renderModal() {
        return (
            <Modal show={(this.state.fen_modal) ? true : false} >
                <Modal.Body>
                    <ResizableChessBoard fen={this.state.fen_modal} draggable={false} sparePieces={false} onPositionChange={() => { }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => { this.setState({ fen_modal: '' }) }}>
                        Close
                </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                {this.renderModal()}
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Create Questions</Card.Header>
                    {this.renderQuestionsTable()}
                    {this.renderQuestionForm()}
                </Card>
            </div>
        )
    }
}

type ResizableChessBoardProps = {
    onPositionChange: any,
    fen: string,
    sparePieces: boolean,
    draggable: boolean,
}

type ResizableChessBoardState = {
    dimensions: any
}

class ResizableChessBoard extends React.Component<ResizableChessBoardProps, ResizableChessBoardState> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    }

    render() {
        const { width, height } = this.state.dimensions
        return (
            <Measure
                bounds
                onResize={contentRect => {
                    this.setState({ dimensions: contentRect.bounds }, () => { console.log("width,height ", width, height) })
                }}
            >
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Chessboard position={this.props.fen} width={width} draggable={this.props.draggable} sparePieces={this.props.sparePieces} dropOffBoard='trash' getPosition={this.props.onPositionChange} />
                    </div>
                )}
            </Measure>
        )
    }
}