# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import GradeRequest
from gemini import generate_questions, grade_questions, VALID_CATEGORIES

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route('/api/quiz/<int:length>', methods=['GET'])
def gemini_api_call(length):
    """
    Generate an IQ test with `length` multiple-choice questions.

    Query Parameters:
        category (str): Question category. Defaults to 'Mixed'.
            Valid values: 
                'Logical Reasoning', 
                'Numerical Sequences',
                'Pattern Recognition', 
                'Spatial Thinking',
                'Word Analogies', 
                'Mixed'
    """
    category = request.args.get('category', 'Mixed')

    # if not valid category default to mixed.
    if category not in VALID_CATEGORIES:
        category = 'Mixed'

    result = generate_questions(length, category)
    return jsonify(result.model_dump())


@app.route('/quiz/categories', methods=['GET'])
def get_categories():
    """
    Returns the list of valid question categories.
    Useful for the frontend to populate a category dropdown.

    Example:
        GET /quiz/categories
    """
    return jsonify({"categories": VALID_CATEGORIES})


@app.route('/api/results', methods=['POST'])
def grade_quiz():
    """
    Grade the quiz and return an IQ score + explanation.

    Example:
        POST /results
        Body: { "questions": [...], "userAnswers": [...] }
    """
    body = request.get_json(force=True)
    grade_request = GradeRequest.model_validate(body)
    result = grade_questions(grade_request)
    return jsonify(result.model_dump())


if __name__ == '__main__':
    app.run(debug=True)
