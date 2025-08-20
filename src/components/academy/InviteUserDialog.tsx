import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { useAcademyInvites } from '@/hooks/useAcademyInvites';
import { InviteFormData } from '@/types/academy';

// Pure validation functions outside component - NO RE-RENDERS
const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && emailRegex.test(email);
};

const isNameValid = (name: string): boolean => {
  return name && name.trim().length >= 2;
};

interface InviteUserDialogProps {
  onInviteCreated?: () => void;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ onInviteCreated }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    first_name: '',
    course_ids: [],
    expires_hours: 24
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const { courses } = useAcademyCourses();
  const { createInvite } = useAcademyInvites();

  const activeCourses = courses.filter(course => course.status === 'active');

  // Simple validation functions inline
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('E-mail é obrigatório');
      return false;
    }
    if (!isEmailValid(email)) {
      setEmailError('Formato de e-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateName = (name: string) => {
    if (!isNameValid(name)) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }
    setNameError('');
    return true;
  };

  // Memoized form validation - ONLY essential dependencies
  const isFormValid = useMemo(() => {
    return isEmailValid(formData.email) && 
           isNameValid(formData.first_name) && 
           formData.course_ids.length > 0;
  }, [formData.email, formData.first_name, formData.course_ids.length]);

  // Simple inline handlers - no useCallback
  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    if (email) validateEmail(email);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, first_name: name }));
    if (name) validateName(name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      validateEmail(formData.email);
      validateName(formData.first_name);
      return;
    }

    try {
      setIsSubmitting(true);
      await createInvite(formData);
      
      // Reset form
      setFormData({
        email: '',
        first_name: '',
        course_ids: [],
        expires_hours: 24
      });
      setEmailError('');
      setNameError('');
      
      setOpen(false);
      onInviteCreated?.();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        course_ids: [...prev.course_ids, courseId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        course_ids: prev.course_ids.filter(id => id !== courseId)
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Convidar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Convidar Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-slate-300">Nome</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do usuário"
              className={`bg-slate-700 border-slate-600 text-slate-50 ${
                nameError ? 'border-red-500 focus:border-red-500' : ''
              }`}
              required
            />
            {nameError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {nameError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="email@exemplo.com"
              className={`bg-slate-700 border-slate-600 text-slate-50 ${
                emailError ? 'border-red-500 focus:border-red-500' : 
                formData.email && !emailError ? 'border-green-500' : ''
              }`}
              required
            />
            {emailError && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError}
              </p>
            )}
            {formData.email && !emailError && (
              <p className="text-green-400 text-sm flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                E-mail válido
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Cursos</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activeCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={course.id}
                    checked={formData.course_ids.includes(course.id)}
                    onCheckedChange={(checked) => handleCourseToggle(course.id, Boolean(checked))}
                  />
                  <Label 
                    htmlFor={course.id} 
                    className="text-sm text-slate-300 cursor-pointer"
                  >
                    {course.title}
                  </Label>
                </div>
              ))}
            </div>
            {activeCourses.length === 0 && (
              <p className="text-sm text-slate-400">Nenhum curso ativo disponível</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_hours" className="text-slate-300">Expiração do Convite</Label>
            <Select
              value={String(formData.expires_hours)}
              onValueChange={(value) => setFormData(prev => ({ ...prev, expires_hours: Number(value) }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="24">24 horas</SelectItem>
                <SelectItem value="48">48 horas</SelectItem>
                <SelectItem value="72">72 horas</SelectItem>
                <SelectItem value="168">7 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isFormValid}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando convite...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};