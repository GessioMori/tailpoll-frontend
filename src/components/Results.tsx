import { FunctionComponent } from "react";
import { PollButtons } from "./PollButtons";

type ResultsComponentProps = {
  options: string[];
  votes: {
    _count: number;
    option: number;
  }[];
  userVote?: number;
  isOwner: boolean;
  isEnded: boolean;
  handleResultRefetch: () => Promise<any>;
  handlePollRefetch: () => Promise<any>;
};

export const ResultsComponent: FunctionComponent<ResultsComponentProps> = ({
  options,
  votes,
  userVote,
  isOwner,
  handleResultRefetch,
  handlePollRefetch,
  isEnded,
}) => {
  const totalVotes = votes.reduce((acc, cur) => acc + cur._count, 0);

  const optionsWithVotes = options.map((option, index) => ({
    value: option,
    votes: votes.find((vote) => vote.option === index)?._count ?? 0,
  }));

  return (
    <>
      <div className="flex flex-col gap-2">
        {optionsWithVotes.map((option, index) => {
          const percentage =
            totalVotes === 0 ? 0 : (option.votes * 100) / totalVotes;
          if (userVote === index) {
            return (
              <div
                key={option.value}
                className="relative w-full border-2 p-4 rounded-md text-left overflow-hidden border-sky-300 dark:border-sky-800"
              >
                <div className="relative z-10 ">
                  <div className="flex justify-between whitespace-nowrap">
                    <div>{option.value}</div>
                    <div>
                      {option.votes === 1
                        ? `${option.votes} vote`
                        : `${option.votes} votes`}
                      &nbsp; &#x2022; &nbsp;
                      {percentage.toFixed(1) + "%"}
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute z-0 top-0 left-0 h-full bg-sky-300 dark:bg-sky-800`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            );
          } else {
            return (
              <div
                key={option.value}
                className="relative w-full border-2 p-4 rounded-md text-left overflow-hidden border-zinc-300 dark:border-zinc-600"
              >
                <div className="relative z-10 ">
                  <div className="flex justify-between whitespace-nowrap">
                    <div>{option.value}</div>
                    <div>
                      {option.votes === 1
                        ? `${option.votes} vote`
                        : `${option.votes} votes`}
                      &nbsp; &#x2022; &nbsp;
                      {percentage.toFixed(1) + "%"}
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute z-0 top-0 left-0 h-full bg-sky-300 dark:bg-sky-800`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            );
          }
        })}
      </div>
      <PollButtons
        isOwner={isOwner}
        handleResultRefetch={handleResultRefetch}
        handlePollRefetch={handlePollRefetch}
        isEnded={isEnded}
      />
    </>
  );
};
