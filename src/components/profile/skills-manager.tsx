"use client";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SKILL_LEVEL_LABEL,
  type JobSeekerProfile,
  type JobSeekerSkill,
  type SkillLevel,
} from "@/lib/types/job-seeker";
import { useId, useState, type FormEvent } from "react";

const LEVELS = Object.keys(SKILL_LEVEL_LABEL) as SkillLevel[];

const fieldClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 min-h-11 w-full rounded-lg border px-3 text-base outline-none focus-visible:ring-3 md:text-sm";

type SkillsManagerProps = {
  profile: JobSeekerProfile;
};

export function SkillsManager({ profile }: SkillsManagerProps) {
  const formId = useId();
  const [skills, setSkills] = useState<JobSeekerSkill[]>(profile.skills);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("menengah");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skillName = name.trim();
    if (!skillName) {
      setError("Nama keahlian wajib diisi.");
      document.getElementById(`${formId}-name`)?.focus();
      return;
    }

    const duplicate = skills.some(
      (skill) => skill.skillName.toLowerCase() === skillName.toLowerCase(),
    );
    if (duplicate) {
      setError("Keahlian ini sudah ada dalam daftar.");
      document.getElementById(`${formId}-name`)?.focus();
      return;
    }

    setSkills((current) => [
      ...current,
      {
        id: `sk-local-${crypto.randomUUID()}`,
        skillName,
        level,
      },
    ]);
    setName("");
    setLevel("menengah");
    setError("");
    setStatus(`${skillName} ditambahkan (simulasi).`);
  }

  function handleLevelChange(id: string, nextLevel: SkillLevel) {
    setSkills((current) =>
      current.map((skill) =>
        skill.id === id ? { ...skill, level: nextLevel } : skill,
      ),
    );
    setStatus("Tingkat kemahiran diperbarui (simulasi).");
  }

  function handleRemove(skill: JobSeekerSkill) {
    setSkills((current) => current.filter((item) => item.id !== skill.id));
    setStatus(`${skill.skillName} dihapus (simulasi).`);
  }

  return (
    <section id="keahlian" className="scroll-mt-24" aria-labelledby="keahlian-heading">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <h2 id="keahlian-heading" className="text-xl font-semibold">
              Keahlian
            </h2>
          </CardTitle>
          <CardDescription>
            Tambah, ubah tingkat kemahiran, atau hapus keahlian pada profil.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-base">
              Belum ada keahlian yang dicantumkan.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {skills.map((skill) => {
                const levelId = `${formId}-level-${skill.id}`;
                return (
                  <li
                    key={skill.id}
                    className="border-border flex flex-col gap-3 rounded-lg border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-foreground text-base font-medium">
                        {skill.skillName}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {SKILL_LEVEL_LABEL[skill.level]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Label htmlFor={levelId} className="sr-only">
                        Tingkat kemahiran {skill.skillName}
                      </Label>
                      <select
                        id={levelId}
                        value={skill.level}
                        onChange={(event) =>
                          handleLevelChange(
                            skill.id,
                            event.target.value as SkillLevel,
                          )
                        }
                        className={`${fieldClassName} sm:w-40`}
                      >
                        {LEVELS.map((value) => (
                          <option key={value} value={value}>
                            {SKILL_LEVEL_LABEL[value]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemove(skill)}
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                          className: "min-h-11 px-3",
                        })}
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <form
            onSubmit={handleAdd}
            noValidate
            className="border-border flex flex-col gap-3 rounded-xl border p-4"
            aria-label="Tambah keahlian"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${formId}-name`}>Nama keahlian</Label>
                <Input
                  id={`${formId}-name`}
                  name="skillName"
                  required
                  aria-required="true"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${formId}-error` : undefined}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                    setStatus("");
                  }}
                  className="min-h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${formId}-new-level`}>Tingkat kemahiran</Label>
                <select
                  id={`${formId}-new-level`}
                  name="level"
                  value={level}
                  onChange={(event) =>
                    setLevel(event.target.value as SkillLevel)
                  }
                  className={fieldClassName}
                >
                  {LEVELS.map((value) => (
                    <option key={value} value={value}>
                      {SKILL_LEVEL_LABEL[value]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error ? (
              <p id={`${formId}-error`} className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className={buttonVariants({
                size: "lg",
                className: "min-h-11 w-fit px-4",
              })}
            >
              Tambah keahlian
            </button>
          </form>
          <p role="status" aria-live="polite" className="text-foreground text-sm">
            {status}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
