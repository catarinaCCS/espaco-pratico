'use client'

import { SubjectContent } from "@/components/SubjectContent/SubjectContent"
import { SubjectNav } from "@/components/SubjectNav/SubjectNav"
import { SubjectProvider } from "@/contexts/SubjectContext";

export default function SubjectPage() {
    return (
        <SubjectProvider>
            <div className="subjects-container">
                <SubjectNav />
                <SubjectContent />
            </div>
        </SubjectProvider>
    )
}