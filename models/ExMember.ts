/**
 * Former members ("প্রাক্তন সদস্য") — rovers who have finished their time with the
 * group. Stored as ContentItem documents with collection:"exmembers", exactly like
 * current members: `title` is the person's name and everything else lives in `meta`.
 *
 * Kept as its own collection rather than a flag on "members" so the two lists can
 * never contaminate each other — /leadership must show only serving rovers, and the
 * alumni page only past ones, with no query filter to forget.
 *
 * This file stays free of mongoose imports so the admin client component can read
 * these constants without pulling the driver into the browser bundle.
 */
export type ExMemberMeta = {
  /** Last position held while serving. */
  role?: string;
  department?: string;
  session?: string;
  /** Year they left the group, e.g. "২০২২". */
  passingYear?: string;
  bsId?: string;
  bloodGroup?: string;
  /** Where they are now — job, higher study or business. */
  occupation?: string;
  phone?: string;
  email?: string;
  image?: string;
  cloudinaryId?: string;
};

export const EX_MEMBER_COLLECTION = "exmembers";
