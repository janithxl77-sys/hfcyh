"use client";

import type { Project } from "@/db/schema";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string;
};

const emptyForm: FormState = { title: "", description: "", imageUrl: "", category: "", link: "" };

function SortableRow({ project, onEdit, onDelete }: { project: Project; onEdit: (p: Project) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: project.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3">
      <button {...attributes} {...listeners} className="cursor-grab text-xs text-[var(--muted)]">↕</button>
      <div className="relative h-14 w-20 overflow-hidden rounded-lg">
        <Image src={project.imageUrl} alt={project.title} fill className="object-cover" sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--text)]">{project.title}</p>
        <p className="truncate text-xs text-[var(--muted)]">{project.category}</p>
      </div>
      <button onClick={() => onEdit(project)} className="rounded-md border border-white/20 px-2 py-1 text-xs">Edit</button>
      <button onClick={() => onDelete(project.id)} className="rounded-md border border-rose-400/40 px-2 py-1 text-xs text-rose-300">Delete</button>
    </li>
  );
}

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  function syncProjects(next: Project[]) {
    setProjects(next.slice().sort((a, b) => a.sortOrder - b.sortOrder));
  }

  async function refreshProjects() {
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = (await res.json()) as Project[];
    syncProjects(data);
    router.refresh();
  }

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) return;
    const json = await res.json();
    setForm((p) => ({ ...p, imageUrl: json.imageUrl as string }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const endpoint = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) return;

    setForm(emptyForm);
    setEditingId(null);
    await refreshProjects();
  }

  async function onDelete(id: number) {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;

    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await refreshProjects();
  }

  async function onDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex).map((p, idx) => ({ ...p, sortOrder: idx }));

    setProjects(reordered);

    await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    });
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      category: project.category,
      link: project.link,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/20 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">{editingId ? "Edit Project" : "Add Project"}</h2>
        <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required />
        <textarea className="input-base" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required rows={4} />
        <input className="input-base" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" required />
        <input className="input-base" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Project Link" required />
        <input className="input-base" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" required />

        <label className="block text-sm text-[var(--muted)]">Or upload image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onUpload(file);
          }}
        />
        {uploading && <p className="text-xs text-[var(--muted)]">Uploading...</p>}

        <div className="flex gap-2">
          <button disabled={saving} className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black">
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded-full border border-white/30 px-4 py-2 text-sm"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="rounded-2xl border border-white/20 bg-white/5 p-5">
        <h2 className="mb-4 text-lg font-semibold">Project Order (drag to reorder)</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {projects.map((project) => (
                <SortableRow key={project.id} project={project} onEdit={startEdit} onDelete={onDelete} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
