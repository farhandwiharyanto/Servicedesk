import RequestZohoView from '../../../components/RequestZohoView';
import { apiFetch, endpoints } from '@/lib/api';

async function getRequestDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.tickets}/${id}`);
  } catch (error) {
    console.error("Request detail fetch failed:", error);
    return null;
  }
}

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const request = await getRequestDetail(id);

  if (!request) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Request not found</div>;
  }

  return (
    <div className="animate-fade-in">
      <RequestZohoView ticketId={id} />
    </div>
  );
}
