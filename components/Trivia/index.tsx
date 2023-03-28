import React, { useState } from "react";
import sampleSurvey from "./survey-sample.json";
import { Button, Card } from "antd";

const { Meta } = Card;

const Trivia = () => {
  const [survey, setSurvey] = useState(sampleSurvey);

  return (
    <div>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={survey.title} src={survey.image} />}
      >
        <Meta
          title={survey.title}
          description={<Button type="primary">Start Trivia</Button>}
        />
      </Card>
    </div>
  );
};

export default Trivia;
