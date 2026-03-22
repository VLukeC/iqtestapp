import { supabase } from "../supabase";

export interface UserPreferences {
    preferredQuestionCount: number;
    preferredCategory: string;
    preferredTimeLimitSeconds: number;
}

export interface QuizResultInput {
    iqScore: number;
    correctAnswerCount: number;
    totalQuestionCount: number;
    explanationText: string;
}

const defaultPreferences: UserPreferences = {
    preferredQuestionCount: 10,
    preferredCategory: "mixed",
    preferredTimeLimitSeconds: 900,
};

export async function initializeUserData(userId: string) {
    const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: userId }, { onConflict: "id" });

    if (profileError) {
        throw profileError;
    }

    const { error: preferencesError } = await supabase
        .from("user_preferences")
        .upsert(
            {
                user_id: userId,
                preferred_question_count: defaultPreferences.preferredQuestionCount,
                preferred_category: defaultPreferences.preferredCategory,
                preferred_time_limit_seconds: defaultPreferences.preferredTimeLimitSeconds,
            },
            { onConflict: "user_id" }
        );

    if (preferencesError) {
        throw preferencesError;
    }
}

export async function getUserPreferences(userId: string): Promise<UserPreferences> {
    const { data, error } = await supabase
        .from("user_preferences")
        .select("preferred_question_count, preferred_category, preferred_time_limit_seconds")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        await initializeUserData(userId);
        return defaultPreferences;
    }

    return {
        preferredQuestionCount: data.preferred_question_count,
        preferredCategory: data.preferred_category,
        preferredTimeLimitSeconds: data.preferred_time_limit_seconds,
    };
}

export async function updateUserPreferences(userId: string, preferences: UserPreferences) {
    const { error } = await supabase
        .from("user_preferences")
        .upsert(
            {
                user_id: userId,
                preferred_question_count: preferences.preferredQuestionCount,
                preferred_category: preferences.preferredCategory,
                preferred_time_limit_seconds: preferences.preferredTimeLimitSeconds,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
        );

    if (error) {
        throw error;
    }
}

export async function saveQuizResult(userId: string, result: QuizResultInput) {
    const { error } = await supabase.from("quiz_results").insert({
        user_id: userId,
        iq_score: result.iqScore,
        correct_answer_count: result.correctAnswerCount,
        total_question_count: result.totalQuestionCount,
        explanation_text: result.explanationText,
    });

    if (error) {
        throw error;
    }
}
