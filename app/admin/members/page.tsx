import PeopleManager from "@/components/admin/PeopleManager";
import { MEMBER_PEOPLE } from "@/lib/people";

export default function MembersPage() {
  return <PeopleManager config={MEMBER_PEOPLE} />;
}
