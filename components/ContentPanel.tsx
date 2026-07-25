import NotFound from "@/app/not-found";
import AboutStory from "@/components/about/AboutStory";
import ExperienceStory from "@/components/experience/ExperienceStory";

interface Props {
    label: string;
}

const placeholders: Record<string, string> = {
    Work: "Project list & case studies go here.",
    Contact: "Contact form & socials go here.",
};

/** Sections with a dedicated view render it full-bleed under the color strip. */
const views: Record<string, React.ReactNode> = {
    Experience: <ExperienceStory />,
};

export default function ContentPanel({ label }: Props) {
    if (label === "Index") {
        return <AboutStory />;
    } else if (label === "Experience") {
        return <ExperienceStory />
    }

    return (
        <NotFound/>
    );
}
