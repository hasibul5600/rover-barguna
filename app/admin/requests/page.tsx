import PeopleManager from "@/components/admin/PeopleManager";
import { REQUEST_PEOPLE } from "@/lib/people";

export default function RequestsPage() {
  return <PeopleManager config={REQUEST_PEOPLE} />;
}
