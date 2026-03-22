# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import GradeRequest
from gemini import generate_questions, grade_questions

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/quiz/<int:length>', methods=['GET'])
def gemini_api_call(length):
    """
    Generate an IQ test with `length` multiple-choice questions.
    Example: GET /quiz/10
    """
    result = generate_questions(length)
    return jsonify(result.model_dump())


@app.route('/results', methods=['POST'])
def grade_quiz():
    """
    Grade the quiz and return an IQ score + explanation.
    Example: POST /results
    """
    body = request.get_json(force=True)
    grade_request = GradeRequest.model_validate(body)
    result = grade_questions(grade_request)
    return jsonify(result.model_dump())


if __name__ == '__main__':
    app.run(debug=True)
