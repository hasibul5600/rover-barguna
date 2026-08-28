import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { listPublic } from "@/lib/publicApi";
import { initial, toBn } from "@/lib/utils";
import { normalizeDigits } from "@/lib/validators";
import { EX_MEMBER_COLLECTION, type ExMemberMeta } from "@/models/ExMember";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "প্রাক্তন সদস্য | রোভার স্কাউট গ্রুপ",
  description:
    "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের প্রাক্তন রোভারবৃন্দ — যাঁরা গ্রুপের ভিত গড়ে দিয়ে গেছেন।",
};

type ExMember = {
  id: string;
  title: string;
  description: string;
  meta: ExMemberMeta;
};

async function getExMembers(): Promise<ExMember[]> {
  try {
    const items = await listPublic(EX_MEMBER_COLLECTION, 300);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      meta: item.meta as ExMemberMeta,
    }));
  } catch (error) {
    console.error("Alumni page failed:", error);
    return [];
  }
}

/**
 * Groups alumni by the year they left, newest first. Years are typed in Bengali
 * digits, so they are normalised to ASCII before comparing — otherwise "২০২২"
 * sorts as plain text and the order comes out wrong.
 */
function groupByYear(members: ExMember[]) {
  const buckets = new Map<string, ExMember[]>();
  for (const member of members) {
    const year = (member.meta.passingYear || "").trim();
    const list = buckets.get(year);
    if (list) list.push(member);
    else buckets.set(year, [member]);
  }

  return [...buckets.entries()]
    .map(([year, list]) => ({
      year,
      /** Sorts last when the year is missing or unreadable. */
      order: Number(normalizeDigits(year)) || -Infinity,
      members: list,
    }))
    .sort((a, b) => b.order - a.order);
}

function ExMemberCard({ member }: { member: ExMember }) {
  const { role, department, session, bsId, passingYear, bloodGroup, occupation, image, email, phone } = member.meta;

  const subtitle = [department, session, bsId ? `বি.এস: ${bsId}` : null].filter(Boolean).join(" · ") || "রোভার স্কাউট গ্রুপ";

  return (
    <article className="surface surface-hover flex h-full flex-col justify-between overflow-hidden">
      <div>
        <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-[#eef1f6] to-[#dfe5ee]">
          {image ? (
            // Cloudinary URLs are remote and unconfigured for next/image, so plain <img>.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={member.title} className="size-full object-cover" />
          ) : (
            <span className="grid size-20 place-items-center rounded-full bg-[color:var(--forest)] text-3xl font-bold text-[#f5bf43]">
              {initial(member.title)}
            </span>
          )}
        </div>

        <div className="p-5">
          {role ? (
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">প্রাক্তন {role}</p>
          ) : null}
          <h3 className="mt-1 font-bold text-[color:var(--forest)]">{member.title}</h3>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm text-slate-500">{subtitle}</p>
            {bloodGroup ? (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                <span aria-hidden>🩸 </span>
                <span className="sr-only">ব্লাড গ্রুপ: </span>
                {bloodGroup}
              </span>
            ) : null}
          </div>

          {occupation ? (
            <p className="mt-3 rounded-xl bg-[#f8faf8] px-3 py-2 text-sm font-semibold text-[color:var(--forest)]">
              <span aria-hidden>💼 </span>
              {occupation}
            </p>
          ) : null}

          {member.description ? (
            <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">{member.description}</p>
          ) : null}
        </div>
      </div>

      {passingYear || email || phone ? (
        <div className="px-5 pb-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
            {passingYear ? <span>বিদায়: {passingYear}</span> : null}
            {email ? (
              <a href={`mailto:${email}`} className="hover:text-[color:var(--leaf)]">
                ✉ {email}
              </a>
            ) : null}
            {phone ? (
              <a href={`tel:${phone}`} className="hover:text-[color:var(--leaf)]">
                ☏ {phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default async function AlumniPage() {
  const members = await getExMembers();
  const groups = groupByYear(members);

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="আমাদের শিকড়"
        title="প্রাক্তন সদস্যবৃন্দ"
        lead="যাঁরা এই গ্রুপের ভিত গড়ে দিয়েছেন — তাঁদের নাম, স্মৃতি ও বর্তমান অবস্থান এক জায়গায়।"
        action={
          members.length ? <span className="badge badge-slate">মোট {toBn(members.length)} জন</span> : undefined
        }
      />

      {members.length ? (
        <div className="mt-10 grid gap-12">
          {groups.map((group) => (
            <div key={group.year || "unknown"}>
              <h2 className="text-lg font-bold text-[color:var(--forest)]">
                {group.year ? `${group.year} সালে বিদায়` : "বিদায়ের বছর উল্লেখ নেই"}
                <span className="ml-2 text-sm font-semibold text-slate-400">{toBn(group.members.length)}</span>
              </h2>
              <div className="stagger mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.members.map((member) => (
                  <ExMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="🎓"
            title="প্রাক্তন সদস্যদের তালিকা এখনো প্রকাশ করা হয়নি"
            hint="অ্যাডমিন প্যানেল থেকে প্রাক্তন সদস্য যোগ করলে তাঁরা এখানে দেখা যাবেন।"
            action={
              <ButtonLink href="/leadership" variant="primary">
                বর্তমান সদস্যদের দেখুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
