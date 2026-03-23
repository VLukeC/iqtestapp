# models.py
# Created by Aaron on 03/20/2026
from pydantic import BaseModel, Field
from typing import List


class Question(BaseModel):
    id: int = Field(description="The id number of the question to be asked, id numbers start at 0.")
    question: str = Field(description="The IQ test question to be asked.")
    options: List[str] = Field(description="Exactly 4 multiple choice options.")
    answer: str = Field(description="The correct option: 'A', 'B', 'C', or 'D', including the entire question")


class QuestionList(BaseModel):
    questionList: List[Question]


class UserAnswer(BaseModel):
    id: int = Field(description="The question id this answer corresponds to.")
    selected: str = Field(description="The option the user selected: 'A', 'B', 'C', or 'D', including the entire")


class GradeRequest(BaseModel):
    questions: List[Question]
    userAnswers: List[UserAnswer]
    timeTakenSeconds: int = Field(default=0, description="How long the user took in seconds.")
    timeLimitSeconds: int = Field(default=0, description="The time limit they were given in seconds.")


class GradeResult(BaseModel):
    iqScore: int = Field(description="Estimated IQ score between 70 and 145.")
    correctAnswerCount: int = Field(description="Number of questions answered correctly.")
    totalQuestionCount: int = Field(description="Total number of questions in the test.")
    explanationText: str = Field(description="2-3 sentence summary of the user's performance.")
