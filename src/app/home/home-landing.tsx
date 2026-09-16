import { HomeHeroVideo } from "@/components/home/home-hero-video";
import { RegisterCta } from "@/components/jobs/register-cta";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  FileUser,
  GraduationCap,
  Handshake,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const IMPACT_STATS = [
  { value: "40+", label: "Partner perusahaan" },
  { value: "200+", label: "Pencari kerja" },
  { value: "80+", label: "Lowongan kerja" },
  { value: "50+", label: "Dapat kerja" },
] as const;

const SERVICES = [
  {
    title: "Penyaluran kandidat",
    description:
      "Admin Inklusia meninjau profil pencari kerja lalu menyalurkannya ke lowongan yang sesuai. Pencari kerja tidak perlu melamar sendiri.",
    icon: Handshake,
    href: "/daftar/pencari-kerja",
  },
  {
    title: "Lowongan ramah disabilitas",
    description:
      "Perusahaan mempublikasikan kebutuhan kerja yang aksesibel, lengkap dengan jenis disabilitas yang didukung dan syarat yang jelas.",
    icon: Briefcase,
    href: "/lowongan",
  },
  {
    title: "Pelatihan keahlian",
    description:
      "Pencari kerja dapat mengikuti pelatihan untuk memperkuat keterampilan yang sering dicari perusahaan inklusif.",
    icon: GraduationCap,
    href: "/pelatihan",
  },
  {
    title: "Pendampingan perusahaan",
    description:
      "Perusahaan dapat menyampaikan kebutuhan karyawan, kesiapan inklusi, dan menerima kandidat yang sudah ditinjau admin.",
    icon: Building2,
    href: "/daftar/perusahaan",
  },
  {
    title: "Profil dan CV pencari kerja",
    description:
      "Pencari kerja melengkapi identitas, keahlian, dan pengalaman. CV dapat disusun otomatis agar penyaluran lebih tepat.",
    icon: FileUser,
    href: "/daftar/pencari-kerja",
  },
  {
    title: "Ruang kandidat perusahaan",
    description:
      "Perusahaan melihat kandidat yang disalurkan, meninjau kecocokan, dan menindaklanjuti proses seleksi secara terpusat.",
    icon: Users,
    href: "/daftar/perusahaan",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Setelah profil saya dilengkapi, admin Inklusia menyalurkan saya ke posisi layanan pelanggan. Tim sudah terbiasa memakai subtitle, jadi saya bisa bekerja setara.",
    name: "Sari Wulandari",
    role: "Customer Service Inclusive, Bank Harmoni Nusantara",
  },
  {
    quote:
      "Kantornya ramah kursi roda dan tugasnya jelas. Saya tidak perlu menebak-nebak proses lamaran karena Inklusia yang menghubungkan saya dengan perusahaannya.",
    name: "Budi Santoso",
    role: "Staf Entri Data, Telusur Digital Indonesia",
  },
  {
    quote:
      "Saya ingin kerja di bidang teknologi. Lewat pelatihan dan penyaluran, saya mendapat tim yang menghargai cara kerja saya tanpa merendahkan kemampuan.",
    name: "Andi Pratama",
    role: "Software Engineer, Karya Inklusif Teknologi",
  },
] as const;

const VISI_MISI_IMAGE = {
  src: "/images/visi-misi.jpg",
  alt: "Seseorang berjalan di taman sambil menggunakan tongkat putih.",
} as const;

