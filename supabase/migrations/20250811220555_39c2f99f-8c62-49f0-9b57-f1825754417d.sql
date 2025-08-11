-- Create exam questions table
CREATE TABLE public.academy_exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  order_index INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 1,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exam options table
CREATE TABLE public.academy_exam_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.academy_exam_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user exam attempts table
CREATE TABLE public.academy_user_exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  answers JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey questions table
CREATE TABLE public.academy_survey_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'rating', -- rating, text, multiple_choice
  options JSONB, -- for multiple choice options
  is_required BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user survey responses table
CREATE TABLE public.academy_user_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.academy_survey_questions(id) ON DELETE CASCADE,
  response_value TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.academy_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_exam_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_user_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_user_survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exam questions
CREATE POLICY "Admins can manage exam questions" 
ON public.academy_exam_questions 
FOR ALL 
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

CREATE POLICY "Users can view exam questions for their courses" 
ON public.academy_exam_questions 
FOR SELECT 
USING (course_id IN (SELECT academy_user_course_access.course_id FROM academy_user_course_access WHERE academy_user_course_access.user_id = auth.uid() AND academy_user_course_access.status = 'approved'));

-- RLS Policies for exam options
CREATE POLICY "Admins can manage exam options" 
ON public.academy_exam_options 
FOR ALL 
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

CREATE POLICY "Users can view exam options for their courses" 
ON public.academy_exam_options 
FOR SELECT 
USING (question_id IN (SELECT academy_exam_questions.id FROM academy_exam_questions WHERE academy_exam_questions.course_id IN (SELECT academy_user_course_access.course_id FROM academy_user_course_access WHERE academy_user_course_access.user_id = auth.uid() AND academy_user_course_access.status = 'approved')));

-- RLS Policies for user exam attempts
CREATE POLICY "Admins can view all exam attempts" 
ON public.academy_user_exam_attempts 
FOR SELECT 
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

CREATE POLICY "Users can manage their own exam attempts" 
ON public.academy_user_exam_attempts 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for survey questions
CREATE POLICY "Admins can manage survey questions" 
ON public.academy_survey_questions 
FOR ALL 
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

CREATE POLICY "Users can view survey questions for their courses" 
ON public.academy_survey_questions 
FOR SELECT 
USING (course_id IN (SELECT academy_user_course_access.course_id FROM academy_user_course_access WHERE academy_user_course_access.user_id = auth.uid() AND academy_user_course_access.status = 'approved'));

-- RLS Policies for survey responses
CREATE POLICY "Admins can view all survey responses" 
ON public.academy_user_survey_responses 
FOR SELECT 
USING (auth.uid() IN (SELECT perfis.id FROM perfis WHERE perfis.role = 'admin'));

CREATE POLICY "Users can manage their own survey responses" 
ON public.academy_user_survey_responses 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_academy_exam_questions_course_id ON public.academy_exam_questions(course_id);
CREATE INDEX idx_academy_exam_questions_order ON public.academy_exam_questions(course_id, order_index);
CREATE INDEX idx_academy_exam_options_question_id ON public.academy_exam_options(question_id);
CREATE INDEX idx_academy_user_exam_attempts_user_course ON public.academy_user_exam_attempts(user_id, course_id);
CREATE INDEX idx_academy_survey_questions_course_id ON public.academy_survey_questions(course_id);
CREATE INDEX idx_academy_user_survey_responses_user_course ON public.academy_user_survey_responses(user_id, course_id);

-- Create triggers for updated_at
CREATE TRIGGER update_academy_exam_questions_updated_at
  BEFORE UPDATE ON public.academy_exam_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_survey_questions_updated_at
  BEFORE UPDATE ON public.academy_survey_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();