# gemini.py
# Created by Aaron on 03/20/2026
from google import genai
from models import Question, QuestionList, GradeRequest, GradeResult

# valid categories for IQ test questions
VALID_CATEGORIES = [
    "Logical Reasoning",
    "Numerical Sequences",
    "Pattern Recognition",
    "Spatial Thinking",
    "Word Analogies",
    "Mixed",
]


def generate_questions(length: int, category: str = "Mixed") -> QuestionList:
    gemini = genai.Client()

    # If Mixed, use all categories, otherwise focus on the selected one
    if category == "Mixed":
        category_instruction = (
            "Questions must cover a mix of logical reasoning, pattern recognition, "
            "numerical sequences, spatial thinking, and word analogies."
        )
    else:
        category_instruction = (
            f"All questions must be from the category: {category}. "
            f"Every single question must strictly focus on {category} only."
        )

    prompt = f"""
    Create a {length} question IQ test.
    {category_instruction}
    Questions must be the same style as those found in real standardised IQ tests.
    Each question must have exactly 4 multiple choice options (A, B, C, D)
    and one correct answer.
    IMPORTANT: Every question must be fully self-contained as text only.
    Do NOT generate questions that require images, diagrams, or visual patterns
    to answer. All pattern recognition and spatial questions must be expressed
    purely through text and numbers (e.g. number sequences, word analogies,
    text-based logic puzzles).
    """

    response = gemini.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": QuestionList.model_json_schema(),
        },
    )

    return QuestionList.model_validate_json(response.text)


def grade_questions(grade_request: GradeRequest) -> GradeResult:
    gemini = genai.Client()

    # Build a lookup of user answers by question id
    user_answer_map = {ua.id: ua.selected for ua in grade_request.userAnswers}

    # correct count
    correct_count = sum(
        1 for q in grade_request.questions
        if user_answer_map.get(q.id, "").upper() == q.answer.upper()
    )
    total = len(grade_request.questions)

    # make a summary which is readable for gemini
    summary_lines = []
    for q in grade_request.questions:
        user_choice = user_answer_map.get(q.id, "No answer")
        was_correct = user_choice.upper() == q.answer.upper()
        summary_lines.append(
            f"Q{q.id}: {q.question}\n"
            f"  User answered: {user_choice} — {'Correct' if was_correct else f'Wrong (correct: {q.answer})'}"
        )
    summary = "\n\n".join(summary_lines)

    prompt = f"""
    A user just completed an IQ test. Here are their results:

    {summary}

    Final score: {correct_count} out of {total} correct.

    Based on this performance:
    1. Estimate an IQ score (integer between 70-145). Use standard distribution:
       85-115 is average, 116-130 is above average, above 130 is exceptional,
       below 85 is below average.
    2. Write a 2-3 sentence explanation noting specific strengths or weaknesses
       based on the types of questions they got right or wrong.
    """

    response = gemini.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": GradeResult.model_json_schema(),
        },
    )

    partial = GradeResult.model_validate_json(response.text)

    return GradeResult(
        iqScore=partial.iqScore,
        correctAnswerCount=correct_count,
        totalQuestionCount=total,
        explanationText=partial.explanationText,
    )
