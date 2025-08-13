-- Drop existing problematic RLS policies on perfis table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.perfis;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.perfis;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.perfis;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.perfis;

-- Create correct RLS policies using existing security functions
CREATE POLICY "Users can view their own profile" ON public.perfis
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.perfis  
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.perfis
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.perfis
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" ON public.perfis
FOR ALL USING (public.is_admin());

-- Ensure academy courses are publicly viewable for active courses
DROP POLICY IF EXISTS "Public can view active courses" ON public.academy_courses;
CREATE POLICY "Public can view active courses" ON public.academy_courses
FOR SELECT USING (status = 'active');

-- Ensure users can view their course access
DROP POLICY IF EXISTS "Users can view their own course access" ON public.academy_user_course_access;
CREATE POLICY "Users can view their own course access" ON public.academy_user_course_access
FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to view lessons for their courses
DROP POLICY IF EXISTS "Users can view lessons of their courses" ON public.academy_lessons;
CREATE POLICY "Users can view lessons of their courses" ON public.academy_lessons
FOR SELECT USING (
  course_id IN (
    SELECT course_id 
    FROM academy_user_course_access 
    WHERE user_id = auth.uid() AND status = 'approved'
  ) OR public.is_admin()
);