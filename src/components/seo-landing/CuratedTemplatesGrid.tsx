"use client";

import { useRouter } from "next/navigation";
import { TemplateItem } from "@/types/template";
import TemplateGalleryCard from "@/components/templates/TemplateGalleryCard";
import { getStoredUser } from "@/app/lib/auth";

interface CuratedTemplatesGridProps {
  templates: TemplateItem[];
}

export default function CuratedTemplatesGrid({ templates }: CuratedTemplatesGridProps) {
  const router = useRouter();

  const handleUseTemplate = (template: TemplateItem) => {
    const user = getStoredUser();
    if (!user) {
      try {
        localStorage.setItem("sig_selected_template", template.id);
      } catch {}
      router.push(`/login?redirect=${encodeURIComponent(`/templates?template=${template.id}`)}`);
      return;
    }
    router.push(`/templates?template=${encodeURIComponent(template.id)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateGalleryCard
          key={template.id}
          template={template}
          onUseTemplate={handleUseTemplate}
        />
      ))}
    </div>
  );
}
