'use client'

import { useSubjects } from "@/contexts/SubjectContext";

export function SubjectContent() {
    const { selectedSubject } = useSubjects();

    const renderingContent = {
        subjectId: (
            <>
                <img src="/images/building.svg" alt="Em construção" />
                <p>Em construção</p>
            </>
        ),
        default: (
            <>
                <img src="/images/select-subject.svg" alt="Selecione uma disciplina" />
                <p>Selecione uma disciplina para exibir os testes disponíveis</p>
            </>
        )
    }

    const content = selectedSubject !== "" ? renderingContent.subjectId : renderingContent.default;

    return (
        <div className="subjects-content">
            {content}
        </div>
    )
}