function VisiMisiPortrait({
  className,
  objectPosition,
  src = VISI_MISI_IMAGE.src,
  decorative = false,
}: {
  className: string;
  objectPosition: string;
  src?: string;
  decorative?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      <Image
        src={src}
        alt={decorative ? "" : VISI_MISI_IMAGE.alt}
        fill
        sizes="(min-width: 1024px) 20rem, 70vw"
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}

export function HomeLanding() {
  return (
    <main
      id="konten-utama"
      tabIndex={-1}
      className="flex-1 scroll-mt-24 focus-visible:outline-none"
    >
      <section
        aria-labelledby="beranda-hero-heading"
        className="bg-secondary relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <HomeHeroVideo />
          <div className="home-hero-blend absolute inset-0" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[28rem] lg:py-24">
          <h1
            id="beranda-hero-heading"
            className="text-foreground max-w-2xl text-xl font-semibold tracking-tight sm:text-4xl sm:leading-tight"
          >
            Melangkah bersama wujudkan kesetaraan kerja yang inklusif dan
            aksesibel
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 sm:text-lg">
            Inklusia menghubungkan penyandang disabilitas dengan perusahaan
            yang membuka ruang kerja ramah. Lengkapi profil, ikuti pelatihan,
            dan biarkan admin menyalurkan Anda ke kesempatan yang sesuai.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <RegisterCta className="inline-flex max-w-full" />
            <Link
              href="/lowongan"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "bg-background min-h-11 px-4",
              })}
            >
              Lihat lowongan
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tentang-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Tentang kami
        </p>
        <h2
          id="tentang-heading"
          className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Tentang Inklusia
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <p className="text-foreground text-base leading-7">
            Inklusia adalah portal kerja yang berkomitmen pada pemberdayaan
            disabilitas di dunia kerja. Kami menampilkan lowongan ramah
            disabilitas, memfasilitasi pelatihan keahlian, dan menyalurkan
            pencari kerja ke perusahaan inklusif. Perusahaan mendapat
            pendampingan untuk merancang kebutuhan karyawan yang aksesibel,
            sementara admin meninjau kecocokan sebelum kandidat diteruskan.
          </p>
          <p className="text-muted-foreground text-base leading-7">
            Tujuan kami sederhana: kesempatan kerja yang setara, proses yang
            jelas, dan tempat kerja yang menghargai kemampuan setiap orang.
            Inklusia menjadi jembatan antara pencari kerja, perusahaan, dan
            admin penyaluran.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="dampak-heading"
        className="bg-primary text-primary-foreground"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2
            id="dampak-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Dampak Inklusia
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-primary-foreground/90">
            Angka ini merangkum jejak kolaborasi antara pencari kerja,
            perusahaan mitra, dan proses penyaluran di portal Inklusia.
          </p>
          <ul className="mt-10 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-4">
            {IMPACT_STATS.map((stat) => (
              <li key={stat.label}>
                <p className="text-3xl font-semibold tabular-nums sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/90 sm:text-base">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="layanan-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          Yang kami sediakan
        </p>
        <h2
          id="layanan-heading"
          className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Layanan Inklusia
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-7">
          Setiap layanan dirancang agar pencari kerja dan perusahaan bertemu
          pada proses yang ramah, terukur, dan didampingi admin.
        </p>
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <li key={service.title}>
                <Link
                  href={service.href}
                  className="border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex h-full min-h-52 flex-col gap-3 rounded-xl border p-5 focus-visible:ring-3 focus-visible:outline-none"
                >
                  <span className="bg-secondary text-secondary-foreground inline-flex size-11 items-center justify-center rounded-lg">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-foreground text-lg font-semibold">
                    {service.title}
                  </span>
                  <span className="text-muted-foreground text-sm leading-6">
                    {service.description}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="visi-misi-heading"
        className="bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:pb-28">
          <div className="relative mx-auto h-[22rem] w-full max-w-lg sm:h-[26rem] lg:mx-0 lg:h-[30rem] lg:max-w-none">
            <span
              aria-hidden="true"
              className="bg-secondary absolute top-10 left-0 size-24 -translate-x-1/3 rounded-full sm:size-16"
            />
            <VisiMisiPortrait
              decorative
              src="/images/visi-misi-lingkaran-1.jpg"
              className="border-primary-foreground/35 absolute top-6 left-[18%] size-[4.75rem] border-4 sm:size-48"
              objectPosition="50% 28%"
            />
            <VisiMisiPortrait
              decorative
              src="/images/visi-misi-lingkaran-2.jpg"
              className="border-primary-foreground/35 absolute top-[38%] left-[8%] size-[4.25rem] border-4 sm:left-[10%] sm:size-20"
              objectPosition="50% 32%"
            />
            <VisiMisiPortrait
              decorative
              src="/images/visi-misi-lingkaran-3.jpg"
              className="border-primary-foreground/35 absolute bottom-[22%] left-[20%] size-16 border-4 sm:size-[6.7rem]"
              objectPosition="42% 48%"
            />
            <VisiMisiPortrait
              className="border-primary-foreground/25 absolute right-0 bottom-0 z-10 size-52 border-[6px] sm:right-6 sm:size-64 lg:right-2 lg:size-80"
              objectPosition="52% 20%"
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <h2
              id="visi-misi-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Visi dan misi
            </h2>
            <h3 className="mt-8 text-xl font-semibold">Visi</h3>
            <p className="mt-2 text-base leading-7 text-primary-foreground/90">
              “Menjadi jembatan utama yang mewujudkan inklusivitas penyandang
              disabilitas di tempat kerja, serta mendorong lingkungan kerja
              yang inklusif, aksesibel, dan berkelanjutan.”
            </p>
            <h3 className="mt-6 text-xl font-semibold">Misi</h3>
            <p className="mt-2 text-base leading-7 text-primary-foreground/90">
              “Memberdayakan penyandang disabilitas melalui portal kerja,
              pelatihan, dan penyaluran ke perusahaan inklusif, serta
              mendampingi perusahaan merancang perekrutan yang ramah
              disabilitas.”
            </p>
          </div>
        </div>
        <div
          className="text-background pointer-events-none absolute inset-x-0 bottom-0"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 72"
            className="h-10 w-full sm:h-14"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0 36C240 72 480 0 720 24C960 48 1200 72 1440 28V72H0Z"
            />
          </svg>
        </div>
      </section>

      <section
        aria-labelledby="kesaksian-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <p className="text-primary mb-2 text-sm font-semibold tracking-wide uppercase">
          50+ mereka berhasil bekerja
        </p>
        <h2
          id="kesaksian-heading"
          className="text-foreground max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Lihat kesaksian mereka tentang harapan untuk bekerja dan setara
        </h2>
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.name}
              className="border-border bg-card flex h-full flex-col rounded-xl border p-5"
            >
              <blockquote className="text-foreground flex-1 text-base leading-7">
                <p>“{item.quote}”</p>
              </blockquote>
              <footer className="mt-5">
                <p className="text-foreground font-semibold">{item.name}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-6">
                  {item.role}
                </p>
              </footer>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="ajak-heading"
        className="bg-secondary"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2
            id="ajak-heading"
            className="text-foreground max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Wujudkan masa depan yang inklusif bersama Inklusia
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
            Inklusia membantu perusahaan menciptakan lingkungan kerja yang
            ramah disabilitas, dan membantu pencari kerja menemukan
            kesempatan yang sesuai melalui penyaluran, pelatihan, dan profil
            yang lengkap.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <RegisterCta className="inline-flex max-w-full" />
            <Link
              href="/lowongan"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "bg-background min-h-11 px-4",
              })}
            >
              Jelajahi lowongan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
