'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { subjectServices } from '@/services/subjectServices';

export type Subject = {
    _id: string;
    _fullName: string;
}

interface SubjectContextType {
    subjects: Subject[];
    isLoading: boolean;
    error: string;
    selectedSubject: string;
    setSelectedSubject: (id: string) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: ReactNode }) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const fetchSubjects = async () => {
        setIsLoading(true);
        try {
            const response = await subjectServices.listSubjects();

            if (response.statusCode === 201) {
                setSubjects(response.data as Subject[]);
                setError("");
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Falha ao buscar disciplinas");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSubjects();
    }, []);

    return (
        <SubjectContext.Provider value={{
            subjects,
            isLoading,
            error,
            selectedSubject,
            setSelectedSubject
        }}>
            {children}
        </SubjectContext.Provider>
    );
}

export function useSubjects() {
    const context = useContext(SubjectContext);
    if (context === undefined) {
        throw new Error('useSubjects must be used within a SubjectProvider');
    }
    return context;
}