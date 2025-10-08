import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function HostHackathonDialog() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    eventTitle: '',
    location: '',
    address: '',
    date: '', // datetime-local
    participants: '',
    budget: '',
    description: '',
  });

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.companyName || !form.contactEmail || !form.eventTitle || !form.date) {
      toast({ title: 'Missing info', description: 'Please fill company, email, title and date.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { createHostRequest } = await import('@/services/firestoreService');
      const id = await createHostRequest({
        userId: user?.id || null,
        ...form,
        participants: Number(form.participants) || 0,
        budget: Number(form.budget) || 0,
      });

      // Send confirmation email (non-blocking)
      import('@/services/emailService').then(({ sendHostRequestEmail }) => {
        sendHostRequestEmail(
          form.contactEmail, 
          form.companyName, 
          form.contactName,
          form.eventTitle,
          form.location,
          form.date,
          Number(form.participants) || 0,
          Number(form.budget) || 0,
          form.description
        ).catch(() => {});
      });

      toast({
        title: 'Request submitted',
        description: 'We received your request. Our team will reach out. ✅',
      });
      setOpen(false);
      setForm({
        companyName: '', contactName: '', contactEmail: '', phone: '', eventTitle: '', location: '', address: '', date: '', participants: '', budget: '', description: ''
      });
    } catch (e) {
      console.error('Host request failed', e);
      toast({ title: 'Failed', description: 'Could not submit request. Try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-dicey-azure hover:bg-dicey-azure/90 transition-smooth hover-lift">
          Host Hackathon
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Host a Hackathon</DialogTitle>
          <DialogDescription>Tell us about your event and we\'ll be in touch.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div>
            <Label>Company/Organization</Label>
            <Input value={form.companyName} onChange={onChange('companyName')} placeholder="Acme Corp" />
          </div>
          <div>
            <Label>Contact Name</Label>
            <Input value={form.contactName} onChange={onChange('contactName')} placeholder="Jane Doe" />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input type="email" value={form.contactEmail} onChange={onChange('contactEmail')} placeholder="jane@acme.com" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={onChange('phone')} placeholder="+234..." />
          </div>
          <div>
            <Label>Event Title</Label>
            <Input value={form.eventTitle} onChange={onChange('eventTitle')} placeholder="Acme AI Hackfest" />
          </div>
          <div>
            <Label>Date & Time</Label>
            <Input type="datetime-local" value={form.date} onChange={onChange('date')} />
          </div>
          <div>
            <Label>City/Location</Label>
            <Input value={form.location} onChange={onChange('location')} placeholder="Lagos, Nigeria" />
          </div>
          <div>
            <Label>Venue Address</Label>
            <Input value={form.address} onChange={onChange('address')} placeholder="123 Event Street" />
          </div>
          <div>
            <Label>Estimated Participants</Label>
            <Input type="number" value={form.participants} onChange={onChange('participants')} placeholder="200" />
          </div>
          <div>
            <Label>Budget (₦)</Label>
            <Input type="number" value={form.budget} onChange={onChange('budget')} placeholder="5000000" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={onChange('description')} placeholder="Scope, goals, audience, partners..." rows={4} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          {/* <Button onClick={handleSubmit} disabled={submitting} className="bg-dicey-teal hover:bg-dicey-teal/90">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button> */}
          {/* <Button onClick={handleSubmit} disabled={submitting} className="bg-dicey-teal hover:bg-dicey-teal/90 text-black dark:text-white border-1 border-black dark:border-white">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button> */}
          <Button variant="outline" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
