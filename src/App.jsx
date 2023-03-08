import { useEffect, useState } from "react";
import "./App.scss";

const buttonsList = [
  { is_legal: true, data: 0 },
  { is_legal: true, data: 1 },
  { is_legal: true, data: 2 },
  { is_legal: true, data: 3 },
  { is_legal: true, data: 4 },
  { is_legal: true, data: 5 },
  { is_legal: true, data: 6 },

  { is_legal: true, data: "W" },

  { is_legal: false, data: "nb" },
  { is_legal: false, data: "wd" },
];

const Button = ({ value, setValue }) => {
  const handelClick = () => setValue(value);

  return (
    <button className="button" onClick={handelClick}>
      {value.data}
    </button>
  );
};

const App = () => {
  const [countExtras, setCountExtras] = useState({
    COUNT_NB_RUNS: false,
    COUNT_WD_RUNS: false,
  });

  const [timeline, setTimeline] = useState([]);

  const handelValue = (e) => {
    setTimeline((prev) => [...prev, e]);
  };

  const [overs, setOvers] = useState([[]]);

  useEffect(() => {
    if (timeline.length === 0) {
      setOvers([[]]);
      return;
    }

    const tempArr = [[]];
    timeline.forEach((e, i) => {
      if (tempArr.at(-1).filter((e) => e.is_legal).length < 6) {
        tempArr.at(-1).push(e);
      } else {
        tempArr.push([e]);
      }
      setOvers(tempArr);
    });
  }, [timeline]);

  const [scoreRuns, setScoreRuns] = useState(0);
  const [scoreExtras, setScoreExtras] = useState({
    NO_BALL_EXTRAS: 0,
    WIDE_BALL_EXTRAS: 0,
  });
  const [scoreWickets, setScoreWickets] = useState(0);
  const [oversNumber, setOversNumber] = useState("");
  useEffect(() => {
    setScoreRuns(
      timeline.reduce((a, b) => {
        return a + (!isNaN(b.data) ? b.data : 0);
      }, 0)
    );
    if (countExtras.COUNT_NB_RUNS) {
      setScoreExtras((prev) => {
        return {
          ...prev,
          NO_BALL_EXTRAS: timeline.filter((e) => e.data === "nb").length,
        };
      });
    }
    if (countExtras.COUNT_WD_RUNS) {
      setScoreExtras((prev) => {
        return {
          ...prev,
          WIDE_BALL_EXTRAS: timeline.filter((e) => e.data === "wd").length,
        };
      });
    }

    let tempW = 0;
    timeline.forEach((e) => {
      if (e.data === "W") tempW++;
    });
    setScoreWickets(tempW);

    if (overs.at(-1).filter((e) => e.is_legal).length === 6) {
      setOversNumber(`${overs.length}.0`);
    } else {
      setOversNumber(
        `${overs.length - 1}.${overs.at(-1).filter((e) => e.is_legal).length}`
      );
    }
  }, [overs, countExtras.COUNT_NB_RUNS, countExtras.COUNT_WD_RUNS]);

  const handelUndo = () => {
    if (timeline.length === 0) return;
    setTimeline((prev) => prev.filter((e, i) => prev.length !== i + 1));
  };

  const handelCountNB = () => {
    setCountExtras((prev) => {
      return {
        ...prev,
        COUNT_NB_RUNS: !prev.COUNT_NB_RUNS,
      };
    });
  };
  const handelCountWD = () => {
    setCountExtras((prev) => {
      return {
        ...prev,
        COUNT_WD_RUNS: !prev.COUNT_WD_RUNS,
      };
    });
  };

  return (
    <div className="app">
      <div className="buttons">
        <button
          className={countExtras.COUNT_NB_RUNS ? "button active" : "button"}
          onClick={handelCountNB}
        >
          Count NO Balls
        </button>
        <button
          className={countExtras.COUNT_WD_RUNS ? "button active" : "button"}
          onClick={handelCountWD}
        >
          Count Wide Balls
        </button>
        {buttonsList.map((e, i) => {
          return (
            <button className="button" key={i} onClick={() => handelValue(e)}>
              {e.data}
            </button>
          );
        })}
        <button className="button" onClick={handelUndo}>
          undo
        </button>
      </div>

      <div className="score">
        <div className="runs-wickets">
          {"Score: "}
          <div className="runs">
            {scoreRuns +
              scoreExtras.NO_BALL_EXTRAS +
              scoreExtras.WIDE_BALL_EXTRAS}
          </div>
          {" / "}
          <div className="wickets">{scoreWickets}</div>
        </div>
        <div className="overs-number">
          {"Overs: "}
          <div className="overs-text">{oversNumber}</div>
        </div>
        {countExtras.COUNT_NB_RUNS || countExtras.COUNT_WD_RUNS ? (
          <div className="extras">
            {"Extras: "}
            {scoreExtras.NO_BALL_EXTRAS + scoreExtras.WIDE_BALL_EXTRAS}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* {timeline.length > 0 ? (
        <div className="timeline">
          {"Timeline:"}
          {timeline.map((e, i) => {
            const newIndex = timeline.length - i - 1;
            return <div key={newIndex}>{timeline[newIndex].data}</div>;
          })}
        </div>
      ) : (
        ""
      )} */}

      {overs[0].length > 0 ? (
        <div className="overs">
          {"Overs List:"}
          {overs.map((e, i) => {
            return (
              <div key={i} className="over">
                {e.map((e, i) => {
                  return (
                    <div key={i} className="ball">
                      {e.data}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
