import React from "react";
import { Card } from "antd";

interface ResultProps {
  survey: {
    title: string;
    questions: {
      text: string;
      options: {
        text: string;
      }[];
    }[];
  };
  answers: { [key: number]: number | null };
}

const Result: React.FC<ResultProps> = ({ survey, answers }) => {
  const results = survey.questions.map((question, index) => {
    const selectedOptionIndex = answers[index];
    const selectedOption =
      selectedOptionIndex !== null
        ? question.options[selectedOptionIndex]
        : null;
    return (
      <li key={index}>
        <strong>{question.text}</strong>
        <br />
        {selectedOption !== null && <>Selected: {selectedOption?.text}</>}
        {selectedOption == null && ""}
      </li>
    );
  });

  return (
    <Card title="Results">
      <ul>{results}</ul>
    </Card>
  );
};

export default Result;
