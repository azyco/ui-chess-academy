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

type filterStudent = {
    student_id: number,
    class_id: number | null,
    classroom_id: number | null,
}

type AssignmentsStudentProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function
}

type AssignmentsStudentState = {
    classroom_array: Array<classroom>,
    selected_classroom_array_index: number,
    selected_class_array_index: number,
    selected_class_array: Array<classroom_class> | null,
    selected_question_array: Array<question> | null,
    selected_question_array_index: number,
    fen_modal: string,
    history: Array<move>,
    pgn: string,
}

export class AssignmentsStudent extends React.Component<AssignmentsStudentProps, AssignmentsStudentState>{
    game: any;

    dummy_class: Array<any> = [{
        id: -1,
        classroom_id: -1,
        start_time: -1,
        duration: -1,
        created_at: -1,
        class_hash: 'All Classes',
    }];

    dummy_classroom: Array<any> = [{
        id: -1,
        name: 'All Classrooms',
        description: -1,
        student_count: -1
    }];

    constructor(props: AssignmentsStudentProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_array_index: -1,
            selected_class_array_index: -1,
            selected_class_array: [],
            selected_question_array: [],
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
            this.setState({ classroom_array: Array.from(response.data.classroom_array) }, this.getQuestionSolutionArrayAndResetForm);
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

    getClassAndQuestionSolutionArray = (classroom_array_index: number = this.state.selected_classroom_array_index) => {
        const classroom_id = (classroom_array_index !== -1) ? this.state.classroom_array[classroom_array_index].id : null;
        if (classroom_id) {
            Api.get('/class?classroom_id=' + classroom_id).then((response) => {
                console.log("got class array ", response);
                this.setState({
                    selected_class_array: response.data,
                    selected_classroom_array_index: classroom_array_index,
                    selected_class_array_index: -1,
                    selected_question_array_index: -1,
                }, this.getQuestionSolutionArrayAndResetForm);
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
        else {
            this.setState({
                selected_class_array: [],
                selected_classroom_array_index: -1,
                selected_class_array_index: -1,
                selected_question_array_index: -1,
            }, this.getQuestionSolutionArrayAndResetForm);
        }
    }

    getQuestionSolutionArrayAndResetForm = (class_array_index: number = this.state.selected_class_array_index) => {
        const classroom_id = (this.state.selected_classroom_array_index !== -1) ? this.state.classroom_array[this.state.selected_classroom_array_index].id : null;
        const class_id = (this.state.selected_class_array && class_array_index !== -1) ? this.state.selected_class_array[class_array_index].id : null;
        const filters: filterStudent = {
            classroom_id,
            class_id,
            student_id: this.props.user_authentication.id,
        }
        Api.get(`/solution?${(filters.classroom_id) ? `&classroom_id=${filters.classroom_id}` : ``}${(filters.class_id) ? `&class_id=${filters.class_id}` : ``}`).then((response) => {
            console.log("got question array ", response);
            const question_response = response;
            this.setState({
                selected_question_array: question_response.data,
                selected_class_array_index: class_array_index,
                selected_question_array_index: -1,
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
                <Button variant="dark" disabled={index === this.state.selected_question_array_index} onClick={() => { this.setState({ selected_question_array_index: index }) }} >
                    Answer
                </Button>
            </td>
        </tr>
    );

    classroomOptionGenerator = (classroom_row: classroom, index: number) => (
        <option value={index - 1} key={classroom_row.id}>
            {classroom_row.name}
        </option>
    )

    classOptionGenerator = (classroom_class_row: classroom_class, index: number) => (
        <option value={index - 1} key={classroom_class_row.id}>
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
                            <th>Deadline</th>
                            <th>Score</th>
                            <th>Comments</th>
                            <th>Answered On</th>
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
                            <Form.Control custom as="select" onChange={(ev: any) => { this.getClassAndQuestionSolutionArray(Number(ev.target.value)) }} >
                                {(this.dummy_classroom.concat(this.state.classroom_array)).map(this.classroomOptionGenerator)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group sm={6} as={Col}>
                            <Form.Control value={this.state.selected_class_array_index} custom as="select" onChange={(ev: any) => { this.getQuestionSolutionArrayAndResetForm(Number(ev.target.value)) }} disabled={this.state.selected_classroom_array_index === -1}>
                                {(this.dummy_class.concat(this.state.selected_class_array)).map(this.classOptionGenerator)}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Form>
                {table_element}
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
        if (this.state.selected_question_array && this.state.selected_question_array_index !== -1) {
            Api.post('/solution', {
                solution_details: {
                    student_id: this.props.user_authentication.id,
                    question_id: this.state.selected_question_array[this.state.selected_question_array_index].question_id,
                    pgn: this.state.pgn,
                    class_id: this.state.selected_question_array[this.state.selected_question_array_index].class_id,
                }
            }).then((response) => {
                console.log(response);
                this.props.onAlert({ alert_type: "success", alert_text: "Answer Recorded" });
                this.setState({ selected_question_array_index: -1 });
                this.getQuestionSolutionArrayAndResetForm();
            }).catch((error) => {
                console.log(error);
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            });
        }
    }

    renderAnswerForm() {
        if (this.state.selected_question_array && this.state.selected_question_array_index !== -1) {
            const startingFen = this.state.selected_question_array[this.state.selected_question_array_index].fen_question;
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
                                    <Button variant="dark" block onClick={() => { this.setState({ selected_question_array_index: -1 }) }}>
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
            <>
                {this.renderModal()}
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Questions</Card.Header>
                    {this.renderQuestionsTable()}
                    {this.renderAnswerForm()}
                </Card>
            </>
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