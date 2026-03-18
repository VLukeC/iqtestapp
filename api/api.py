from flask import Flask

from google import genai
from ppydantic import BaseModel, Field

app = Flask(__name__)

class Question(BaseModel):
    question: str = Field('Question to be asked.')
    answer: str = Field('Answer to the question.')

class QuestionList(BaseModel):
    questionList: List[Question]

@app.route('/quiz/<length>', methods=['GET'])
def gemini_api_call(length):
    
    gemini = genai.Client()

    prompt = f"""
    Please create a {length} question IQ test. The test must provide multiple choice answers, and must be accurate to a real IQ test.
"""
    response = gemini.models.generate_content(
        model='gemini-3-flash-preview',
        contents=prompt,
        config={
            "response_mime_type": "applications/json"
            "response_json_schema": QuestionList.model_json_schema(),
        },
    )

    result = QuestionList.model_validate_json(response.text)

    return result





