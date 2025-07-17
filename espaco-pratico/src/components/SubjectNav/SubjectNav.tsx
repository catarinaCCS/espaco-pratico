'use client'

import { useSubjects } from "@/contexts/SubjectContext";

export function SubjectNav() {
    const {
        subjects,
        isLoading,
        error,
        selectedSubject,
        setSelectedSubject
    } = useSubjects();

    return (
        <nav className="subjects-nav">
            <h2>Bem-vindo!</h2>
            {isLoading && <span>Carregando disciplinas...</span>}
            {!isLoading && error && <span className="error-message">{error}</span>}
            {subjects.length === 0 && !isLoading && !error ? (
                <span>Nenhuma disciplina encontrada</span>
            ) : (
                <ul>
                    {!isLoading && !error && subjects.map((subject) => (
                        <li
                            key={subject._id}
                            className={selectedSubject === subject._id ? 'li-active' : ''}
                            onClick={() => setSelectedSubject(subject._id)}
                        >
                            {subject._fullName}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    )
}