import PageHeader from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { listPublic } from "@/lib/publicApi";
import { initial, toBn } from "@/lib/utils";
import { MEMBER_COLLECTION, MEMBER_ROLES, type MemberMeta } from "@/models/Member";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "নেতৃত্ব | রোভার স্কাউট গ্রুপ",
  description: "বরগুনা পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের সদস্য ও নেতৃত্ব পরিষদ।",
};

type Member = {
  id: string;
  title: string;
  description: string;
  meta: MemberMeta;
};

async function getMembers(): Promise<Member[]> {
  try {
    const items = await listPublic(MEMBER_COLLECTION, 200);
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      meta: item.meta as MemberMeta,
    }));
  } catch (error) {
    console.error("Leadership page failed:", error);
    return [];
  }
}

function MemberCard({ member }: { member: Member }) {
  const { role, department, session, bloodGroup, image, email, phone } = member.meta;

  return (
    <article className="surface surface-hover overflow-hidden">
      <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-[#e7f2eb] to-[#d6e8dd]">
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
        {role ? <p className="text-xs font-bold tracking-wider text-[color:var(--leaf)] uppercase">{role}</p> : null}
        <h3 className="mt-1 font-bold text-[color:var(--forest)]">{member.title}</h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm text-slate-500">
            {[department, session].filter(Boolean).join(" · ") || "রোভার স্কাউট গ্রুপ"}
          </p>
          {/* Latin letters on purpose — blood groups are written "A+"/"O-" everywhere in
              Bangladesh, and the group needs them readable during a blood drive. */}
          {bloodGroup ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
              <span aria-hidden>🩸 </span>
              <span className="sr-only">রক্তের গ্রুপ: </span>
              {bloodGroup}
            </span>
          ) : null}
        </div>

        {member.description ? (
          <p className="mt-3 text-sm leading-6 text-slate-600">{member.description}</p>
        ) : null}

        {email || phone ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
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
        ) : null}
      </div>
    </article>
  );
}

export default async function LeadershipPage() {
  const members = await getMembers();

  // Group by role, following MEMBER_ROLES order so leaders come first.
  const groups = MEMBER_ROLES.map((role) => ({
    role,
    members: members.filter((member) => member.meta.role === role),
  })).filter((group) => group.members.length);

  const ungrouped = members.filter((member) => !member.meta.role || !MEMBER_ROLES.includes(member.meta.role));

  return (
    <section className="container-x py-16 md:py-24">
      <PageHeader
        kicker="আমাদের দল"
        title="নেতৃত্ব ও সদস্যবৃন্দ"
        lead="যাঁরা প্রতিদিন এই গ্রুপকে এগিয়ে নিয়ে যাচ্ছেন — রোভার মেট থেকে শুরু করে প্রতিটি সদস্য।"
        action={
          members.length ? <span className="badge badge-green">মোট {toBn(members.length)} জন</span> : undefined
        }
      />

      {members.length ? (
        <div className="mt-10 grid gap-12">
          {groups.map((group) => (
            <div key={group.role}>
              <h2 className="text-lg font-bold text-[color:var(--forest)]">
                {group.role}
                <span className="ml-2 text-sm font-semibold text-slate-400">{toBn(group.members.length)}</span>
              </h2>
              <div className="stagger mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}

          {ungrouped.length ? (
            <div>
              <h2 className="text-lg font-bold text-[color:var(--forest)]">
                সদস্য
                <span className="ml-2 text-sm font-semibold text-slate-400">{toBn(ungrouped.length)}</span>
              </h2>
              <div className="stagger mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ungrouped.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="surface mt-12">
          <EmptyState
            icon="👤"
            title="সদস্য তালিকা এখনো প্রকাশ করা হয়নি"
            hint="অ্যাডমিন প্যানেল থেকে সদস্য যোগ করলে তাঁরা এখানে দেখা যাবেন।"
            action={
              <ButtonLink href="/join" variant="primary">
                সদস্য হতে আবেদন করুন
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  );
}
