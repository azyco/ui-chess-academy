import React from "react";
import PropTypes from "prop-types";
import Chessboard from "chessboardjsx";
import config from '../config';

import { io } from 'socket.io-client';

const Chess = require("chess.js");

type HumanVsHumanProps = {
  class_hash: string,
  updateChatHistoryStateCallback: Function,
  setChatHistoryStateCallback: Function,
  chat_message: chatMessage | null,
  messageObjectResetCallback: Function,
}

type HumanVsHumanState = {
  game?: any,
  fen: string,
  dropSquareStyle: any,
  squareStyles: any,
  pieceSquare: string,
  square: string,
  board_history?: Array<string>,
  chat_history: Array<string>,
  chat_pending: boolean,
};

type chatMessage = {
  id: number,
  fullname: string,
  user_id: number,
  sent_at: Date,
  message: string
}

class HumanVsHuman extends React.Component<HumanVsHumanProps, HumanVsHumanState> {
  static propTypes = { children: PropTypes.func };
  game: any;
  ws: any | null;

  constructor(props: HumanVsHumanProps) {
    super(props);
    this.state = {
      fen: "start",
      // square styles for active drop square
      dropSquareStyle: {},
      // custom square styles
      squareStyles: {},
      // square with the currently clicked piece
      pieceSquare: "",
      // currently clicked square
      square: "",
      // array of past game moves
      board_history: [],
      chat_history: [],
      chat_pending: false,
    };

    this.ws = io(config.webSocketApi);

    this.ws.on('board_init', (data: { board_history: Array<string>, class_hash: string }) => {
      if (this.props.class_hash === data.class_hash) {
        console.log('board init received', data);
        console.log('current state', this.state);
        if (data.board_history.length > 0) {
          this.setState({ board_history: data.board_history, fen: data.board_history[data.board_history.length - 1] }, () => { console.log('state after board init', this.state); this.game = new Chess(data.board_history[data.board_history.length - 1]) });
        }
      }
    });

    this.ws.on('board', (data: { fen: string, class_hash: string }) => {
      if (this.props.class_hash === data.class_hash) {
        console.log('board update received', data);
        console.log('current state', this.state);
        let board_history = this.state.board_history;
        board_history?.push(data.fen);
        this.setState({ board_history, fen: data.fen }, () => { console.log('state after board update', this.state); this.game = new Chess(data.fen); });
      }
    });

    this.ws.on('chat_init', (data: { chat_history: Array<chatMessage>, class_hash: string }) => {
      if (this.props.class_hash === data.class_hash) {
        console.log('chat init received', data);
        console.log('current state', this.state);
        if (data.chat_history.length > 0) {
          this.props.setChatHistoryStateCallback(data.chat_history);
        }
      }
    });

    this.ws.on('chat', (data: { chat: chatMessage, class_hash: string }) => {
      if (this.props.class_hash === data.class_hash) {
        console.log('chat update received', data);
        console.log('current state', this.state);
        this.props.updateChatHistoryStateCallback(data.chat);
      }
    });

  }

  componentDidMount() {
    this.game = new Chess();
    this.ws.emit('enter', `${this.props.class_hash}`);
  }

  componentWillUnmount() {
    try {
      this.ws !== null && this.ws.disconnect();
    } catch (e) {
      console.log('no socket created - hence cannot disconnect')
    }
  }

  componentDidUpdate() {
    if (this.props.chat_message && !this.state.chat_pending) {
      this.setState({
        chat_pending: true
      })
      this.ws.emit('chat', `${JSON.stringify({ chat: this.props.chat_message, class_hash: this.props.class_hash })}`, () => { this.props.messageObjectResetCallback(); this.setState({ chat_pending: false }) });
      //callbacks not working
      this.props.messageObjectResetCallback();
      this.setState({ chat_pending: false })
    }
  }

  handleWSBoardCallback = () => {
    console.log("chesspiece moved,state ", this.state)
    this.ws.emit('board', `${JSON.stringify({ fen: this.state.fen, class_hash: this.props.class_hash })}`);
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = (square: string) => {
    this.setState(({ pieceSquare, board_history }) => ({
      squareStyles: squareStyling({ pieceSquare, board_history })
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare: any, squaresToHighlight: any) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            board_history: this.state.board_history,
            pieceSquare: this.state.pieceSquare
          })
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }));
  };

  onDrop = ({ sourceSquare, targetSquare }: any) => {
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    let board_history = this.state.board_history;
    board_history?.push(this.game.fen())

    this.setState(({ board_history, pieceSquare }) => ({
      board_history,
      fen: this.game.fen(),
      squareStyles: squareStyling({ pieceSquare, board_history })
    }), this.handleWSBoardCallback);
  };

  onMouseOverSquare = (square: string) => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = (square: string) => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = (square: string) => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  onSquareClick = (square: string) => {
    this.setState(({ board_history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, board_history }),
      pieceSquare: square
    }));

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    let board_history = this.state.board_history;
    board_history?.push(this.game.fen())

    this.setState(({ board_history, pieceSquare }) => ({
      board_history,
      fen: this.game.fen(),
      squareStyles: squareStyling({ pieceSquare, board_history })
    }), this.handleWSBoardCallback);
  };

  onSquareRightClick = (square: string) =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    });

  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state;
    // @ts-ignore
    return this.props.children({
      squareStyles,
      position: fen,
      onMouseOverSquare: this.onMouseOverSquare,
      onMouseOutSquare: this.onMouseOutSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onDragOverSquare: this.onDragOverSquare,
      onSquareClick: this.onSquareClick,
      onSquareRightClick: this.onSquareRightClick
    });
  }
}

type WithMoveValidationProps = {
  class_hash: string,
  width: number,
  updateChatHistoryStateCallback: Function,
  setChatHistoryStateCallback: Function,
  chat_message: chatMessage | null,
  messageObjectResetCallback: Function,
}

export default function WithMoveValidation(props: WithMoveValidationProps) {
  return (
    <HumanVsHuman messageObjectResetCallback={props.messageObjectResetCallback} chat_message={props.chat_message} class_hash={props.class_hash} updateChatHistoryStateCallback={props.updateChatHistoryStateCallback} setChatHistoryStateCallback={props.setChatHistoryStateCallback}>
      {({
        position,
        onDrop,
        onMouseOverSquare,
        onMouseOutSquare,
        squareStyles,
        dropSquareStyle,
        onDragOverSquare,
        onSquareClick,
        onSquareRightClick
      }: any) => (
          <Chessboard
            id="humanVsHuman"
            width={props.width}
            position={position}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
          />
        )}
    </HumanVsHuman>
  );
}

const squareStyling = ({ pieceSquare, board_history }: any) => {
  const sourceSquare = board_history.length && board_history[board_history.length - 1].from;
  const targetSquare = board_history.length && board_history[board_history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(board_history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(board_history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};
