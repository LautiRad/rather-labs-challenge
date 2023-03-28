import React, { useState, useEffect } from "react";
import sampleSurvey from "./survey-sample.json";
import { Button, Card } from "antd";
import Image from "next/image";
import Finish from "../../public/Assets/finish.jpeg";
import Result from "../Result";
import styles from "@/styles/Home.module.css";

const { Meta } = Card;

const Trivia = () => {
  const [survey, setSurvey] = useState(sampleSurvey);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState(
    Array(survey.questions.length).fill(null)
  );
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});

  useEffect(() => {
    if (
      survey.questions[currentQuestionIndex] &&
      survey.questions[currentQuestionIndex].lifetimeSeconds
    ) {
      const timeoutId = setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionIndex(null);
      }, survey.questions[currentQuestionIndex].lifetimeSeconds * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentQuestionIndex, survey.questions]);

  const handleStartTrivia = () => {
    setCurrentQuestionIndex(0);
  };

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = [...prevSelectedOptions];
      newSelectedOptions[currentQuestionIndex] = optionIndex;
      return newSelectedOptions;
    });
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: optionIndex,
    }));
    setTimeout(() => setCurrentQuestionIndex(currentQuestionIndex + 1), 500);
  };

  return (
    <div>
      {currentQuestionIndex === -1 ? (
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <Image
              alt={survey.title}
              src={survey.image}
              width="240"
              height="200"
            />
          }
        >
          <Meta
            title={survey.title}
            description={
              <Button type="primary" onClick={handleStartTrivia}>
                Start Trivia
              </Button>
            }
          />
        </Card>
      ) : currentQuestionIndex < survey.questions.length ? (
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            survey.questions[currentQuestionIndex].image && (
              <Image
                alt={survey.questions[currentQuestionIndex].text}
                src={survey.questions[currentQuestionIndex].image}
                width="240"
                height="200"
              />
            )
          }
        >
          <Meta
            title={survey.questions[currentQuestionIndex].text}
            description={
              <ul>
                {survey.questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <li key={index}>
                      <label>
                        <input
                          type="radio"
                          name="options"
                          checked={selectedOptionIndex === index}
                          onChange={() => handleOptionClick(index)}
                        />
                        {option.text}
                      </label>
                    </li>
                  )
                )}
              </ul>
            }
          />
        </Card>
      ) : (
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<Image alt="Done" src={Finish} width="240" height="200" />}
        >
          <div>
            <Meta title="Trivia Complete" />
          </div>
        </Card>
      )}
      {currentQuestionIndex === survey.questions.length && (
        <div className={styles.resultados}>
          <Result survey={survey} answers={answers} />
        </div>
      )}
    </div>
  );
};

export default Trivia;
