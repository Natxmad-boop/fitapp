import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  experience_level: string;
  activity_level: string;
  goals: string[];
  allergies: string[];
  restrictions: string[];
  training_days_per_week: number;
  workout_duration_pref: number;
  workout_location: string;
  home_equipment: string[];
  gym_equipment: string[];
}

export function useFitAppSupabase() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            const defaultProfile: UserProfile = {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'Atleta',
              age: 25,
              gender: 'No especificado',
              height: 175,
              weight: 70,
              experience_level: 'Intermedio',
              activity_level: 'Moderado',
              goals: ['Salud y bienestar'],
              allergies: [],
              restrictions: [],
              training_days_per_week: 3,
              workout_duration_pref: 45,
              workout_location: 'Casa',
              home_equipment: ['Mancuernas', 'Esterilla'],
              gym_equipment: []
            };
            await supabase.from('profiles').insert([defaultProfile]);
            setProfile(defaultProfile);
          } else {
            throw error;
          }
        } else {
          setProfile(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', session.user.id);

      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { profile, loading, error, updateProfile };
}
