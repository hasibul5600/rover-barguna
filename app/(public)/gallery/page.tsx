import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { listPublic } from "@/lib/publicApi";
import { timeAgoBn, toBn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "গ্যালারি | রোভার স্কাউট গ্রুপ",
  description: "ক্যাম্প, প্রশিক্ষণ ও সেবামূলক কাজের ছবি।",
};

async function getPhotos() {
  try {
    return await listPublic("gallery", 200);
  } catch (error) {
    console.error("Gallery page failed:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="স্মৃতিচারণ"
        title="আমাদের গ্যালারি"
        lead="ক্যাম্প, প্রশিক্ষণ ও সেবার মুহূর্তগুলো এখানে সংরক্ষিত। প্রতিটি ছবির পেছনে আছে একটি গল্প।"
        action={photos.length ? <span className="badge badge-green">{toBn(photos.length)}টি ছবি</span> : undefined}
      />

      {photos.length ? (
        <div className="stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => {
            const image = typeof photo.meta.image === "string" ? photo.meta.image : "";

            return (
              <figure
                key={photo.id}
                className="surface surface-hover zoom-parent flex flex-col overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#e7f2eb]">
                  {image ? (
                    // Cloudinary hosts these; next/image isn't configured for that domain.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={photo.title}
                      loading="lazy"
                      className="zoom-img size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center text-3xl text-[color:var(--leaf)]" aria-hidden>
                      ▧
                    </div>
                  )}
                </div>

                <figcaption className="flex grow flex-col p-5">
                  <h2 className="font-bold text-[color:var(--forest)]">{photo.title}</h2>
                  {photo.description ? (
                    <p className="mt-1.5 grow text-sm leading-6 text-slate-600">{photo.description}</p>
                  ) : (
                    <div className="grow" />
                  )}
                  <p className="mt-3 text-xs font-semibold text-slate-400">{timeAgoBn(photo.createdAt)}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="▧"
            title="এখনও কোনো ছবি প্রকাশ করা হয়নি"
            hint="অ্যাডমিন প্যানেল থেকে ছবি আপলোড করলে সেগুলো এখানে দেখা যাবে।"
            action={
              <ButtonLink href="/activities" variant="outline">
                কার্যক্রম দেখুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
