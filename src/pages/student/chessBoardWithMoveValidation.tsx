import React from "react";
import PropTypes from "prop-types";
import Chessboard from "chessboardjsx";
import { Button } from 'react-bootstrap';
//import config from '../../config';

const Chess = require("chess.js");

type HumanVsHumanProps = {
  boardHistoryUpdate: Function,
  startingFen: string,
}

type move = {
  color: string,
  flags: string,
  from: string,
  piece: string,
  san: string,
  to: string,
}

type HumanVsHumanState = {
  fen: string,
  dropSquareStyle: any,
  squareStyles: any,
  pieceSquare: string,
  square: string,
  history: Array<move>,
};

class HumanVsHuman extends React.Component<HumanVsHumanProps, HumanVsHumanState> {
  game: any;
  static propTypes = { children: PropTypes.func };
  constructor(props: HumanVsHumanProps) {
    super(props);
    this.state = {
      fen: this.props.startingFen,
      // square styles for active drop square
      dropSquareStyle: {},
      // custom square styles
      squareStyles: {},
      // square with the currently clicked piece
      pieceSquare: "",
      // currently clicked square
      square: "",
      // array of past game moves
      history: [],
    };
  }

  componentDidMount() {
    console.log("chessboard ", this.props, this.state);
    this.game = new Chess(this.props.startingFen);
    this.props.boardHistoryUpdate(this.game.pgn())
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = (square: string) => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
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
            history: this.state.history,
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
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }), this.props.boardHistoryUpdate(this.game.pgn()));
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
    this.setState(({ history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square
    }));

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      pieceSquare: ""
    }, this.props.boardHistoryUpdate(this.game.pgn()));
  };

  onSquareRightClick = (square: string) =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    });

  renderChildrenSeparate = () => {
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
    })
  };

  undoMove = () => {
    this.game.undo();
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    }), this.props.boardHistoryUpdate(this.game.pgn()));
  }

  render() {
    return (
      <>
        {this.renderChildrenSeparate()}
        <br />
        <Button variant="dark" onClick={this.undoMove} block disabled={!this.game || this.game.history({ verbose: true }).length === 0}>
          Undo
        </Button>
      </>
    );
  }
}

type WithMoveValidationProps = {
  width: number,
  boardHistoryUpdate: Function,
  startingFen: string,
}

export default function WithMoveValidation(props: WithMoveValidationProps) {
  return (
    <HumanVsHuman startingFen={props.startingFen} boardHistoryUpdate={props.boardHistoryUpdate}>
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
          <>
            <Chessboard
              key={position} //temporay fix ?
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
          </>
        )}
    </HumanVsHuman>
  );
}

const squareStyling = ({ pieceSquare, history }: any) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};