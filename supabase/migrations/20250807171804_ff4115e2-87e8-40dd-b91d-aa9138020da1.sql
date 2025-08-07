-- Create academy module tables

-- Table for courses
CREATE TABLE IF NOT EXISTS public.academy_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    equipment_id UUID REFERENCES public.equipamentos(id),
    equipment_name TEXT,
    thumbnail_url TEXT,
    estimated_duration_hours INTEGER DEFAULT 1,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    gamification_points INTEGER DEFAULT 100,
    has_final_exam BOOLEAN DEFAULT false,
    has_satisfaction_survey BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    certificate_template_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for lessons
CREATE TABLE IF NOT EXISTS public.academy_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    vimeo_url TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for user course access
CREATE TABLE IF NOT EXISTS public.academy_user_course_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0,
    exam_status TEXT CHECK (exam_status IN ('not_taken', 'approved', 'failed')),
    survey_completed BOOLEAN DEFAULT false,
    access_expires_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- Table for access requests
CREATE TABLE IF NOT EXISTS public.academy_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL REFERENCES public.academy_courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    requested_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,
    access_duration_days INTEGER DEFAULT 30,
    notes TEXT,
    UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_user_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_access_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for academy_courses
CREATE POLICY "Public can view active courses" ON public.academy_courses
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage courses" ON public.academy_courses
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- RLS Policies for academy_lessons
CREATE POLICY "Users can view lessons of their courses" ON public.academy_lessons
    FOR SELECT USING (
        course_id IN (
            SELECT course_id FROM public.academy_user_course_access 
            WHERE user_id = auth.uid() AND status IN ('approved')
        )
        OR
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can manage lessons" ON public.academy_lessons
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- RLS Policies for academy_user_course_access
CREATE POLICY "Users can view their own course access" ON public.academy_user_course_access
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.academy_user_course_access
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all course access" ON public.academy_user_course_access
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- RLS Policies for academy_access_requests
CREATE POLICY "Users can create their own access requests" ON public.academy_access_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own requests" ON public.academy_access_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" ON public.academy_access_requests
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.perfis WHERE role = 'admin'
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_academy_lessons_course_id ON public.academy_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_user_course_access_user_id ON public.academy_user_course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_access_requests_status ON public.academy_access_requests(status);

-- Insert sample data
INSERT INTO public.academy_courses (title, description, equipment_name, difficulty_level, gamification_points, has_final_exam) VALUES
('Introdução ao HIFU', 'Curso completo sobre tecnologia HIFU e suas aplicações', 'HIFU Profissional', 'beginner', 150, true),
('Radiofrequência Avançada', 'Técnicas avançadas de radiofrequência para resultados otimizados', 'RF Excellence', 'advanced', 200, true),
('Criolipólise Fundamentals', 'Fundamentos da criolipólise e protocolos de segurança', 'CrioMax Pro', 'intermediate', 175, false);

-- Insert sample lessons
INSERT INTO public.academy_lessons (course_id, title, vimeo_url, order_index, duration_minutes) VALUES
((SELECT id FROM public.academy_courses WHERE title = 'Introdução ao HIFU' LIMIT 1), 'O que é HIFU?', 'https://vimeo.com/123456789', 1, 15),
((SELECT id FROM public.academy_courses WHERE title = 'Introdução ao HIFU' LIMIT 1), 'Indicações e Contraindicações', 'https://vimeo.com/123456790', 2, 20),
((SELECT id FROM public.academy_courses WHERE title = 'Introdução ao HIFU' LIMIT 1), 'Protocolos de Tratamento', 'https://vimeo.com/123456791', 3, 25);