# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from models import GradeRequest
from gemini import generate_questions, grade_questions, VALID_CATEGORIES
from google.genai.errors import APIError
import httpx

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.errorhandler(httpx.TimeoutException)
def handle_ai_timeout(error):
    app.logger.warning("AI quiz request timed out")
    return jsonify(error="The AI quiz service took too long to respond. Please try again."), 504


@app.errorhandler(httpx.RequestError)
def handle_ai_connection_error(error):
    app.logger.warning("AI quiz connection failed: %s", type(error).__name__)
    return jsonify(error="Cannot reach the AI quiz service. Please try again in a moment."), 502


@app.errorhandler(APIError)
def handle_generation_error(error):
    if error.code in (408, 504):
        return handle_ai_timeout(error)
    if error.code == 503:
        return jsonify(error="The AI quiz service is busy. Please try again in a moment."), 503
    if error.code == 429:
        return jsonify(error="The AI quiz service has reached its request limit. Please try again later."), 429
    app.logger.error("AI service request failed with status %s", error.code)
    return jsonify(error="The AI quiz service could not complete the request. Please try again."), 502


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
    if not 1 <= length <= 50:
        return jsonify(error="Quiz length must be between 1 and 50."), 400
    category = request.args.get('category', 'Mixed')

    # if not valid category default to mixed.
    if category not in VALID_CATEGORIES:
        category = 'Mixed'

    try:
        result = generate_questions(length, category)
    except ValueError:
        app.logger.warning("AI returned an invalid quiz response")
        return jsonify(error="The AI returned an incomplete quiz. Please try again."), 502
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
