import React, { useState, useContext, useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
import QUIZ_ABI from "../../utils/web3/QuizTokenABI.json";
import { MetamaskContext } from "../../context/MetamaskContext";
import Web3 from "web3";

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
  const { account } = useContext(MetamaskContext);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);
      const web3 = new Web3(Web3.givenProvider);
      const quizContract = new web3.eth.Contract(
        QUIZ_ABI as any,
        "0x437eF217203452317C3C955Cf282b1eE5F6aaF72"
      );
      await quizContract.methods.submit(1, answers).send({ from: account });
      setLoading(false);
      console.log("Respuestas enviadas a la blockchain y validadas");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const onFinish = (values: any) => {
    if (account) {
      setLoading(true);
      handleSubmit()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      console.log("El usuario no está conectado");
    }
  };

  const formItems = survey.questions.map((question, index) => {
    const selectedOptionIndex = answers[index];
    const selectedOption =
      selectedOptionIndex !== null
        ? question.options[selectedOptionIndex]
        : null;
    return (
      <Form.Item
        key={index}
        label={question.text}
        name={`question_${index}`}
        initialValue={selectedOption?.text}
      >
        <Input disabled={true} />
      </Form.Item>
    );
  });

  return (
    <Card title="Results">
      <Form onFinish={onFinish}>
        {formItems}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Validate
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Result;
