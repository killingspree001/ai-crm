import { PageHeader } from "@/components/app/PageHeader";
import { getContacts } from "@/lib/queries";
import { NewContactButton } from "@/components/contacts/NewContactButton";
import { ContactSearch } from "@/components/contacts/ContactSearch";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <PageHeader title="Contacts" subtitle={`${contacts.length} people in your network.`}>
        <NewContactButton />
      </PageHeader>
      <div className="p-6">
        <ContactSearch contacts={contacts} />
      </div>
    </div>
  );
}
