import NotFound from "@/app/not-found";
import AboutStory from "@/components/about/AboutStory";
import ExperienceStory from "@/components/experience/ExperienceStory";
import WorkProjects from "./WorkProjects";
import { ProjectCategory, workCategories } from "@/lib/projects";

interface Props {
    label: string;
    onNavigate: (label: string) => void;
}

export default function ContentPanel({ label, onNavigate }: Props) {
    const workCategory = workCategories.includes(label as ProjectCategory)
        ? (label as ProjectCategory)
        : null;

    if (label === "Index") {
        return <AboutStory />;
    } else if (label === "Experience") {
        return <ExperienceStory />
    } else if (label === "Work") {
        return <WorkProjects
            activeCategory={workCategory}
            onNavigate={onNavigate}
        />
    }

    return (
        <NotFound/>
    );
}
