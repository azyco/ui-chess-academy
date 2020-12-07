import React from 'react';
import Measure from 'react-measure'
import Chessboard from "chessboardjsx";

import {
    Container, Col, Row,
    Card,
    Table, Button, Form,
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

type filterCoach = {
    class_id: number | null,
    classroom_id: number | null,
    student_id: number | null,
    question_id: number | null,
}

type solution = {
    solution_id: number,
    question_id: number,
    class_id: number,
    description: string,
    fen_question: string,
    question_deadline: Date
    question_created_at: Date,
    student_id: number,
    pgn: string,
    score: string,
    comments: string,
    is_evaluated: boolean,
    solution_updated_at: Date,
}

type student = {
    fullname: string,
    student_id: number,
}

type move = {
    color: string,
    flags: string,
    from: string,
    piece: string,
    san: string,
    to: string,
}

type AssignmentsCheckCoachProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function,
}

type AssignmentsCheckCoachState = {
    classroom_array: Array<classroom>,
    selected_classroom_array_index: number,
    selected_class_array_index: number,
    selected_classroom_class_array: Array<classroom_class> | null,
    question_array: Array<question> | null,
    selected_question_array_index: number,
    selected_classroom_student_array: Array<student>,
    selected_student_array_index: number,
    modal_fen: string,
    solution_array: Array<solution> | null,
    selected_solution_array_index: number,
    evaluation_fen: string,
    evaluation_score: number,
    evaluation_score_is_invalid: boolean,
    evaluation_comments: string,
    undo_move_list: Array<move>
}

export class AssignmentsCheckCoach extends React.Component<AssignmentsCheckCoachProps, AssignmentsCheckCoachState>{
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

    dummy_question: Array<any> = [{
        id: -1,
        class_id: -1,
        description: 'All Questions',
        fen_question: -1,
        deadline: -1,
        created_at: -1,
    }];

    dummy_student: Array<any> = [{
        student_id: -1,
        fullname: 'All Students',
    }]

    constructor(props: AssignmentsCheckCoachProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_array_index: -1,
            selected_class_array_index: -1,
            selected_classroom_class_array: [],
            question_array: [],
            selected_question_array_index: -1,
            selected_classroom_student_array: [],
            selected_student_array_index: -1,
            modal_fen: '',
            solution_array: [],
            selected_solution_array_index: -1,
            evaluation_fen: '',
            evaluation_score: -1,
            evaluation_score_is_invalid: true,
            evaluation_comments: '',
            undo_move_list: [],
        }
    }

    componentDidMount() {
        this.getClassroomArray();
        this.game = new Chess();
        this.game.clear();
        this.getStudentAndClassAndQuestionArrayAndSetClassroomFilter(-1);
        this.getSolutionArray();
    }

    getClassroomArray() {
        Api.get('/classroom?coach_id=' + this.props.user_authentication.id).then((response) => {
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

    getStudentAndClassAndQuestionArrayAndSetClassroomFilter(classroom_array_index: number) {
        const classroom_id = (classroom_array_index !== -1) ? this.state.classroom_array[classroom_array_index].id : null;
        if (classroom_array_index === -1) {
            Api.get('/student').then((student_response) => {
                console.log("got student array ", student_response);
                Api.get(`/question`).then((question_response) => {
                    console.log("got question array ", question_response);
                    this.setState({
                        selected_classroom_class_array: [],
                        selected_classroom_array_index: -1,
                        selected_classroom_student_array: student_response.data.student_array,
                        question_array: question_response.data,
                        selected_class_array_index: -1,
                        selected_question_array_index: -1,
                        selected_student_array_index: -1,
                    }, this.getSolutionArray);
                }).catch((error) => {
                    console.log(error);
                    if (error.response.status === 403) {
                        this.props.unauthorizedLogout();
                    }
                    else {
                        this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                    }
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
        else {
            Api.get('/class?classroom_id=' + classroom_id).then((class_response) => {
                console.log("got class array ", class_response);
                Api.get('/student?classroom_id=' + classroom_id).then((student_response) => {
                    console.log("got student array ", student_response);
                    Api.get(`/question?classroom_id=${classroom_id}`).then((question_response) => {
                        console.log("got question array ", question_response);
                        this.setState({
                            selected_classroom_class_array: class_response.data,
                            selected_classroom_array_index: classroom_array_index,
                            selected_classroom_student_array: student_response.data.student_array,
                            question_array: question_response.data,
                            selected_class_array_index: -1,
                            selected_question_array_index: -1,
                            selected_student_array_index: -1,
                        }, this.getSolutionArray);
                    }).catch((error) => {
                        console.log(error);
                        if (error.response.status === 403) {
                            this.props.unauthorizedLogout();
                        }
                        else {
                            this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                        }
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

    getQuestionArrayAndSetClassFilter(class_array_index: number) {
        const classroom_id = (this.state.selected_classroom_array_index !== -1) ? this.state.classroom_array[this.state.selected_classroom_array_index].id : null;
        const class_id = (this.state.selected_classroom_class_array && class_array_index !== -1) ? this.state.selected_classroom_class_array[class_array_index].id : null;

        Api.get(`/question?${(class_array_index === -1) ? `` : `&class_id=${class_id}`}${(this.state.selected_classroom_array_index === -1) ? `` : `&classroom_id=${classroom_id}`}`).then((response) => {
            console.log("got question array ", response);
            this.setState({
                question_array: response.data,
                selected_class_array_index: class_array_index,
                selected_question_array_index: -1,
            }, this.getSolutionArray);
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

    solutionURLConstructor(filters: filterCoach) {
        return `/solution?${(filters.classroom_id) ? `&classroom_id=${filters.classroom_id}` : ``}${(filters.class_id) ? `&class_id=${filters.class_id}` : ``}${(filters.student_id) ? `&student_id=${filters.student_id}` : ``}${(filters.question_id) ? `&question_id=${filters.question_id}` : ``}`
    }

    getSolutionArray = () => {
        const classroom_id = (this.state.selected_classroom_array_index !== -1) ? this.state.classroom_array[this.state.selected_classroom_array_index].id : null;
        const class_id = (this.state.selected_classroom_class_array && this.state.selected_class_array_index !== -1) ? this.state.selected_classroom_class_array[this.state.selected_class_array_index].id : null;
        const student_id = (this.state.selected_classroom_student_array && this.state.selected_student_array_index !== -1) ? this.state.selected_classroom_student_array[this.state.selected_student_array_index].student_id : null;
        const question_id = (this.state.question_array && this.state.selected_question_array_index !== -1) ? this.state.question_array[this.state.selected_question_array_index].id : null;
        const filters: filterCoach = {
            classroom_id,
            class_id,
            student_id,
            question_id,
        }
        Api.get(this.solutionURLConstructor(filters)).then((response) => {
            console.log("got solution array ", response);
            this.setState({
                solution_array: response.data,
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

    evaluateSolution(solution_update_details: any) {
        Api.put(`/solution`, { solution_update_details }).then((response) => {
            console.log("solution updated", response);
            this.setState({
                selected_solution_array_index: -1,
                evaluation_score: -1,
                evaluation_comments: '',
            }, this.getSolutionArray)
            this.props.onAlert({ alert_type: "success", alert_text: "Evaluation Submitted" });
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

    solutionsRowGenerator = (solution_row: solution, index: number) => (
        <tr key={solution_row.solution_id} >
            <td>{solution_row.question_id}</td>
            <td>{solution_row.description}</td>
            <td>
                <Button variant="dark" onClick={() => { this.setState({ modal_fen: solution_row.fen_question }) }} >
                    View
                </Button>
            </td>
            <td>{solution_row.student_id}</td>
            <td>
                <Form.Control as="textarea" readOnly value={solution_row.pgn} size="sm" />
            </td>
            <td>{(solution_row.is_evaluated) ? solution_row.score : 'Not Evaluated'}</td>
            <td>{(solution_row.is_evaluated) ? solution_row.comments : 'Not Evaluated'}</td>
            <td>{new Date(solution_row.solution_updated_at).toLocaleDateString()}</td>
            <td>{(solution_row.is_evaluated) ? 'Yes' : 'No'}</td>
            <td>
                <Button variant="dark" onClick={() => { this.game.load_pgn(solution_row.pgn); this.setState({ selected_solution_array_index: index, evaluation_fen: this.game.fen(), }) }} >
                    Evaluate
                </Button>
            </td>
        </tr >
    );

    studentOptionGenerator = (student_row: student, index: number) => (
        <option value={index - 1} key={student_row.student_id}>
            {student_row.fullname} ({student_row.student_id})
        </option>
    )

    questionOptionGenerator = (question_row: question, index: number) => (
        <option value={index - 1} key={question_row.id}>
            {question_row.description}
        </option>
    )

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
        return (
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as='h5'>Questions</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Row>
                            <Form.Group sm={3} as={Col}>
                                <Form.Control custom as="select" onChange={(ev: any) => { this.getStudentAndClassAndQuestionArrayAndSetClassroomFilter(Number(ev.target.value)) }} >
                                    {(this.dummy_classroom.concat(this.state.classroom_array)).map(this.classroomOptionGenerator)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group sm={3} as={Col}>
                                <Form.Control value={this.state.selected_class_array_index} custom as="select" onChange={(ev: any) => { this.getQuestionArrayAndSetClassFilter(Number(ev.target.value)) }} disabled={this.state.selected_classroom_array_index === -1}>
                                    {(this.dummy_class.concat(this.state.selected_classroom_class_array)).map(this.classOptionGenerator)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group sm={3} as={Col}>
                                <Form.Control value={this.state.selected_question_array_index} custom as="select" onChange={(ev: any) => { this.setState({ selected_question_array_index: Number(ev.target.value) }, this.getSolutionArray) }} >
                                    {(this.dummy_question.concat(this.state.question_array)).map(this.questionOptionGenerator)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group sm={3} as={Col}>
                                <Form.Control value={this.state.selected_student_array_index} custom as="select" onChange={(ev: any) => { this.setState({ selected_student_array_index: Number(ev.target.value) }, this.getSolutionArray) }} >
                                    {(this.dummy_student.concat(this.state.selected_classroom_student_array)).map(this.studentOptionGenerator)}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <Row>
                        <Col>
                            <Table striped bordered hover responsive >
                                <thead>
                                    <tr>
                                        <th>Question ID</th>
                                        <th>Question</th>
                                        <th>Board</th>
                                        <th>Student ID</th>
                                        <th>PGN</th>
                                        <th>Score</th>
                                        <th>Comments</th>
                                        <th>Updated At</th>
                                        <th>Evaluated</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.solution_array?.map(this.solutionsRowGenerator)}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }

    renderQuestionModal() {
        return (
            <Modal show={(this.state.modal_fen) ? true : false} >
                <Modal.Body>
                    <ResizableChessBoard fen={this.state.modal_fen} id={"modal_view"} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => { this.setState({ modal_fen: '' }) }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    undoMove = () => {
        this.setState({
            undo_move_list: this.state.undo_move_list.concat([this.game.undo()]),
            evaluation_fen: this.game.fen(),
        })
    }

    redoMove = () => {
        const undo_move_list: Array<move> = this.state.undo_move_list;
        const redo_move: move | undefined = undo_move_list.pop();
        this.game.move(redo_move);
        this.setState({
            undo_move_list,
            evaluation_fen: this.game.fen(),
        })
    }

    renderEvaluationModal() {
        if (this.state.selected_solution_array_index !== -1 && this.state.solution_array) {
            console.log("rendering eval modal");
            const solution_update_details = {
                question_id: this.state.solution_array[this.state.selected_solution_array_index].question_id,
                student_id: this.state.solution_array[this.state.selected_solution_array_index].student_id,
                score: this.state.evaluation_score,
                comments: this.state.evaluation_comments
            }

            return (
                <Modal show={(this.state.selected_solution_array_index !== -1) ? true : false} >
                    <Modal.Body>
                        <ResizableChessBoard fen={this.state.evaluation_fen} id={"evaluation_view"} />
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Button variant="dark" block onClick={this.undoMove} disabled={this.state.solution_array[this.state.selected_solution_array_index].fen_question === this.state.evaluation_fen}>
                                        Prev
                                    </Button>
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Button variant="dark" block onClick={this.redoMove} disabled={this.state.undo_move_list.length === 0}>
                                        Next
                                    </Button>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Score</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Control value={this.state.evaluation_score} type="number" custom onChange={(ev: any) => {
                                        this.setState({
                                            evaluation_score: ev.target.value,
                                            evaluation_score_is_invalid: isNaN(Number(ev.target.value)) || Number(ev.target.value) > config.assignmentScoreMax || Number(ev.target.value) < config.assignmentScoreMin,
                                        })
                                    }} isInvalid={this.state.evaluation_score_is_invalid} />
                                    <Form.Control.Feedback type="invalid" >
                                        Score must between {config.assignmentScoreMin} - {config.assignmentScoreMax}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Comments</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Control value={this.state.evaluation_comments} as="textarea" custom onChange={(ev: any) => {
                                        this.setState({ evaluation_comments: ev.target.value })
                                    }} />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={() => { this.setState({ selected_solution_array_index: -1 }) }}>
                            Close
                        </Button>
                        <Button variant="dark" onClick={() => { this.evaluateSolution(solution_update_details) }} disabled={this.state.evaluation_score_is_invalid}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
    }

    render() {
        return (
            <>
                {this.renderQuestionModal()}
                {this.renderEvaluationModal()}
                {this.renderQuestionsTable()}
            </>
        )
    }
}

type ResizableChessBoardProps = {
    fen: string,
    id: string,
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
                        <Chessboard
                            position={this.props.fen}
                            width={width}
                            draggable={false}
                            id={this.props.id}
                        />
                    </div>
                )}
            </Measure>
        )
    }
}