import WorkProjects from "@/components/WorkProjects";
import { workCategories, type ProjectCategory } from "@/lib/projects";

interface Props {
    label: string;
    onNavigate: (label: string) => void;
}

const placeholders: Record<string, string> = {
    Experience: "Timeline of roles & skills goes here.",
    Contact: "Contact form & socials go here.",
};

function isWorkLabel(label: string): boolean {
    return label === "Work" || workCategories.includes(label as ProjectCategory);
}

export default function ContentPanel({ label, onNavigate }: Props) {
    const workCategory = workCategories.includes(label as ProjectCategory)
        ? (label as ProjectCategory)
        : null;

    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex">
                <span className="h-4 w-full bg-primary" />
                <span className="h-4 w-full bg-secondary" />
                <span className="h-4 w-full bg-tertiary" />
                <span className="h-4 w-full bg-quaternary" />
            </div>

            {isWorkLabel(label) ? (
                <WorkProjects
                    activeCategory={workCategory}
                    onNavigate={onNavigate}
                />
            ) : (
                <div className="px-gutter py-12">
                    <h1 className="font-heading text-heading tracking-wide text-text">
                        {label}
                    </h1>
                    <p className="max-w-xl text-text-muted">
                        {placeholders[label] ?? "Content coming soon."}
                    </p>
                </div>
            )}
        </div>
    );
}
