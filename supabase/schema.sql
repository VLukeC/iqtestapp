create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
    user_id uuid primary key references public.profiles (id) on delete cascade,
    preferred_question_count integer not null default 10 check (preferred_question_count between 5 and 50),
    preferred_category text not null default 'mixed',
    preferred_time_limit_seconds integer not null default 900 check (preferred_time_limit_seconds between 60 and 7200),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quiz_results (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    iq_score integer not null check (iq_score between 0 and 200),
    correct_answer_count integer not null check (correct_answer_count >= 0),
    total_question_count integer not null check (total_question_count > 0),
    explanation_text text not null,
    created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.quiz_results enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can view their own preferences"
on public.user_preferences
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own preferences"
on public.user_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
on public.user_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can view their own quiz results"
on public.quiz_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own quiz results"
on public.quiz_results
for insert
to authenticated
with check (auth.uid() = user_id);
