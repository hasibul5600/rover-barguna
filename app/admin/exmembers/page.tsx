import PeopleManager from "@/components/admin/PeopleManager";
import { EX_MEMBER_PEOPLE } from "@/lib/people";

export default function ExMembersPage() {
  return <PeopleManager config={EX_MEMBER_PEOPLE} />;
}
