import React from 'react';
import Measure from 'react-measure';
import Chessboard from "chessboardjsx";
import WithMoveValidation from './chessBoardWithMoveValidation';
import {
    Container,
    Card,
    Table, Button, Collapse,
    Modal,
    Col, Row,
    Form,
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
    coaches: string
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
    question_id: number,
    solution_id: number,
    student_id: number,
    class_id: number,
    description: string,
    fen_question: string,
    question_deadline: Date,
    question_created_at: Date,
    pgn: string,
    score: number,
    comments: string,
    is_evaluated: boolean,
    solution_updated_at: Date,
}

type move = {
    color: string,
    flags: string,
    from: string,
    piece: string,
    san: string,
    to: string,
}

type AssignmentsStudentProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function
}

type AssignmentsStudentState = {
    classroom_array: Array<classroom>,
    selected_classroom_id: number,
    selected_classroom_class_id: number,
    selected_classroom_class_array: Array<classroom_class> | null,
    selected_classroom_class_question_array: Array<question> | null,
    selected_question_id: number,
    selected_question_array_index: number,
    fen_modal: string,
    history: Array<move>,
    pgn: string,
}

export class AssignmentsStudent extends React.Component<AssignmentsStudentProps, AssignmentsStudentState>{
    game: any;
    constructor(props: AssignmentsStudentProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_id: -1,
            selected_classroom_class_id: -1,
            selected_classroom_class_array: null,
            selected_classroom_class_question_array: null,
            selected_question_id: -1,
            selected_question_array_index: -1,
            fen_modal: '',
            history: [],
            pgn: ''
        }
    }

    componentDidMount() {
        this.getClassroomArray();
        this.game = new Chess();
        this.game.clear();
    }

    getClassroomArray() {
        Api.get('/classroom?student_id=' + this.props.user_authentication.id).then((response) => {
            console.log("classroom array updated ", response);
            this.setState({ classroom_array: Array.from(response.data.classroom_array) }, () => {
                console.log("state after classroom update ", this.state);
            });
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

    getClassArray(classroom_id: number = this.state.selected_classroom_id) {
        Api.get('/class?classroom_id=' + classroom_id).then((response) => {
            console.log("got class array ", response);
            this.setState({
                selected_classroom_class_array: response.data,
                selected_classroom_id: classroom_id,
                selected_classroom_class_id: -1,
                selected_question_id: -1,
                selected_question_array_index: -1,
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

    getQuestionSolutionArrayAndResetForm(class_id: number = this.state.selected_classroom_class_id) {
        Api.get('/solution?class_id=' + class_id + "&student_id=" + this.props.user_authentication.id).then((response) => {
            console.log("got question array ", response);
            const question_response = response;
            this.setState({
                selected_classroom_class_question_array: question_response.data,
                selected_classroom_class_id: class_id,
                selected_question_array_index: -1,
                selected_question_id: -1,
                history: [],
                pgn: '',
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

    classroomRowGenerator = (classrom_row: classroom) => (
        <tr key={classrom_row.id} >
            <td>{classrom_row.id}</td>
            <td>{classrom_row.name}</td>
            <td>{classrom_row.description}</td>
            <td>{classrom_row.coaches}</td>
            <td>
                <Button variant="dark" onClick={() => { this.getClassArray(classrom_row.id) }} disabled={this.state.selected_classroom_id === classrom_row.id}>
                    Select
                </Button>
            </td>
        </tr>
    );

    renderClassroomTable() {
        console.log("rendering classroom table");
        if (this.state.classroom_array && this.state.classroom_array.length > 0) {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.classroomsCardHeader}</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Table striped bordered hover responsive="lg" >
                                <thead>
                                    <tr>
                                        <th>{config.tableHeaderID}</th>
                                        <th>{config.tableHeaderName}</th>
                                        <th>{config.tableHeaderDescription}</th>
                                        <th>{config.tableHeaderCoaches}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.classroom_array.map(this.classroomRowGenerator)}
                                </tbody>
                            </Table>
                        </Container>
                    </Card.Body>
                </Card>
            );
        }
        else {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.classroomsCardHeader}</Card.Header>
                    <Card.Body>
                        <Container>
                            {config.noClassroomCoach}
                        </Container>
                    </Card.Body>
                </Card>
            );
        }

    }

    classRowGenerator = (class_row: classroom_class) => (
        <tr key={class_row.id} >
            <td><a href={'/class/' + class_row.class_hash}>{class_row.id}</a></td>
            <td>{new Date(class_row.start_time).toLocaleString()}</td>
            <td>{class_row.duration}</td>
            <td>
                <Button variant="dark" onClick={() => { this.getQuestionSolutionArrayAndResetForm(class_row.id) }} disabled={this.state.selected_classroom_class_id === class_row.id}>
                    Select
                </Button>
            </td>
        </tr>
    );

    renderClassTable() {
        const collapse_condition = this.state.selected_classroom_id === -1;
        const no_class_condition = (this.state.selected_classroom_class_array && this.state.selected_classroom_class_array.length > 0);
        const table_element = (!no_class_condition) ?
            (

                <Card.Body>
                    <Container>
                        No Classes Scheduled
                    </Container>
                </Card.Body>
            ) :
            (

                <Card.Body>
                    <Table striped bordered hover responsive="lg" >
                        <thead>
                            <tr>
                                <th>Class ID/Link</th>
                                <th>Start Time</th>
                                <th>Duration</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.selected_classroom_class_array?.map(this.classRowGenerator)}
                        </tbody>
                    </Table>
                </Card.Body>
            );
        console.log("rendering class table");
        return (
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as='h5'>Class</Card.Header>
                <Card.Body>
                    <Collapse in={!collapse_condition} >
                        {table_element}
                    </Collapse>
                    <Collapse in={collapse_condition}>
                        <Container>
                            Select a classroom
                    </Container>
                    </Collapse>
                </Card.Body>
            </Card>
        );
    }

    questionsRowGenerator = (question_row: question, index: number) => (
        <tr key={index}>
            <td>{question_row.question_id}</td>
            <td>{question_row.description}</td>
            <td>
                <Button variant="dark" disabled={index === this.state.selected_question_array_index} onClick={() => { this.setState({ fen_modal: question_row.fen_question }) }} >
                    View
                </Button>
            </td>
            <td>{new Date(question_row.question_deadline).toLocaleString()}</td>
            <td>{(question_row.solution_updated_at) ? (question_row.is_evaluated) ? question_row.score : "Not Evaluated" : "Not Answered"}</td>
            <td>{(question_row.solution_updated_at) ? (question_row.is_evaluated) ? question_row.comments : "Not Evaluated" : "Not Answered"}</td>
            <td>{(question_row.solution_updated_at) ? new Date(question_row.solution_updated_at).toLocaleString() : "Not Answered"}</td>
            <td>
                <Button variant="dark" disabled={index === this.state.selected_question_array_index} onClick={() => { this.setState({ selected_question_id: question_row.question_id, selected_question_array_index: index }) }} >
                    Answer
                </Button>
            </td>
        </tr>
    );

    renderQuestionsTable() {
        const collapse_condition = this.state.selected_classroom_class_id === -1;
        const no_class_condition = (this.state.selected_classroom_class_question_array && this.state.selected_classroom_class_question_array?.length > 0);
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
                            <th>Deadline</th>
                            <th>Score</th>
                            <th>Comments</th>
                            <th>Answered On</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.selected_classroom_class_question_array?.map(this.questionsRowGenerator)}
                    </tbody>
                </Table>
            );
        console.log("rendering question table");
        return (
            <Card.Body>
                <Collapse in={!collapse_condition} >
                    {table_element}
                </Collapse>
                <Collapse in={collapse_condition}>
                    <Container>
                        Select a class
                    </Container>
                </Collapse>
            </Card.Body>
        );
    }

    boardHistoryUpdateCallback = (pgn: string) => {
        console.log("got pgn from chessboard ", pgn)
        this.setState({
            pgn
        }, () => {
            console.log("pgn updated ", this.state.pgn)
        })
    }

    submitAnswer = () => {
        Api.post('/solution', {
            solution_details: {
                student_id: this.props.user_authentication.id,
                question_id: this.state.selected_question_id,
                pgn: this.state.pgn,
                class_id: this.state.selected_classroom_class_id,
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "Answer Recorded" });
            this.setState({ selected_question_array_index: -1, selected_question_id: -1 });
            this.getQuestionSolutionArrayAndResetForm();
        }).catch((error) => {
            console.log(error);
            this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
        });
    }

    renderAnswerForm() {
        if (this.state.selected_classroom_class_question_array && this.state.selected_question_array_index !== -1) {
            const startingFen = this.state.selected_classroom_class_question_array[this.state.selected_question_array_index].fen_question;
            if (startingFen) {
                return (
                    <Card.Body>
                        <Container>
                            <Row>
                                <Col sm={6}>
                                    <ResizableChessBoardWithMoveValidation
                                        boardHistoryUpdate={this.boardHistoryUpdateCallback}
                                        startingFen={startingFen}
                                    />
                                </Col>
                                <Form.Group sm={6} as={Col}>
                                    <Form>
                                        <Form.Control as="textarea" htmlSize={5} readOnly value={this.state.pgn} />
                                    </Form>
                                    <Button variant="dark" block disabled={!this.state.history} onClick={this.submitAnswer}>
                                        Submit
                                    </Button>
                                    <Button variant="dark" block onClick={() => { this.setState({ selected_question_array_index: -1, selected_question_id: -1 }) }}>
                                        Cancel
                                    </Button>
                                </Form.Group>
                            </Row>
                        </Container>
                    </Card.Body>
                );
            }
            else {
                return React.Fragment
            }
        }
    }

    renderModal() {
        return (
            <Modal show={(this.state.fen_modal) ? true : false} >
                <Modal.Body>
                    <ResizableChessBoard fen={this.state.fen_modal} />
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
                {this.renderClassroomTable()}
                {this.renderClassTable()}
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Questions</Card.Header>
                    {this.renderQuestionsTable()}
                    {this.renderAnswerForm()}
                </Card>
            </div>
        )
    }
}

type ResizableChessBoardProps = {
    fen: string,
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
                        <Chessboard id="question_view" position={this.props.fen} width={width} draggable={false} />
                    </div>
                )}
            </Measure>
        )
    }
}

type ResizableChessBoardWithMoveValidationProps = {
    boardHistoryUpdate: Function,
    startingFen: string,
}

type ResizableChessBoardWithMoveValidationState = {
    dimensions: any
}

class ResizableChessBoardWithMoveValidation extends React.Component<ResizableChessBoardWithMoveValidationProps, ResizableChessBoardWithMoveValidationState> {
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
                        <WithMoveValidation startingFen={this.props.startingFen} width={width} boardHistoryUpdate={this.props.boardHistoryUpdate} />
                    </div>
                )}
            </Measure>
        )
    }
}