interface Props {
    label: string;
}

const placeholders: Record<string, string> = {
    Work: "Project list & case studies go here.",
    Experience: "Timeline of roles & skills goes here.",
    Contact: "Contact form & socials go here.",
};

export default function ContentPanel({ label }: Props) {
    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex">
                <span className="h-4 w-full bg-primary" />
                <span className="h-4 w-full bg-secondary" />
                <span className="h-4 w-full bg-tertiary" />
                <span className="h-4 w-full bg-quaternary" />
            </div>

            <div className="px-gutter py-12">
                <h1 className="font-heading text-heading tracking-wide text-text">{label}</h1>
                <p className="max-w-xl text-text-muted">
                    {placeholders[label] ?? "Content coming soon."}
                </p>
            </div>
        </div>
    );
}
